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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  rotation?: number;
  vRot?: number;
}

interface Projectile {
  id: string;
  type: string;
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
  trail: { x: number; y: number; alpha: number }[];
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

  const particlesRef = useRef<Particle[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const ambientParticlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const activeVfxIdRef = useRef<string | null>(null);

  // Trigger skill VFX when activeSkillVfx changes
  useEffect(() => {
    if (!activeSkillVfx) return;
    if (activeVfxIdRef.current === activeSkillVfx.id) return;
    activeVfxIdRef.current = activeSkillVfx.id;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Relative Anchors based on canvas size
    const heroStaffCoreX = w * 0.32;
    const heroStaffCoreY = h * 0.58;
    const heroWeaponTipX = w * 0.36;
    const heroWeaponTipY = h * 0.62;
    const monsterCenterX = w * 0.68;
    const monsterCenterY = h * 0.62;
    const monsterGroundY = h * 0.78;

    const skillType = activeSkillVfx.type;

    // 1. Mage Projectile Skills
    if (skillType === 'magic_missile') {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          projectilesRef.current.push({
            id: `mm_${Date.now()}_${i}`,
            type: 'magic_missile',
            startX: heroStaffCoreX,
            startY: heroStaffCoreY + (i - 1) * 14,
            targetX: monsterCenterX,
            targetY: monsterCenterY + (i - 1) * 18,
            currentX: heroStaffCoreX,
            currentY: heroStaffCoreY,
            progress: 0,
            speed: 0.05,
            color: '#38bdf8',
            size: 9,
            trail: [],
          });
        }, i * 70);
      }
    } else if (skillType === 'fireball') {
      projectilesRef.current.push({
        id: `fb_${Date.now()}`,
        type: 'fireball',
        startX: heroStaffCoreX,
        startY: heroStaffCoreY,
        targetX: monsterCenterX,
        targetY: monsterCenterY,
        currentX: heroStaffCoreX,
        currentY: heroStaffCoreY,
        progress: 0,
        speed: 0.042,
        color: '#f97316',
        size: 18,
        trail: [],
      });
    } else if (skillType === 'ice_spear') {
      projectilesRef.current.push({
        id: `is_${Date.now()}`,
        type: 'ice_spear',
        startX: heroStaffCoreX,
        startY: heroStaffCoreY,
        targetX: monsterCenterX,
        targetY: monsterCenterY,
        currentX: heroStaffCoreX,
        currentY: heroStaffCoreY,
        progress: 0,
        speed: 0.055,
        color: '#67e8f9',
        size: 14,
        trail: [],
      });
    } else if (skillType === 'sword_wave' || skillType === 'wind_blade') {
      projectilesRef.current.push({
        id: `sw_${Date.now()}`,
        type: 'sword_wave',
        startX: heroWeaponTipX,
        startY: heroWeaponTipY,
        targetX: monsterCenterX,
        targetY: monsterCenterY,
        currentX: heroWeaponTipX,
        currentY: heroWeaponTipY,
        progress: 0,
        speed: 0.05,
        color: '#10b981',
        size: 22,
        trail: [],
      });
    } else if (skillType === 'meteor') {
      // Meteor falls diagonally from top sky to monster
      projectilesRef.current.push({
        id: `met_${Date.now()}`,
        type: 'meteor',
        startX: monsterCenterX - 180,
        startY: -40,
        targetX: monsterCenterX,
        targetY: monsterGroundY - 20,
        currentX: monsterCenterX - 180,
        currentY: -40,
        progress: 0,
        speed: 0.038,
        color: '#ef4444',
        size: 32,
        trail: [],
      });
    } else if (skillType === 'chain_lightning') {
      // Instant lightning sparks & arcs
      for (let i = 0; i < 24; i++) {
        const t = i / 24;
        const px = heroStaffCoreX + (monsterCenterX - heroStaffCoreX) * t + (Math.random() - 0.5) * 36;
        const py = heroStaffCoreY + (monsterCenterY - heroStaffCoreY) * t + (Math.random() - 0.5) * 36;
        particlesRef.current.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: 0.28,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff',
          alpha: 1,
        });
      }
    } else if (skillType === 'power_slash' || skillType === 'double_slash') {
      // Crescent sword sparks
      for (let i = 0; i < 18; i++) {
        particlesRef.current.push({
          x: monsterCenterX + (Math.random() - 0.5) * 50,
          y: monsterCenterY + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 0,
          maxLife: 0.35,
          size: Math.random() * 5 + 3,
          color: '#fbbf24',
          alpha: 1,
        });
      }
    } else if (skillType === 'heavenly_blade' || isAwakeningCasting) {
      // Massive golden holy burst
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: monsterCenterX + (Math.random() - 0.5) * 120,
          y: monsterCenterY + (Math.random() - 0.5) * 120,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 2,
          life: 0,
          maxLife: 0.65,
          size: Math.random() * 7 + 3,
          color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
          alpha: 1,
        });
      }
    }
  }, [activeSkillVfx, isAwakeningCasting]);

  // Trigger Mage basic attack projectile if Mage basic attacks
  useEffect(() => {
    if (!isPlayerAttacking || classId !== 'mage') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const heroStaffCoreX = w * 0.32;
    const heroStaffCoreY = h * 0.58;
    const monsterCenterX = w * 0.68;
    const monsterCenterY = h * 0.62;

    projectilesRef.current.push({
      id: `mage_basic_${Date.now()}`,
      type: 'mage_bolt',
      startX: heroStaffCoreX,
      startY: heroStaffCoreY,
      targetX: monsterCenterX,
      targetY: monsterCenterY,
      currentX: heroStaffCoreX,
      currentY: heroStaffCoreY,
      progress: 0,
      speed: 0.065,
      color: '#38bdf8',
      size: 11,
      trail: [],
    });
  }, [isPlayerAttacking, classId]);

  // Trigger Impact Sparks on Monster Hit
  useEffect(() => {
    if (!isMonsterHit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const monsterCenterX = w * 0.68;
    const monsterCenterY = h * 0.62;

    const count = classId === 'warrior' ? 14 : 10;
    const color = classId === 'warrior' ? '#fbbf24' : '#38bdf8';

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: monsterCenterX,
        y: monsterCenterY,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 1,
        life: 0,
        maxLife: 0.28,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? color : '#ffffff',
        alpha: 1,
      });
    }
  }, [isMonsterHit, classId]);

  // Main Canvas Render Loop
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
    const ambientCount = 18;
    for (let i = 0; i < ambientCount; i++) {
      ambientParticlesRef.current.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        vx: (Math.random() - 0.5) * 0.6 + 0.3,
        vy: Math.random() * 0.4 + 0.2,
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
        alpha: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
      });
    }

    const render = (time: number) => {
      const dt = Math.min(0.05, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Ambient Particles
      for (let i = 0; i < ambientParticlesRef.current.length; i++) {
        const p = ambientParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.rotation !== undefined && p.vRot !== undefined) {
          p.rotation += p.vRot;
        }

        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        if (p.rotation !== undefined) ctx.rotate(p.rotation);

        if (ambientType === 'maple_leaves') {
          // Leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (ambientType === 'water_orbs') {
          // Glowing soft circle
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Forest leaf / pollen
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Update & Draw Projectiles
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];
        proj.progress += proj.speed;

        proj.currentX = proj.startX + (proj.targetX - proj.startX) * proj.progress;
        proj.currentY = proj.startY + (proj.targetY - proj.startY) * proj.progress;

        // Add trail point
        proj.trail.push({ x: proj.currentX, y: proj.currentY, alpha: 1 });
        if (proj.trail.length > 8) proj.trail.shift();

        // Draw Trail
        ctx.save();
        for (let t = 0; t < proj.trail.length; t++) {
          const pt = proj.trail[t];
          pt.alpha *= 0.85;
          ctx.globalAlpha = pt.alpha * 0.5;
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, proj.size * (0.3 + (t / proj.trail.length) * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Draw Projectile Head
        ctx.save();
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.currentX, proj.currentY, proj.size, 0, Math.PI * 2);
        ctx.fill();

        // Hot center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(proj.currentX, proj.currentY, proj.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check Impact
        if (proj.progress >= 1.0) {
          // Spawn impact particles
          for (let k = 0; k < 18; k++) {
            particlesRef.current.push({
              x: proj.targetX,
              y: proj.targetY,
              vx: (Math.random() - 0.5) * 7,
              vy: (Math.random() - 0.5) * 7 - 1,
              life: 0,
              maxLife: 0.32,
              size: Math.random() * 5 + 2,
              color: Math.random() > 0.4 ? proj.color : '#ffffff',
              alpha: 1,
            });
          }
          projectilesRef.current.splice(i, 1);
        }
      }

      // 3. Update & Draw Burst Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
