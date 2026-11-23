import {
  AnimationAction, AnimationMixer, Box3, DirectionalLight, Group, HemisphereLight,
  LoopOnce, Mesh, OrthographicCamera, Scene, SkinnedMesh, Texture, Vector3, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { MonsterRigState } from '../data/monsterAnimationClips';
import type { MonsterSceneAttachments } from './combatAnchorRegistry';

type Clip = 'Idle' | 'JumpAttack' | 'Hit' | 'Death';
const clipNames: Clip[] = ['Idle', 'JumpAttack', 'Hit', 'Death'];
// The exported leap reaches its strike on Blender frame 12 (clip starts at frame 1).
const contactTime = 11 / 30;
const attackWindupSeconds = 0.120;
export interface FrogSignals {
  animState: MonsterRigState;
  attacking: boolean;
  hp?: number;
  locked: boolean;
  paused: boolean;
}
interface FrameSample {
  now: number; mixerMs: number; calls: number; triangles: number;
  geometries: number; textures: number; clip: Clip; actionTime: number; loadMs: number;
}
declare global {
  interface Window {
    __frogPerf?: (sample: FrameSample | {disposed: true; geometries: number; textures: number}) => void;
  }
}

export function mountLilyFrog(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const scene = new Scene();
  scene.add(new HemisphereLight(0xfff1d3, 0xb9cab5, 1.65));
  const key = new DirectionalLight(0xffeccf, 1.85);
  key.position.set(-3, 5, 4);
  const rim = new DirectionalLight(0xbce2ee, 0.9);
  rim.position.set(2, 3, -3);
  scene.add(key, rim);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
  camera.position.z = 8;
  camera.updateMatrixWorld();
  const actor = new Group();
  actor.rotation.set(0.19, -0.80, 0);
  scene.add(actor);
  const abort = new AbortController();
  const started = performance.now();
  let loadMs = 0;
  let model: Group | undefined;
  let mixer: AnimationMixer | undefined;
  let actions: Record<Clip, AnimationAction> | undefined;
  let active: Clip = 'Idle';
  let previous: FrogSignals | undefined;
  let queuedHit = false;
  let disposed = false;
  let lastDraw: number | undefined;
  let wasPaused = false;
  const bounds = new Box3(), size = new Vector3(), center = new Vector3();
  const point = new Vector3(), neck = new Vector3(), muzzle = new Vector3(), ground = new Vector3();
  let body: import('three').Object3D, head: import('three').Object3D,
    jaw: import('three').Object3D, floor: import('three').Object3D;
  let lastPose: MonsterSceneAttachments | undefined;
  let width = 0, height = 0;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height || !model) return;
    // The canvas extends beyond the sprite slot so the hop has room above and to the left.
    const slot = canvas.parentElement!;
    const unit = Math.max(size.x / (slot.clientWidth * 0.96), size.y / (slot.clientHeight * 0.81));
    camera.left = center.x - width * unit / 2;
    camera.right = center.x + width * unit / 2;
    camera.bottom = bounds.min.y - unit * slot.clientHeight * 0.025;
    camera.top = camera.bottom + height * unit;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    lastDraw = undefined;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  function disposeResources(source: Group) {
    const geometries = new Set<import('three').BufferGeometry>();
    const materials = new Set<import('three').Material>();
    const skeletons = new Set<import('three').Skeleton>();
    const textures = new Set<Texture>();
    source.traverse(node => {
      if (!(node instanceof Mesh)) return;
      if (node instanceof SkinnedMesh) skeletons.add(node.skeleton);
      geometries.add(node.geometry);
      for (const mat of [node.material].flat()) materials.add(mat);
    });
    for (const mat of materials) {
      for (const v of Object.values(mat)) if (v instanceof Texture) textures.add(v);
      mat.dispose();
    }
    for (const texture of textures) texture.dispose();
    for (const geometry of geometries) geometry.dispose();
    for (const skeleton of skeletons) skeleton.dispose();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    canvas.dataset.ready = 'false';
    abort.abort();
    observer.disconnect();
    canvas.removeEventListener('webglcontextlost', dispose);
    if (model) {
      mixer?.stopAllAction();
      mixer?.uncacheRoot(model);
      actor.remove(model);
      disposeResources(model);
    }
    renderer.dispose();
    if (!gl!.isContextLost()) renderer.forceContextLoss();
    window.__frogPerf?.({ disposed: true, ...renderer.info.memory });
  }
  canvas.addEventListener('webglcontextlost', dispose);
  async function load() {
    const url = new URL('./models/c2_m2.glb', document.baseURI);
    const response = await fetch(url, { signal: abort.signal });
    if (!response.ok) throw new Error(`Frog model HTTP ${response.status}`);
    const file = await new GLTFLoader().parseAsync(await response.arrayBuffer(), new URL('.', url).href);
    if (disposed) { disposeResources(file.scene); return; }
    model = file.scene;
    actor.add(model);
    const bone = (name: string) => {
      const object = model!.getObjectByName(name);
      if (!object) throw new Error(`Missing frog bone ${name}`);
      return object;
    };
    body = bone('Body'); head = bone('Head'); jaw = bone('Jaw'); floor = bone('Root');
    mixer = new AnimationMixer(model);
    const clips = {} as Record<Clip, AnimationAction>;
    for (const name of clipNames) {
      const clip = file.animations.find(c => c.name === name);
      if (!clip || !clip.duration) throw new Error(`Missing frog clip ${name}`);
      const action = mixer.clipAction(clip);
      if (name !== 'Idle') { action.setLoop(LoopOnce, 1); action.clampWhenFinished = true; }
      clips[name] = action;
    }
    actions = clips;
    actions.Idle.play();
    mixer.update(0);
    actor.updateMatrixWorld(true);
    bounds.setFromObject(actor, true);
    bounds.getSize(size);
    bounds.getCenter(center);
    resize();
    loadMs = performance.now() - started;
  }
  void load().catch(dispose);

  function play(next: Clip, restart = false) {
    const oldAction = actions![active];
    if (next === active && !restart) return;
    const action = actions![next];
    action.reset().setEffectiveWeight(1).setEffectiveTimeScale(next === 'Death' ? action.getClip().duration / 0.34 : 1);
    action.play();
    if (next !== active) oldAction.crossFadeTo(action, next === 'Death' ? 0.045 : 0.055, false);
    active = next;
    canvas.dataset.clip = next;
  }
  function syncSignals(next: FrogSignals) {
    const dead = next.animState === 'Defeat';
    const wasDead = previous?.animState === 'Defeat';
    const hit = next.animState.startsWith('Hit');
    const damaged = next.hp !== undefined && previous?.hp !== undefined && next.hp < previous.hp;
    const strike = next.attacking && !previous?.attacking;
    if (dead) { queuedHit = false; play('Death'); }
    else if (wasDead) {
      // Farming often respawns the very same species without unmounting its sprite slot.
      mixer!.stopAllAction();
      active = 'Idle';
      queuedHit = false;
      play('Idle', true);
    } else if (strike && !next.locked) {
      queuedHit = false;
      play('JumpAttack', true);
    } else if (damaged || (hit && previous?.animState !== next.animState)) {
      if (active === 'JumpAttack' && actions!.JumpAttack.time < contactTime) queuedHit = true;
      else play('Hit', true);
    } else if (next.locked && active === 'JumpAttack') {
      queuedHit = false;
      play('Idle');
    }
    previous = next;
  }

  function draw(now: number, signals: FrogSignals): MonsterSceneAttachments | undefined {
    if (!actions || !mixer || disposed || document.hidden) return;
    syncSignals(signals);
    if (!width || !height) return;
    if (lastDraw !== undefined && now - lastDraw < 1000 / 30 - 1) {
      if (signals.paused) wasPaused = true;
      return lastPose;
    }
    const dt = lastDraw === undefined || wasPaused ? 0 : Math.min(0.08, (now - lastDraw) / 1000);
    lastDraw = now;
    wasPaused = signals.paused;
    const move = signals.paused || (signals.locked && active !== 'Death') ? 0 : dt;
    const action = actions[active];
    const beforeUpdate = window.__frogPerf ? performance.now() : 0;
    if (active === 'JumpAttack') {
      // Reach the authored strike pose at the existing damage timer, then recover more gently.
      const beforeContact = Math.min(move, Math.max(0, (contactTime - action.time) / (contactTime / attackWindupSeconds)));
      if (beforeContact > 0) {
        action.timeScale = contactTime / attackWindupSeconds;
        mixer.update(beforeContact);
      }
      action.timeScale = (action.getClip().duration - contactTime) / 0.255;
      mixer.update(move - beforeContact);
      if (queuedHit && action.time >= contactTime - 1e-5) { queuedHit = false; play('Hit'); }
    } else mixer.update(move);
    if ((active === 'Hit' || active === 'JumpAttack') && actions[active].paused) play('Idle');
    const mixerMs = beforeUpdate ? performance.now() - beforeUpdate : 0;
    try { renderer.render(scene, camera); }
    catch { dispose(); return; }
    if (gl!.isContextLost()) { dispose(); return; }
    canvas.dataset.ready = 'true';
    canvas.dataset.clip = active;
    window.__frogPerf?.({ now, mixerMs, calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles, ...renderer.info.memory,
      clip: active, actionTime: actions[active].time, loadMs });
    const rect = canvas.getBoundingClientRect();
    function project(v: Vector3) {
      v.project(camera);
      return { x: rect.left + (v.x + 1) * rect.width / 2, y: rect.top + (1 - v.y) * rect.height / 2 };
    }
    body.getWorldPosition(point);
    head.getWorldPosition(neck);
    jaw.getWorldPosition(muzzle);
    point.lerp(neck, 0.62);
    neck.lerp(muzzle, 0.5);
    floor.getWorldPosition(ground);
    ground.y = bounds.min.y;
    lastPose = {
      updatedAt: now, monsterId: 'c2_m2', archetype: 'frog', animState: signals.animState, clipId: active,
      bodyCenter: project(point), headCenter: project(neck), attackOrigin: project(muzzle),
      groundContact: project(ground), canvasRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
    };
    return lastPose;
  }
  return { draw, dispose };
}
