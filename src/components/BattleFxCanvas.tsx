import React, { useEffect, useRef } from 'react';
import { SkillEffectType, CharacterClassId } from '../types/game';
import { AmbientParticleType } from '../data/stages';

interface BattleFxCanvasProps {
  activeSkillVfx: { id: string; type: SkillEffectType } | null;
  isAwakeningCasting?: boolean;
  classId?: CharacterClassId;
  isPlayerAttacking?: boolean;
  isMonsterHit?: boolean;
  ambientType?: AmbientParticleType;
}

// 💥 Directional Velocity-Stretched Physics Spark
interface PhysicsSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  coreColor?: string;
  width: number;
  gravity: number;
  drag: number;
  bounceGroundY: number;
  bouncesLeft: number;
}

// ⚔️ Tapered Bezier Blade Slash Arc
interface ProceduralSlash {
  id: string;
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  maxThickness: number;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
  rotation: number;
  clockwise?: boolean;
}

// 🌊 Supersonic Shockwave Ring
interface ShockwaveRing {
  x: number;
  y: number;
  currentRadius: number;
  maxRadius: number;
  speed: number;
  thickness: number;
  color: string;
  aspectY: number; // For ground perspective (e.g. 0.45 = oval)
  life: number;
  maxLife: number;
}

// ⚡ Midpoint Displacement Lightning
interface LightningSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LightningBolt {
  id: string;
  segments: LightningSegment[];
  branches: LightningSegment[][];
  color: string;
  coreColor: string;
  life: number;
  maxLife: number;
  width: number;
}

// ☄️ Projectile System
interface ActiveProjectile {
  id: string;
  type: 'magic_missile' | 'fireball' | 'ice_spear' | 'sword_wave' | 'meteor' | 'mage_bolt';
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
  waveOffset?: number; // For helix magic missile
  wavePhase?: number;
  trail: { x: number; y: number; alpha: number; size: number }[];
}

// 🌋 Ground Fissure Crack
interface GroundFissure {
  id: string;
  originX: number;
  originY: number;
  cracks: { x: number; y: number }[][];
  color: string;
  life: number;
  maxLife: number;
}

// 🍃 Ambient Particle
interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
}

// Helper: Tapered crescent blade path
function drawTaperedCrescentPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  maxThickness: number,
  progress: number
) {
  const steps = 28;
  const outerPoints: { x: number; y: number }[] = [];
  const innerPoints: { x: number; y: number }[] = [];

  // Arc sweeps forward as progress proceeds
  const currentEndAngle = startAngle + (endAngle - startAngle) * Math.min(1, progress * 1.6);
  const currentStartAngle = startAngle + (endAngle - startAngle) * Math.max(0, (progress - 0.45) * 1.8);

  const angleSpan = currentEndAngle - currentStartAngle;
  if (Math.abs(angleSpan) < 0.05) return;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = currentStartAngle + angleSpan * t;
    // Thickness reaches peak in center and tapers to 0 at ends: sin(pi * t)
    const thickness = maxThickness * Math.sin(Math.PI * t);

    const rOuter = radius + thickness * 0.5;
    const rInner = Math.max(1, radius - thickness * 0.5);

    outerPoints.push({
      x: cx + Math.cos(theta) * rOuter,
      y: cy + Math.sin(theta) * rOuter,
    });
    innerPoints.unshift({
      x: cx + Math.cos(theta) * rInner,
      y: cy + Math.sin(theta) * rInner,
    });
  }

  ctx.beginPath();
  if (outerPoints.length > 0) {
    ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
    for (let i = 1; i < outerPoints.length; i++) {
      ctx.lineTo(outerPoints[i].x, outerPoints[i].y);
    }
    for (let i = 0; i < innerPoints.length; i++) {
      ctx.lineTo(innerPoints[i].x, innerPoints[i].y);
    }
  }
  ctx.closePath();
}

// Helper: Recursive midpoint displacement for lightning
function generateLightning(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  displace: number,
  depth: number,
  branchProb = 0.2
): { main: LightningSegment[]; branches: LightningSegment[][] } {
  const segments: LightningSegment[] = [];
  const branches: LightningSegment[][] = [];

  function subdivide(sx1: number, sy1: number, sx2: number, sy2: number, disp: number, curDepth: number) {
    if (curDepth <= 0 || disp < 2) {
      segments.push({ x1: sx1, y1: sy1, x2: sx2, y2: sy2 });
      return;
    }

    const midX = (sx1 + sx2) / 2;
    const midY = (sy1 + sy2) / 2;

    const dx = sx2 - sx1;
    const dy = sy2 - sy1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / (len || 1);
    const ny = dx / (len || 1);

    const jitter = (Math.random() - 0.5) * disp;
    const newMidX = midX + nx * jitter;
    const newMidY = midY + ny * jitter;

    // Optional Sub-Branch
    if (Math.random() < branchProb && curDepth >= 2) {
      const branchAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
      const branchLen = len * 0.45;
      const bEndX = newMidX + Math.cos(branchAngle) * branchLen;
      const bEndY = newMidY + Math.sin(branchAngle) * branchLen;
      const subBranch: LightningSegment[] = [];
      subBranch.push({ x1: newMidX, y1: newMidY, x2: bEndX, y2: bEndY });
      branches.push(subBranch);
    }

    subdivide(sx1, sy1, newMidX, newMidY, disp * 0.52, curDepth - 1);
    subdivide(newMidX, newMidY, sx2, sy2, disp * 0.52, curDepth - 1);
  }

  subdivide(x1, y1, x2, y2, displace, depth);
  return { main: segments, branches };
}

