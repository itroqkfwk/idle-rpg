import { AnimationAction, AnimationMixer, Box3, DirectionalLight, Group, HemisphereLight,
  DataTexture, EquirectangularReflectionMapping, LinearFilter, LinearSRGBColorSpace,
  LoopOnce, Mesh, NeutralToneMapping, Object3D, OrthographicCamera, Scene, SkinnedMesh,
  SRGBColorSpace, Texture, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { HeroRigState } from '../data/heroAnimationClips';

// The existing hero clock owns clip time, including hit stop and preview pause.
export function mountKnight(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!gl) return null;
  const renderer = new WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.04;
  const scene = new Scene();
  // Two broad reflected panels keep the brushed armor legible at icon size.
  // Three prefilters this small linear panorama once for the full range of roughness.
  const pixels = new Uint8Array(128 * 64 * 4);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      const u = x / 128, v = y / 64;
      const panel = Math.exp(-((u-.22)**2/.006 + (v-.70)**2/.035));
      const edge = Math.exp(-((u-.72)**2/.0025 + (v-.56)**2/.065));
      const ambient = .035 + .12 * v;
      const i = 4 * (128 * y + x);
      pixels[i] = 255 * Math.min(1, ambient + .88*panel + .48*edge);
      pixels[i+1] = 255 * Math.min(1, ambient + .78*panel + .63*edge);
      pixels[i+2] = 255 * Math.min(1, ambient + .70*panel + .83*edge);
      pixels[i+3] = 255;
    }
  }
  const studio = new DataTexture(pixels,128,64);
  studio.mapping = EquirectangularReflectionMapping;
  studio.colorSpace = LinearSRGBColorSpace;
  studio.magFilter = studio.minFilter = LinearFilter;
  studio.needsUpdate = true;
  scene.environment = studio; scene.environmentIntensity = .64;
  const fill = new HemisphereLight(0xe7efff, 0xb39994, 1.28);
  const key = new DirectionalLight(0xffebd8, 1.88), rim = new DirectionalLight(0xbcdcff, 1.4);
  scene.add(fill);
  const backdrop = canvas.closest<HTMLElement>('.battle-environment-root');
  function lightStage() {
    const chapter = Number(backdrop?.dataset.chapter);
    const cool = [2,4,5].includes(chapter);
    fill.color.set(cool ? 0xcbdfff : 0xfff0d8);
    fill.groundColor.set(cool ? 0x9c9bb4 : 0xa7a483);
    rim.color.set(chapter === 3 ? 0xffbc8d : cool ? 0xa9d5ff : 0xc4e4d2);
  }
  const stageObserver = new MutationObserver(lightStage);
  if (backdrop) stageObserver.observe(backdrop, {attributes:true, attributeFilter:['data-chapter']});
  lightStage();
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
    const textures = new Set<Texture>();
    const skeletons = new Set<SkinnedMesh['skeleton']>();
    asset.traverse(node => {
      if (node instanceof Mesh) {
        node.geometry.dispose();
        for (const mat of [node.material].flat()) materials.add(mat);
        if (node instanceof SkinnedMesh) skeletons.add(node.skeleton);
      }
    });
    for (const material of materials) {
      for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
      material.dispose();
    }
    for (const skeleton of skeletons) skeleton.dispose();
    for (const texture of textures) {
      texture.dispose();
      if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close();
    }
  }
  function dispose() {
    if (closed) return;
    closed = true; canvas.dataset.ready = 'false'; abort.abort(); observer.disconnect();
    canvas.removeEventListener('webglcontextlost',dispose);
    if (model) { mixer?.stopAllAction(); mixer?.uncacheRoot(model); release(model); }
    stageObserver.disconnect(); scene.environment = null; studio.dispose(); renderer.dispose();
    if (!gl!.isContextLost()) renderer.forceContextLoss();
  }
  canvas.addEventListener('webglcontextlost',dispose);
  async function load() {
    const url = new URL('./models/hero_knight.glb?v=2', document.baseURI);
    const res = await fetch(url,{signal:abort.signal});
    if (!res.ok) throw new Error(String(res.status));
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const data = await loader.parseAsync(await res.arrayBuffer(),new URL('.',url).href);
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
