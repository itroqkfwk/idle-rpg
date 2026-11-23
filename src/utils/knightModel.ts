import { AnimationAction, AnimationMixer, Box3, DirectionalLight, Group, HemisphereLight,
  LoopOnce, Mesh, Object3D, OrthographicCamera, Scene, SkinnedMesh, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { HeroRigState } from '../data/heroAnimationClips';

// The existing hero clock owns clip time, including hit stop and preview pause.
export function mountKnight(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const scene = new Scene();
  scene.add(new HemisphereLight(0xfff0db, 0xb8b0c6, 1.55));
  const key = new DirectionalLight(0xffead2, 2.05), rim = new DirectionalLight(0xc1deff, 1.2);
  key.position.set(-3,5,4); rim.position.set(3,3,-2); scene.add(key,rim);
  const camera = new OrthographicCamera(-1,1,1,-1,.01,40);
  camera.position.z = 9;
  const actor = new Group();
  actor.rotation.set(.09,.37,0);
  scene.add(actor);
  const abort = new AbortController(), bounds = new Box3(), size = new Vector3(), center = new Vector3();
  const actions = new Map<string, AnimationAction>();
  let model: Group | undefined, mixer: AnimationMixer | undefined, active: AnimationAction | undefined;
  let tip: Object3D, grip: Object3D;
  let lastDraw = -Infinity, closed = false;
  function resize() {
    const host = canvas.parentElement;
    if (!model || !host || !host.clientWidth || !host.clientHeight) return;
    const unit = Math.max(size.y / (host.clientHeight * .94), size.x / (host.clientWidth * .92));
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.left = center.x - w * unit / 2;
    camera.right = center.x + w * unit / 2;
    camera.bottom = bounds.min.y - host.clientHeight * unit * .025;
    camera.top = camera.bottom + h * unit;
    camera.updateProjectionMatrix(); renderer.setSize(w,h,false);
    lastDraw = -Infinity;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  function release(asset: Group) {
    const materials = new Set<import('three').Material>();
    asset.traverse(node => {
      if (node instanceof Mesh) {
        node.geometry.dispose();
        for (const mat of [node.material].flat()) materials.add(mat);
        if (node instanceof SkinnedMesh) node.skeleton.dispose();
      }
    });
    for (const material of materials) material.dispose();
  }
  function dispose() {
    if (closed) return;
    closed = true; canvas.dataset.ready = 'false'; abort.abort(); observer.disconnect();
    canvas.removeEventListener('webglcontextlost',dispose);
    if (model) { mixer?.stopAllAction(); mixer?.uncacheRoot(model); release(model); }
    renderer.dispose();
    if (!gl!.isContextLost()) renderer.forceContextLoss();
  }
  canvas.addEventListener('webglcontextlost',dispose);
  async function load() {
    const url = new URL('./models/hero_knight.glb', document.baseURI);
    const res = await fetch(url,{signal:abort.signal});
    if (!res.ok) throw new Error(String(res.status));
    const data = await new GLTFLoader().parseAsync(await res.arrayBuffer(),new URL('.',url).href);
    if (closed) { release(data.scene); return; }
    model = data.scene; actor.add(model); mixer = new AnimationMixer(model);
    tip = model.getObjectByName('WeaponTip')!; grip = model.getObjectByName('WeaponGrip')!;
    if (!tip || !grip) throw new Error('Missing sword sockets');
    for (const clip of data.animations) {
      const action = mixer.clipAction(clip);
      action.setLoop(LoopOnce,1); action.clampWhenFinished = true;
      actions.set(clip.name,action);
    }
    bounds.setFromObject(actor,true); bounds.getCenter(center); bounds.getSize(size); resize();
  }
  void load().catch(dispose);
  const pt = new Vector3();
  function draw(now: number, state: HeroRigState, progress: number) {
    if (closed || !mixer || !tip || !grip || document.hidden || !canvas.clientWidth) return;
    const name = state === 'SkillCast' ? 'Attack3' : state;
    const next = actions.get(name);
    if (!next) return;
    if (active !== next || now - lastDraw >= 1000 / 30 - 1) {
      if (active !== next) { active?.stop(); active = next.reset().play(); }
      next.time = next.getClip().duration * progress;
      mixer.update(0);
      try { renderer.render(scene,camera); } catch { dispose(); return; }
      if (gl!.isContextLost()) { dispose(); return; }
      lastDraw = now; canvas.dataset.ready = 'true'; canvas.dataset.clip = name;
    }
    const rect = canvas.getBoundingClientRect();
    const project = (node: Object3D) => {
      node.getWorldPosition(pt).project(camera);
      return {x: rect.left + (1+pt.x)*rect.width/2, y: rect.top + (1-pt.y)*rect.height/2};
    };
    const weaponGrip = project(grip), weaponTip = project(tip);
    return { weaponGrip, weaponTip, rightHand:weaponGrip, staffTip:weaponTip };
  }
  return { draw, dispose };
}