export const BattleFxCanvas: React.FC<BattleFxCanvasProps> = ({
  activeSkillVfx,
  isAwakeningCasting = false,
  classId = 'warrior',
  isPlayerAttacking = false,
  isMonsterHit = false,
  ambientType = 'leaves',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // FX Simulation Collections
  const sparksRef = useRef<PhysicsSpark[]>([]);
  const slashesRef = useRef<ProceduralSlash[]>([]);
  const shockwavesRef = useRef<ShockwaveRing[]>([]);
  const lightningRef = useRef<LightningBolt[]>([]);
  const projectilesRef = useRef<ActiveProjectile[]>([]);
  const fissuresRef = useRef<GroundFissure[]>([]);
  const ambientParticlesRef = useRef<AmbientParticle[]>([]);

  // Awakening Sequence Timer / Progress
  const awakeningAnimRef = useRef<{
    active: boolean;
    classId: CharacterClassId;
    startTime: number;
    targetX: number;
    targetY: number;
    groundY: number;
  } | null>(null);

  const lastTimeRef = useRef<number>(performance.now());
  const activeVfxIdRef = useRef<string | null>(null);

  // Anchor Calculation relative to canvas coordinates
  const getAnchors = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { heroX: 300, heroY: 450, monsterX: 700, monsterY: 450, groundY: 560 };
    }
    const canvasRect = canvas.getBoundingClientRect();
    const heroEl = document.querySelector('.hero-slot') || document.querySelector('.player-avatar-wrapper');
    const enemyEl = document.querySelector('.enemy-slot') || document.querySelector('.enemy-2d-container');

    let heroX = canvas.width * 0.34;
    let heroY = canvas.height * 0.58;
    let monsterX = canvas.width * 0.68;
    let monsterY = canvas.height * 0.58;
    let groundY = canvas.height * 0.74;

    if (heroEl && canvasRect.width > 0) {
      const hr = heroEl.getBoundingClientRect();
      heroX = (hr.left + hr.width * 0.68 - canvasRect.left) * (canvas.width / canvasRect.width);
      heroY = (hr.top + hr.height * 0.48 - canvasRect.top) * (canvas.height / canvasRect.height);
    }
    if (enemyEl && canvasRect.width > 0) {
      const er = enemyEl.getBoundingClientRect();
      monsterX = (er.left + er.width * 0.5 - canvasRect.left) * (canvas.width / canvasRect.width);
      monsterY = (er.top + er.height * 0.5 - canvasRect.top) * (canvas.height / canvasRect.height);
      groundY = (er.bottom - 12 - canvasRect.top) * (canvas.height / canvasRect.height);
    }

    return { heroX, heroY, monsterX, monsterY, groundY };
  };

  // Helper: Spawn velocity-stretched directional sparks
  const spawnDirectionalSparks = (
    x: number,
    y: number,
    count: number,
    color: string,
    dirAngle: number,
    spread: number,
    baseSpeed: number,
    groundY: number
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = dirAngle + (Math.random() - 0.5) * spread;
      const speed = baseSpeed * (0.55 + Math.random() * 0.9);
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.28 + Math.random() * 0.22,
        color,
        coreColor: '#ffffff',
        width: 1.8 + Math.random() * 1.5,
        gravity: 0.35,
        drag: 0.94,
        bounceGroundY: groundY,
        bouncesLeft: 2,
      });
    }
  };

  // Helper: Spawn shockwave ring
  const spawnShockwave = (
    x: number,
    y: number,
    maxRadius: number,
    speed: number,
    color: string,
    aspectY = 1.0,
    thickness = 5
  ) => {
    shockwavesRef.current.push({
      x,
      y,
      currentRadius: 6,
      maxRadius,
      speed,
      thickness,
      color,
      aspectY,
      life: 0,
      maxLife: maxRadius / speed,
    });
  };

  // ==========================================
  // Trigger Skill Effects
  // ==========================================
  useEffect(() => {
    if (!activeSkillVfx) return;
    if (activeVfxIdRef.current === activeSkillVfx.id) return;
    activeVfxIdRef.current = activeSkillVfx.id;

    const { heroX, heroY, monsterX, monsterY, groundY } = getAnchors();
    const type = activeSkillVfx.type;

    // =======================================
    // ⚔️ WARRIOR SKILLS
    // =======================================
    if (type === 'power_slash') {
      // 1. Power Slash: Flaming tapered crescent blade + directional sparks + ground shockwave
      slashesRef.current.push({
        id: `ps_${Date.now()}`,
        x: monsterX - 10,
        y: monsterY,
        radius: 95,
        startAngle: -Math.PI * 0.85,
        endAngle: Math.PI * 0.35,
        maxThickness: 28,
        color: '#f97316',
        glowColor: '#ea580c',
        life: 0,
        maxLife: 0.24,
        rotation: 0.2,
      });
      // Supersonic ground shockwave
      spawnShockwave(monsterX, groundY, 75, 420, '#fbbf24', 0.45, 6);
      // Directional spark fan
      spawnDirectionalSparks(monsterX, monsterY, 26, '#f97316', Math.PI * 0.7, 1.2, 9, groundY);
    } else if (type === 'double_slash') {
      // 2. Double Slash: Staggered X-cross cuts
      // Cut 1: top-left to bottom-right
      slashesRef.current.push({
        id: `ds1_${Date.now()}`,
        x: monsterX,
        y: monsterY,
        radius: 80,
        startAngle: -Math.PI * 0.75,
        endAngle: Math.PI * 0.25,
        maxThickness: 22,
        color: '#38bdf8',
        glowColor: '#0284c7',
        life: 0,
        maxLife: 0.20,
        rotation: 0.45,
      });
      spawnDirectionalSparks(monsterX, monsterY, 14, '#38bdf8', Math.PI * 0.25, 1.0, 7.5, groundY);

      // Cut 2: top-right to bottom-left (staggered 75ms)
      setTimeout(() => {
        slashesRef.current.push({
          id: `ds2_${Date.now()}`,
          x: monsterX,
          y: monsterY,
          radius: 85,
          startAngle: Math.PI * 0.75,
          endAngle: -Math.PI * 0.25,
          maxThickness: 24,
          color: '#fbbf24',
          glowColor: '#d97706',
          life: 0,
          maxLife: 0.20,
          rotation: -0.45,
        });
        spawnShockwave(monsterX, monsterY, 65, 380, '#fef08a', 0.8, 5);
        spawnDirectionalSparks(monsterX, monsterY, 18, '#fbbf24', Math.PI * 0.75, 1.0, 8.5, groundY);
      }, 75);
    } else if (type === 'sword_wave' || type === 'wind_blade') {
      // 3. Sword Wave: Ground-skimming sonic jade crescent projectile
      projectilesRef.current.push({
        id: `sw_${Date.now()}`,
        type: 'sword_wave',
        startX: heroX,
        startY: heroY,
        targetX: monsterX,
        targetY: monsterY,
        currentX: heroX,
        currentY: heroY,
        progress: 0,
        speed: 0.065,
        color: '#10b981',
        size: 32,
        trail: [],
      });
    } else if (type === 'whirlwind') {
      // 4. Whirlwind: 3-layer rotating cyclone ribbons
      const radii = [52, 78, 104];
      const colors = ['#f59e0b', '#fbbf24', '#fef08a'];
      for (let r = 0; r < 3; r++) {
        setTimeout(() => {
          slashesRef.current.push({
            id: `ww_${Date.now()}_${r}`,
            x: monsterX,
            y: monsterY,
            radius: radii[r],
            startAngle: -Math.PI,
            endAngle: Math.PI * 1.2,
            maxThickness: 20,
            color: colors[r],
            glowColor: '#d97706',
            life: 0,
            maxLife: 0.36,
            rotation: r * 0.6,
          });
          spawnDirectionalSparks(monsterX, monsterY, 12, colors[r], Math.random() * Math.PI * 2, 2.0, 7.5, groundY);
        }, r * 60);
      }
      spawnShockwave(monsterX, groundY, 110, 320, '#fbbf24', 0.42, 5);
    } else if (type === 'shield_bash') {
      // 5. Shield Bash: Hexagonal golden energy barrier + supersonic shockwave cone (NO emojis!)
      spawnShockwave(heroX + 30, heroY, 90, 520, '#fbbf24', 0.65, 8);
      // Secondary heavy shockwave hitting monster directly
      setTimeout(() => {
        spawnShockwave(monsterX, monsterY, 80, 480, '#f59e0b', 0.85, 7);
        spawnDirectionalSparks(monsterX, monsterY, 24, '#fbbf24', 0, 1.4, 10, groundY);
      }, 70);
    } else if (type === 'blade_storm') {
      // 6. Blade Storm: 6 rapid spatial razor cuts + final vertical cleave
      const angles = [0.3, -0.6, 0.8, -0.4, 0.5, -0.7];
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          slashesRef.current.push({
            id: `bs_${Date.now()}_${i}`,
            x: monsterX + (Math.random() - 0.5) * 36,
            y: monsterY + (Math.random() - 0.5) * 36,
            radius: 75 + Math.random() * 20,
            startAngle: -Math.PI * 0.8,
            endAngle: Math.PI * 0.3,
            maxThickness: 18,
            color: i % 2 === 0 ? '#ef4444' : '#fbbf24',
            glowColor: '#b91c1c',
            life: 0,
            maxLife: 0.16,
            rotation: angles[i],
          });
          spawnDirectionalSparks(monsterX, monsterY, 10, '#ef4444', angles[i], 1.2, 8, groundY);
        }, i * 45);
      }
      // Final vertical cleave
      setTimeout(() => {
        slashesRef.current.push({
          id: `bs_fin_${Date.now()}`,
          x: monsterX,
          y: monsterY,
          radius: 110,
          startAngle: -Math.PI * 0.9,
          endAngle: Math.PI * 0.4,
          maxThickness: 34,
          color: '#ffffff',
          glowColor: '#ef4444',
          life: 0,
          maxLife: 0.28,
          rotation: 0,
        });
        spawnShockwave(monsterX, groundY, 120, 450, '#ef4444', 0.45, 8);
        spawnDirectionalSparks(monsterX, monsterY, 32, '#fef08a', Math.PI * 0.5, 2.0, 11, groundY);
      }, 300);
    } else if (type === 'heavenly_blade' || (isAwakeningCasting && classId === 'warrior')) {
      // 7. Heavenly Blade (Warrior Awakening): Colossal Golden Greatsword + Ground Fissures + Holy Cross Flash
      awakeningAnimRef.current = {
        active: true,
        classId: 'warrior',
        startTime: performance.now(),
        targetX: monsterX,
        targetY: monsterY,
        groundY: groundY,
      };
      // Ground fissure cracks
      const fissureCracks: { x: number; y: number }[][] = [];
      for (let c = 0; c < 5; c++) {
        const crackPath: { x: number; y: number }[] = [{ x: monsterX, y: groundY }];
        let curX = monsterX;
        let curY = groundY;
        const cAngle = (c / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        for (let s = 0; s < 4; s++) {
          curX += Math.cos(cAngle) * (20 + Math.random() * 15);
          curY += Math.sin(cAngle) * (10 + Math.random() * 8);
          crackPath.push({ x: curX, y: curY });
        }
        fissureCracks.push(crackPath);
      }
      fissuresRef.current.push({
        id: `fis_${Date.now()}`,
        originX: monsterX,
        originY: groundY,
        cracks: fissureCracks,
        color: '#fbbf24',
        life: 0,
        maxLife: 0.75,
      });

      // Impact shockwaves
      setTimeout(() => {
        spawnShockwave(monsterX, groundY, 140, 480, '#fef08a', 0.42, 10);
        spawnShockwave(monsterX, monsterY, 100, 380, '#ffffff', 0.9, 8);
        spawnDirectionalSparks(monsterX, groundY - 20, 45, '#fbbf24', -Math.PI * 0.5, 2.2, 12, groundY);
      }, 260);
    }

    // =======================================
    // 🔮 MAGE SKILLS
    // =======================================
    else if (type === 'magic_missile') {
      // 1. Magic Missile: 3 double-helix homing comets
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          projectilesRef.current.push({
            id: `mm_${Date.now()}_${i}`,
            type: 'magic_missile',
            startX: heroX,
            startY: heroY + (i - 1) * 16,
            targetX: monsterX,
            targetY: monsterY + (i - 1) * 18,
            currentX: heroX,
            currentY: heroY + (i - 1) * 16,
            progress: 0,
            speed: 0.055,
            color: '#38bdf8',
            size: 10,
            waveOffset: (i - 1) * 22,
            wavePhase: i * 1.8,
            trail: [],
          });
        }, i * 65);
      }
    } else if (type === 'fireball') {
      // 2. Fireball: Swirling magma core -> giant dome explosion
      projectilesRef.current.push({
        id: `fb_${Date.now()}`,
        type: 'fireball',
        startX: heroX,
        startY: heroY,
        targetX: monsterX,
        targetY: monsterY,
        currentX: heroX,
        currentY: heroY,
        progress: 0,
        speed: 0.046,
        color: '#f97316',
        size: 20,
        trail: [],
      });
    } else if (type === 'ice_spear') {
      // 3. Ice Spear: Rotating faceted crystalline lance -> frost nova shrapnel
      projectilesRef.current.push({
        id: `is_${Date.now()}`,
        type: 'ice_spear',
        startX: heroX,
        startY: heroY,
        targetX: monsterX,
        targetY: monsterY,
        currentX: heroX,
        currentY: heroY,
        progress: 0,
        speed: 0.058,
        color: '#67e8f9',
        size: 16,
        trail: [],
      });
    } else if (type === 'chain_lightning') {
      // 4. Chain Lightning: Branching plasma bolts from sky & staff to monster
      for (let bolt = 0; bolt < 3; bolt++) {
        setTimeout(() => {
          const startX = bolt === 0 ? heroX : monsterX + (Math.random() - 0.5) * 60;
          const startY = bolt === 0 ? heroY : -20;
          const endX = monsterX + (Math.random() - 0.5) * 30;
          const endY = monsterY + (Math.random() - 0.5) * 30;

          const { main, branches } = generateLightning(startX, startY, endX, endY, 42, 5, 0.35);
          lightningRef.current.push({
            id: `cl_${Date.now()}_${bolt}`,
            segments: main,
            branches: branches,
            color: '#818cf8',
            coreColor: '#ffffff',
            life: 0,
            maxLife: 0.22,
            width: 3.2,
          });

          spawnShockwave(endX, endY, 55, 380, '#38bdf8', 0.8, 5);
          spawnDirectionalSparks(endX, endY, 16, '#c084fc', Math.random() * Math.PI * 2, 2.5, 8.5, groundY);
        }, bolt * 80);
      }
    } else if (type === 'meteor') {
      // 5. Meteor: Fiery celestial asteroid diagonal plunge
      projectilesRef.current.push({
        id: `met_${Date.now()}`,
        type: 'meteor',
        startX: monsterX - 220,
        startY: -60,
        targetX: monsterX,
        targetY: groundY - 10,
        currentX: monsterX - 220,
        currentY: -60,
        progress: 0,
        speed: 0.042,
        color: '#ef4444',
        size: 38,
        trail: [],
      });
    } else if (type === 'arcane_storm') {
      // 6. Arcane Storm: 5 sequential cosmic stardust pillar explosions
      for (let s = 0; s < 5; s++) {
        setTimeout(() => {
          const px = monsterX + (Math.random() - 0.5) * 50;
          const py = monsterY + (Math.random() - 0.5) * 40;
          spawnShockwave(px, py, 60, 420, '#c084fc', 0.6, 6);
          spawnDirectionalSparks(px, py, 15, '#e879f9', -Math.PI * 0.5, 1.8, 8.5, groundY);
        }, s * 55);
      }
    } else if (type === 'astral_cataclysm' || (isAwakeningCasting && classId === 'mage')) {
      // 7. Astral Cataclysm (Mage Awakening): Cosmic Gate + Starlight Bombardment + Supernova
      awakeningAnimRef.current = {
        active: true,
        classId: 'mage',
        startTime: performance.now(),
        targetX: monsterX,
        targetY: monsterY,
        groundY: groundY,
      };

      // 4 mini meteors bombarding
      for (let m = 0; m < 4; m++) {
        setTimeout(() => {
          projectilesRef.current.push({
            id: `astral_star_${Date.now()}_${m}`,
            type: 'magic_missile',
            startX: monsterX - 120 + m * 50,
            startY: -30,
            targetX: monsterX + (m - 1.5) * 24,
            targetY: monsterY + (Math.random() - 0.5) * 20,
            currentX: monsterX - 120 + m * 50,
            currentY: -30,
            progress: 0,
            speed: 0.075,
            color: '#c084fc',
            size: 14,
            trail: [],
          });
        }, m * 60);
      }

      // Grand Supernova Shockwave
      setTimeout(() => {
        spawnShockwave(monsterX, monsterY, 150, 480, '#f43f5e', 0.9, 10);
        spawnShockwave(monsterX, groundY, 130, 390, '#c084fc', 0.45, 8);
        spawnDirectionalSparks(monsterX, monsterY, 50, '#38bdf8', Math.random() * Math.PI * 2, 3.14, 11, groundY);
      }, 340);
    }
  }, [activeSkillVfx, isAwakeningCasting, classId]);

  // ==========================================
  // Trigger Mage Basic Attack Projectile
  // ==========================================
  useEffect(() => {
    if (!isPlayerAttacking || classId !== 'mage') return;
    const { heroX, heroY, monsterX, monsterY } = getAnchors();

    projectilesRef.current.push({
      id: `mage_basic_${Date.now()}`,
      type: 'mage_bolt',
      startX: heroX,
      startY: heroY,
      targetX: monsterX,
      targetY: monsterY,
      currentX: heroX,
      currentY: heroY,
      progress: 0,
      speed: 0.075,
      color: '#38bdf8',
      size: 11,
      trail: [],
    });
  }, [isPlayerAttacking, classId]);

  // ==========================================
  // Trigger Contact Impact Sparks on Monster Hit
  // ==========================================
  useEffect(() => {
    if (!isMonsterHit) return;
    const { monsterX, monsterY, groundY } = getAnchors();
    const count = classId === 'warrior' ? 18 : 14;
    const color = classId === 'warrior' ? '#fbbf24' : '#38bdf8';

    spawnDirectionalSparks(
      monsterX,
      monsterY,
      count,
      color,
      classId === 'warrior' ? Math.PI * 0.75 : 0,
      1.5,
      8.5,
      groundY
    );
  }, [isMonsterHit, classId]);

  // ==========================================
  // Main Canvas Render Loop (60 FPS)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize ambient particles
    ambientParticlesRef.current = [];
    const ambientCount = 20;
    for (let i = 0; i < ambientCount; i++) {
      ambientParticlesRef.current.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        vx: (Math.random() - 0.5) * 0.6 + 0.35,
        vy: Math.random() * 0.45 + 0.25,
        life: Math.random() * 5,
        maxLife: 8,
        size: Math.random() * 4 + 2,
        color:
          ambientType === 'maple_leaves'
            ? '#ef4444'
            : ambientType === 'water_orbs'
            ? '#38bdf8'
            : ambientType === 'boss_embers'
            ? '#f97316'
            : '#4ade80',
        alpha: Math.random() * 0.6 + 0.25,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
      });
    }

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ----------------------------------------------------
      // 1. Draw Ambient Particles (Natural Blending)
      // ----------------------------------------------------
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < ambientParticlesRef.current.length; i++) {
        const p = ambientParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (ambientType === 'maple_leaves') {
          // Sharp Japanese maple leaf petal
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.8, -p.size * 0.3);
          ctx.lineTo(p.size * 1.6, 0);
          ctx.lineTo(p.size * 0.5, p.size * 0.8);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.5, p.size * 0.8);
          ctx.lineTo(-p.size * 1.6, 0);
          ctx.lineTo(-p.size * 0.8, -p.size * 0.3);
          ctx.closePath();
          ctx.fill();
        } else if (ambientType === 'water_orbs') {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Green Forest Willow Leaf
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // ----------------------------------------------------
      // SWITCH TO ADDITIVE (LIGHTER) BLENDING FOR ALL ENERGY EFFECTS!
      // ----------------------------------------------------
      ctx.globalCompositeOperation = 'lighter';

      // ----------------------------------------------------
      // 2. Ground Fissure Cracks
      // ----------------------------------------------------
      for (let i = fissuresRef.current.length - 1; i >= 0; i--) {
        const fis = fissuresRef.current[i];
        fis.life += dt;
        if (fis.life >= fis.maxLife) {
          fissuresRef.current.splice(i, 1);
          continue;
        }

        const alpha = 1 - fis.life / fis.maxLife;
        ctx.save();
        ctx.strokeStyle = fis.color;
        ctx.shadowColor = fis.color;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 3.5 * alpha;
        ctx.globalAlpha = alpha;

        for (const crack of fis.cracks) {
          ctx.beginPath();
          ctx.moveTo(crack[0].x, crack[0].y);
          for (let c = 1; c < crack.length; c++) {
            ctx.lineTo(crack[c].x, crack[c].y);
          }
          ctx.stroke();
        }

        // Inner white-hot lava core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2 * alpha;
        for (const crack of fis.cracks) {
          ctx.beginPath();
          ctx.moveTo(crack[0].x, crack[0].y);
          for (let c = 1; c < crack.length; c++) {
            ctx.lineTo(crack[c].x, crack[c].y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // ----------------------------------------------------
      // 3. Cinematic Awakening Special Renderers
      // ----------------------------------------------------
      if (awakeningAnimRef.current && awakeningAnimRef.current.active) {
        const awk = awakeningAnimRef.current;
        const elapsed = (time - awk.startTime) / 1000;

        if (elapsed > 0.9) {
          awakeningAnimRef.current.active = false;
        } else {
          ctx.save();
          // Warrior: Descending Greatsword & Golden Runes
          if (awk.classId === 'warrior') {
            const swordProg = Math.min(1, elapsed / 0.28);
            const swordY = -120 + (awk.targetY + 120) * Math.pow(swordProg, 3);

            // Magic summoning ground circle
            const circleAlpha = Math.max(0, 1 - Math.abs(elapsed - 0.3) * 2);
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 16;
            ctx.lineWidth = 3;
            ctx.globalAlpha = circleAlpha;
            ctx.beginPath();
            ctx.ellipse(awk.targetX, awk.groundY, 90, 36, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Inner runic star
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const th = (a / 6) * Math.PI * 2 + elapsed * 2;
              const px = awk.targetX + Math.cos(th) * 70;
              const py = awk.groundY + Math.sin(th) * 28;
              if (a === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // Holy Greatsword (Descending then Planted into Ground with Golden Aura)
            if (elapsed < 0.72) {
              const plantY = awk.groundY - 35;
              const curSwordY = elapsed < 0.28 ? (-140 + (plantY + 140) * Math.pow(swordProg, 3)) : plantY;
              const fadeAlpha = elapsed > 0.58 ? (1 - (elapsed - 0.58) / 0.14) : 1;
              ctx.save();
              ctx.globalAlpha = fadeAlpha;
              ctx.translate(awk.targetX, curSwordY);
              ctx.shadowColor = '#fbbf24';
              ctx.shadowBlur = 28;

              // Glowing golden blade body (Majestic 170px tall runic greatsword)
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.moveTo(0, 78); // sharp tip
              ctx.lineTo(-20, -96);
              ctx.lineTo(20, -96);
              ctx.closePath();
              ctx.fill();

              // Pure white cutting core
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.moveTo(0, 72);
              ctx.lineTo(-8, -90);
              ctx.lineTo(8, -90);
              ctx.closePath();
              ctx.fill();

              // Cross guard
              ctx.fillStyle = '#f59e0b';
              ctx.fillRect(-38, -102, 76, 14);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(-10, -102, 20, 14);
              ctx.restore();
            }

            // Cross flash on impact (0.26s to 0.56s)
            if (elapsed >= 0.26 && elapsed < 0.56) {
              const flashAlpha = 1 - (elapsed - 0.26) / 0.30;
              ctx.save();
              ctx.globalAlpha = flashAlpha;
              ctx.strokeStyle = '#ffffff';
              ctx.shadowColor = '#fbbf24';
              ctx.shadowBlur = 24;
              ctx.lineWidth = 10 * flashAlpha;

              // Horizontal ray
              ctx.beginPath();
              ctx.moveTo(awk.targetX - 220, awk.targetY);
              ctx.lineTo(awk.targetX + 220, awk.targetY);
              ctx.stroke();

              // Vertical ray
              ctx.lineWidth = 16 * flashAlpha;
              ctx.beginPath();
              ctx.moveTo(awk.targetX, awk.targetY - 260);
              ctx.lineTo(awk.targetX, awk.groundY + 30);
              ctx.stroke();
              ctx.restore();
            }
          }
          // Mage: Astral Magic Gate & Supernova
          else {
            const gateAlpha = Math.max(0, 1 - Math.abs(elapsed - 0.35) * 2);
            ctx.save();
            ctx.globalAlpha = gateAlpha;
            ctx.strokeStyle = '#c084fc';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 20;
            ctx.lineWidth = 3.5;

            // Cosmic Gate Ring
            ctx.beginPath();
            ctx.ellipse(awk.targetX, awk.targetY, 110, 85, elapsed * 1.5, 0, Math.PI * 2);
            ctx.stroke();

            // Inner Constellation Rays
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            for (let a = 0; a < 8; a++) {
              const th = (a / 8) * Math.PI * 2 - elapsed * 2;
              ctx.moveTo(awk.targetX, awk.targetY);
              ctx.lineTo(awk.targetX + Math.cos(th) * 90, awk.targetY + Math.sin(th) * 70);
            }
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // 4. Procedural Tapered Blade Slashes
      // ----------------------------------------------------
      for (let i = slashesRef.current.length - 1; i >= 0; i--) {
        const slash = slashesRef.current[i];
        slash.life += dt;
        if (slash.life >= slash.maxLife) {
          slashesRef.current.splice(i, 1);
          continue;
        }

        const prog = slash.life / slash.maxLife;
        const alpha = 1 - prog;

        ctx.save();
        ctx.translate(slash.x, slash.y);
        ctx.rotate(slash.rotation);

        // Outer Neon Glow Pass
        ctx.globalAlpha = alpha;
        ctx.fillStyle = slash.color;
        ctx.shadowColor = slash.glowColor;
        ctx.shadowBlur = 18;
        drawTaperedCrescentPath(
          ctx,
          0,
          0,
          slash.radius,
          slash.startAngle,
          slash.endAngle,
          slash.maxThickness,
          prog
        );
        ctx.fill();

        // Inner Pure White Laser Core Pass
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        drawTaperedCrescentPath(
          ctx,
          0,
          0,
          slash.radius,
          slash.startAngle,
          slash.endAngle,
          slash.maxThickness * 0.42,
          prog
        );
        ctx.fill();

        ctx.restore();
      }

      // ----------------------------------------------------
      // 5. Supersonic Shockwave Rings
      // ----------------------------------------------------
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.life += dt;
        sw.currentRadius += sw.speed * dt;

        if (sw.currentRadius >= sw.maxRadius || sw.life >= sw.maxLife) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        const prog = sw.currentRadius / sw.maxRadius;
        const alpha = Math.max(0, 1 - prog);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = sw.color;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 14;
        ctx.lineWidth = sw.thickness * (1 - prog * 0.7);

        ctx.beginPath();
        ctx.ellipse(sw.x, sw.y, sw.currentRadius, sw.currentRadius * sw.aspectY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner white ring for high energy
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, sw.thickness * 0.3 * (1 - prog));
        ctx.stroke();
        ctx.restore();
      }

      // ----------------------------------------------------
      // 6. Branching Midpoint Lightning Bolts
      // ----------------------------------------------------
      for (let i = lightningRef.current.length - 1; i >= 0; i--) {
        const lb = lightningRef.current[i];
        lb.life += dt;
        if (lb.life >= lb.maxLife) {
          lightningRef.current.splice(i, 1);
          continue;
        }

        const alpha = (1 - lb.life / lb.maxLife) * (Math.random() > 0.15 ? 1 : 0.3); // High-frequency flicker
        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer Aura Pass
        ctx.strokeStyle = lb.color;
        ctx.shadowColor = lb.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = lb.width;

        ctx.beginPath();
        for (const seg of lb.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        for (const branch of lb.branches) {
          for (const seg of branch) {
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
        }
        ctx.stroke();

        // Inner Pure White Core
        ctx.strokeStyle = lb.coreColor;
        ctx.lineWidth = Math.max(1, lb.width * 0.35);
        ctx.stroke();
        ctx.restore();
      }

      // ----------------------------------------------------
      // 7. Projectile Flight Physics & Impact Splices
      // ----------------------------------------------------
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];
        proj.progress += proj.speed;

        let curX = proj.startX + (proj.targetX - proj.startX) * proj.progress;
        let curY = proj.startY + (proj.targetY - proj.startY) * proj.progress;

        // Helix Sine Wave for Magic Missiles
        if (proj.type === 'magic_missile' && proj.waveOffset !== undefined) {
          const wave = Math.sin(proj.progress * Math.PI * 3 + (proj.wavePhase || 0));
          curY += wave * proj.waveOffset * (1 - proj.progress);
        }

        proj.currentX = curX;
        proj.currentY = curY;

        // Add trail point
        proj.trail.push({ x: curX, y: curY, alpha: 1, size: proj.size });
        if (proj.trail.length > 10) proj.trail.shift();

        // Draw Motion Trail
        ctx.save();
        for (let t = 0; t < proj.trail.length; t++) {
          const pt = proj.trail[t];
          pt.alpha *= 0.88;
          ctx.globalAlpha = pt.alpha * 0.6;
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * (0.35 + (t / proj.trail.length) * 0.65), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Draw Projectile Head
        ctx.save();
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 16;
        ctx.fillStyle = proj.color;

        if (proj.type === 'sword_wave') {
          // Sharp sonic crescent blade flying forward
          ctx.translate(curX, curY);
          ctx.beginPath();
          ctx.ellipse(0, 0, proj.size * 1.4, proj.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, proj.size * 0.9, proj.size * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (proj.type === 'ice_spear') {
          // Faceted diamond lance
          ctx.translate(curX, curY);
          const angle = Math.atan2(proj.targetY - proj.startY, proj.targetX - proj.startX);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(proj.size * 1.5, 0);
          ctx.lineTo(-proj.size, -proj.size * 0.5);
          ctx.lineTo(-proj.size * 0.5, 0);
          ctx.lineTo(-proj.size, proj.size * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(proj.size * 1.2, 0);
          ctx.lineTo(-proj.size * 0.4, -proj.size * 0.2);
          ctx.lineTo(-proj.size * 0.4, proj.size * 0.2);
          ctx.closePath();
          ctx.fill();
        } else if (proj.type === 'meteor') {
          // Fiery meteor rock with blazing head
          ctx.beginPath();
          ctx.arc(curX, curY, proj.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(curX, curY, proj.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(curX, curY, proj.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (proj.type === 'fireball') {
          // Swirling Magma Core Fireball
          ctx.translate(curX, curY);
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 24;

          // Outer swirling flame petals
          ctx.fillStyle = '#f97316';
          for (let f = 0; f < 6; f++) {
            const rot = f * (Math.PI / 3) + proj.progress * 14;
            ctx.save();
            ctx.rotate(rot);
            ctx.beginPath();
            ctx.ellipse(proj.size * 0.7, 0, proj.size * 0.55, proj.size * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Molten gold sphere
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, proj.size * 0.85, 0, Math.PI * 2);
          ctx.fill();

          // White-hot plasma core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, proj.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sphere Comet Head (Magic Missile / Mage Bolt)
          ctx.beginPath();
          ctx.arc(curX, curY, proj.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(curX, curY, proj.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Check Impact Arrival
        if (proj.progress >= 1.0) {
          const { groundY } = getAnchors();

          if (proj.type === 'fireball') {
            // Giant dome explosion
            spawnShockwave(proj.targetX, proj.targetY, 95, 450, '#f97316', 0.85, 8);
            spawnDirectionalSparks(proj.targetX, proj.targetY, 28, '#f97316', -Math.PI * 0.5, 2.2, 9.5, groundY);
          } else if (proj.type === 'ice_spear') {
            // Frost nova ring & ice shards
            spawnShockwave(proj.targetX, proj.targetY, 80, 420, '#67e8f9', 0.8, 6);
            spawnDirectionalSparks(proj.targetX, proj.targetY, 20, '#a5f3fc', 0, 3.14, 8, groundY);
          } else if (proj.type === 'sword_wave') {
            // Sonic wave impact
            spawnShockwave(proj.targetX, proj.targetY, 70, 480, '#10b981', 0.5, 6);
            spawnDirectionalSparks(proj.targetX, proj.targetY, 18, '#10b981', 0, 1.6, 8.5, groundY);
          } else if (proj.type === 'meteor') {
            // Deep crater explosion
            spawnShockwave(proj.targetX, groundY, 130, 450, '#ef4444', 0.45, 10);
            spawnDirectionalSparks(proj.targetX, groundY - 10, 36, '#fbbf24', -Math.PI * 0.5, 2.0, 11, groundY);
          } else {
            // Magic Missile / Bolt Starburst
            spawnShockwave(proj.targetX, proj.targetY, 45, 360, proj.color, 0.9, 4);
            spawnDirectionalSparks(proj.targetX, proj.targetY, 12, proj.color, 0, 3.14, 6.5, groundY);
          }

          projectilesRef.current.splice(i, 1);
        }
      }

      // ----------------------------------------------------
      // 8. Velocity-Stretched Physics Sparks with Ground Bounce
      // ----------------------------------------------------
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const spk = sparksRef.current[i];
        spk.life += dt;
        if (spk.life >= spk.maxLife) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        // Apply Physics
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vy += spk.gravity;
        spk.vx *= spk.drag;
        spk.vy *= spk.drag;

        // Ground Bounce
        if (spk.y >= spk.bounceGroundY && spk.bouncesLeft > 0) {
          spk.y = spk.bounceGroundY;
          spk.vy = -Math.abs(spk.vy) * 0.52;
          spk.vx *= 0.75;
          spk.bouncesLeft--;
        }

        const alpha = Math.max(0, 1 - spk.life / spk.maxLife);
        const speed = Math.sqrt(spk.vx * spk.vx + spk.vy * spk.vy);
        const stretchLen = Math.min(28, speed * 2.6);

        // Calculate tail point along velocity vector
        const tailX = spk.x - (spk.vx / (speed || 1)) * stretchLen;
        const tailY = spk.y - (spk.vy / (speed || 1)) * stretchLen;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = spk.color;
        ctx.shadowColor = spk.color;
        ctx.shadowBlur = 6;
        ctx.lineWidth = spk.width * alpha;
        ctx.lineCap = 'round';

        // Stretched Line
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(spk.x, spk.y);
        ctx.stroke();

        // White-hot head spark
        ctx.fillStyle = spk.coreColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(spk.x, spk.y, Math.max(0.8, spk.width * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [ambientType]);

  return (
    <canvas
      ref={canvasRef}
      className="battle-fx-canvas-layer"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 25,
      }}
    />
  );
};
