import React, { useEffect, useRef } from 'react';
import { SkillEffectType, CharacterClassId, EquipmentRarity } from '../types/game';
import { AmbientParticleType } from '../data/stages';

interface BattleFxCanvasProps {
  activeSkillVfx: { id: string; type: SkillEffectType } | null;
  isAwakeningCasting?: boolean;
  classId?: CharacterClassId;
  isPlayerAttacking?: boolean;
  isMonsterHit?: boolean;
  ambientType?: AmbientParticleType;
  basicAttackEvent?: { id: string; comboStep: 1 | 2 | 3; classId: CharacterClassId } | null;
  petAttackEvent?: { id: string; petId: string } | null;
  prestigeVfxEvent?: { id: string } | null;
  dungeonVfxEvent?: { id: string; type: 'gold_burst' | 'wave_clear' | 'ruins_clear' } | null;
  summonVfxEvent?: { id: string; rarity: EquipmentRarity; count: number } | null;
}

/**
 * Pure Canvas 2D procedural renderer for Equipment Summon VFX (Zero Text Emojis).
 * Differentiates Common, Rare, Epic, Legendary, and Mythic summon presentations
 * while capping particle counts to keep mobile GPU load minimal.
 */
export function drawEquipmentSummonRitual(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rarity: EquipmentRarity,
  progress: number, // 0 ~ 1
  elapsedSec: number,
  scale: number = 1.0
) {
  const clampedProg = Math.max(0, Math.min(1, progress));
  const fadeAlpha = clampedProg < 0.12 ? clampedProg / 0.12 : clampedProg > 0.82 ? (1 - clampedProg) / 0.18 : 1;
  const baseRadius = 56 * scale;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // 1. Common: Soft silver-white glow & gentle small particles
  if (rarity === 'common') {
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, baseRadius * 1.15);
    grad.addColorStop(0, `rgba(248, 250, 252, ${0.55 * fadeAlpha})`);
    grad.addColorStop(0.5, `rgba(148, 163, 184, ${0.28 * fadeAlpha})`);
    grad.addColorStop(1, 'rgba(100, 116, 139, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // Soft ring
    ctx.strokeStyle = `rgba(203, 213, 225, ${0.5 * fadeAlpha})`;
    ctx.lineWidth = 1.8 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * (0.45 + clampedProg * 0.45), 0, Math.PI * 2);
    ctx.stroke();

    // 14 small drifting motes
    const particleCount = 14;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + elapsedSec * 0.8;
      const dist = baseRadius * (0.2 + ((clampedProg * 0.7 + (i % 3) * 0.18) % 0.85));
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist - clampedProg * 14 * scale;
      const pSize = (2.0 + (i % 2) * 1.2) * scale;

      ctx.fillStyle = `rgba(241, 245, 249, ${0.75 * fadeAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // 2. Rare: Azure magic circle & cyan luminescence
  if (rarity === 'rare') {
    const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, baseRadius * 1.35);
    grad.addColorStop(0, `rgba(224, 242, 254, ${0.75 * fadeAlpha})`);
    grad.addColorStop(0.45, `rgba(56, 189, 248, ${0.42 * fadeAlpha})`);
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Rotating Blue Magic Circle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsedSec * 1.6);
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.85 * fadeAlpha})`;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.2 * scale;

    const rRing = baseRadius * (0.75 + Math.sin(clampedProg * Math.PI) * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, rRing, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, rRing * 0.72, 0, Math.PI * 2);
    ctx.stroke();

    // Inscribed rotated squares (Octagram)
    for (let s = 0; s < 2; s++) {
      ctx.beginPath();
      for (let k = 0; k < 4; k++) {
        const th = (s * Math.PI) / 4 + (k * Math.PI) / 2;
        const rx = Math.cos(th) * rRing * 0.72;
        const ry = Math.sin(th) * rRing * 0.72;
        if (k === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // 22 glowing azure particles
    const particleCount = 22;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 - elapsedSec * 1.2;
      const dist = baseRadius * (0.18 + ((clampedProg * 0.95 + (i % 4) * 0.2) % 1.05));
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const pSize = (2.4 + (i % 3) * 1.1) * scale;

      ctx.fillStyle = i % 2 === 0 ? `rgba(125, 211, 252, ${0.85 * fadeAlpha})` : `rgba(255, 255, 255, ${0.85 * fadeAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // 3. Epic: Violet magic circle & radial purple particle burst
  if (rarity === 'epic') {
    const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, baseRadius * 1.55);
    grad.addColorStop(0, `rgba(243, 232, 255, ${0.85 * fadeAlpha})`);
    grad.addColorStop(0.4, `rgba(192, 132, 252, ${0.52 * fadeAlpha})`);
    grad.addColorStop(0.75, `rgba(147, 51, 234, ${0.25 * fadeAlpha})`);
    grad.addColorStop(1, 'rgba(88, 28, 135, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 1.55, 0, Math.PI * 2);
    ctx.fill();

    // Expanding Violet Pulse Wave
    const waveR = baseRadius * (0.3 + clampedProg * 1.25);
    ctx.strokeStyle = `rgba(192, 132, 252, ${(1 - clampedProg * 0.7) * fadeAlpha})`;
    ctx.lineWidth = 3.0 * (1 - clampedProg * 0.5) * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Hexagram Circle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-elapsedSec * 2.0);
    ctx.strokeStyle = `rgba(216, 180, 254, ${0.9 * fadeAlpha})`;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.4 * scale;

    const rRing = baseRadius * 0.86;
    ctx.beginPath();
    ctx.arc(0, 0, rRing, 0, Math.PI * 2);
    ctx.stroke();

    for (let t = 0; t < 2; t++) {
      ctx.beginPath();
      for (let k = 0; k < 3; k++) {
        const th = (t * Math.PI) / 3 + (k * 2 * Math.PI) / 3;
        const rx = Math.cos(th) * rRing * 0.92;
        const ry = Math.sin(th) * rRing * 0.92;
        if (k === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // 32 radial violet-magenta particles spreading outward
    const particleCount = 32;
    for (let i = 0; i < particleCount; i++) {
      const seed = (i * 137.5) % 360;
      const angle = (seed * Math.PI) / 180 + elapsedSec * (i % 2 === 0 ? 0.9 : -0.9);
      const speedFactor = 0.35 + ((i * 29) % 100) / 100;
      const dist = baseRadius * (0.15 + clampedProg * 1.35 * speedFactor);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const pSize = (2.2 + (i % 3) * 1.3) * scale;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 2 === 0 ? '#e879f9' : '#c084fc';
      ctx.globalAlpha = fadeAlpha * (1 - clampedProg * 0.35);
      // Diamond crystal particle
      ctx.beginPath();
      ctx.moveTo(pSize * 1.5, 0);
      ctx.lineTo(0, -pSize * 0.8);
      ctx.lineTo(-pSize * 1.5, 0);
      ctx.lineTo(0, pSize * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // 4. Legendary: Golden light pillar & shockwave rings
  if (rarity === 'legendary') {
    // Vertical Golden Light Pillar
    const pillarW = (46 + Math.sin(clampedProg * Math.PI) * 26) * scale;
    const pillarH = 260 * scale;
    const pillarGrad = ctx.createLinearGradient(cx - pillarW / 2, cy, cx + pillarW / 2, cy);
    pillarGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    pillarGrad.addColorStop(0.25, `rgba(251, 191, 36, ${0.45 * fadeAlpha})`);
    pillarGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.88 * fadeAlpha})`);
    pillarGrad.addColorStop(0.75, `rgba(251, 191, 36, ${0.45 * fadeAlpha})`);
    pillarGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.fillStyle = pillarGrad;
    ctx.fillRect(cx - pillarW / 2, cy - pillarH * 0.65, pillarW, pillarH);

    // Radial Golden Sunburst
    const sunGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, baseRadius * 1.75);
    sunGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fadeAlpha})`);
    sunGrad.addColorStop(0.35, `rgba(253, 224, 71, ${0.65 * fadeAlpha})`);
    sunGrad.addColorStop(0.7, `rgba(217, 119, 6, ${0.3 * fadeAlpha})`);
    sunGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 1.75, 0, Math.PI * 2);
    ctx.fill();

    // Twin Expanding Shockwaves
    for (let w = 0; w < 2; w++) {
      const wProg = Math.max(0, Math.min(1, (clampedProg - w * 0.18) * 1.25));
      if (wProg <= 0) continue;
      const swR = baseRadius * (0.25 + wProg * 1.55);
      ctx.save();
      ctx.strokeStyle = w === 0 ? '#fde047' : '#f59e0b';
      ctx.globalAlpha = (1 - wProg) * fadeAlpha;
      ctx.lineWidth = (4.2 - wProg * 2.5) * scale;
      ctx.beginPath();
      ctx.ellipse(cx, cy, swR, swR * (w === 0 ? 0.55 : 1), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Rotating Golden Sun Crest Circle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsedSec * 2.4);
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.92 * fadeAlpha})`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.5 * scale;

    const rRing = baseRadius * 0.95;
    ctx.beginPath();
    ctx.arc(0, 0, rRing, 0, Math.PI * 2);
    ctx.stroke();

    // 8-Pointed Starburst Rays
    ctx.beginPath();
    for (let k = 0; k < 16; k++) {
      const th = (k * Math.PI) / 8;
      const r = k % 2 === 0 ? rRing * 1.12 : rRing * 0.52;
      const rx = Math.cos(th) * r;
      const ry = Math.sin(th) * r;
      if (k === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 42 Golden Sparks
    const particleCount = 42;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + elapsedSec * 1.5;
      const speed = 0.3 + ((i * 37) % 100) / 90;
      const dist = baseRadius * (0.12 + clampedProg * 1.5 * speed);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist - (i % 3 === 0 ? clampedProg * 28 * scale : 0);
      const len = (6 + (i % 3) * 4) * scale;

      ctx.save();
      ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : '#fde047';
      ctx.globalAlpha = fadeAlpha * (1 - clampedProg * 0.3);
      ctx.lineWidth = 2.2 * scale;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - Math.cos(angle) * len, py - Math.sin(angle) * len);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  // 5. Mythic: Multi-layered magic circles, intense crimson-gold light pillar, central brilliance & particle burst
  const pillarW = (68 + Math.sin(clampedProg * Math.PI * 2) * 24) * scale;
  const pillarH = 300 * scale;

  // A. Outer Crimson-Gold Light Pillar
  const outerBeam = ctx.createLinearGradient(cx - pillarW / 2, cy, cx + pillarW / 2, cy);
  outerBeam.addColorStop(0, 'rgba(225, 29, 72, 0)');
  outerBeam.addColorStop(0.2, `rgba(244, 63, 94, ${0.55 * fadeAlpha})`);
  outerBeam.addColorStop(0.4, `rgba(251, 191, 36, ${0.75 * fadeAlpha})`);
  outerBeam.addColorStop(0.5, `rgba(255, 255, 255, ${0.98 * fadeAlpha})`);
  outerBeam.addColorStop(0.6, `rgba(251, 191, 36, ${0.75 * fadeAlpha})`);
  outerBeam.addColorStop(0.8, `rgba(244, 63, 94, ${0.55 * fadeAlpha})`);
  outerBeam.addColorStop(1, 'rgba(225, 29, 72, 0)');
  ctx.fillStyle = outerBeam;
  ctx.fillRect(cx - pillarW / 2, cy - pillarH * 0.68, pillarW, pillarH);

  // B. Central Supernova Core Brilliance
  const coreGlow = ctx.createRadialGradient(cx, cy, 6, cx, cy, baseRadius * 2.05);
  coreGlow.addColorStop(0, `rgba(255, 255, 255, ${1.0 * fadeAlpha})`);
  coreGlow.addColorStop(0.25, `rgba(254, 240, 138, ${0.85 * fadeAlpha})`);
  coreGlow.addColorStop(0.55, `rgba(244, 63, 94, ${0.55 * fadeAlpha})`);
  coreGlow.addColorStop(0.82, `rgba(168, 85, 247, ${0.28 * fadeAlpha})`);
  coreGlow.addColorStop(1, 'rgba(136, 19, 55, 0)');
  ctx.fillStyle = coreGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius * 2.05, 0, Math.PI * 2);
  ctx.fill();

  // C. Multi-Layered Counter-Rotating Runic Magic Circles (3 concentric layers)
  const layerConfigs = [
    { radius: baseRadius * 1.25, speed: 1.8, color: '#f43f5e', points: 12, lineWidth: 2.6 },
    { radius: baseRadius * 0.92, speed: -2.6, color: '#fbbf24', points: 6, lineWidth: 2.4 },
    { radius: baseRadius * 0.58, speed: 3.4, color: '#ffffff', points: 8, lineWidth: 2.0 },
  ];

  for (const layer of layerConfigs) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(elapsedSec * layer.speed);
    ctx.strokeStyle = layer.color;
    ctx.shadowColor = layer.color;
    ctx.shadowBlur = 14;
    ctx.globalAlpha = 0.9 * fadeAlpha;
    ctx.lineWidth = layer.lineWidth * scale;

    ctx.beginPath();
    ctx.arc(0, 0, layer.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inscribed Star Polygon
    ctx.beginPath();
    for (let k = 0; k < layer.points; k++) {
      const th = (k * 2 * Math.PI) / layer.points;
      const nextTh = (((k + 2) % layer.points) * 2 * Math.PI) / layer.points;
      ctx.moveTo(Math.cos(th) * layer.radius, Math.sin(th) * layer.radius);
      ctx.lineTo(Math.cos(nextTh) * layer.radius, Math.sin(nextTh) * layer.radius);
    }
    ctx.stroke();
    ctx.restore();
  }

  // D. Triple Expanding Mythic Shockwaves
  const waveColors = ['#f43f5e', '#fbbf24', '#c084fc'];
  for (let w = 0; w < 3; w++) {
    const wProg = Math.max(0, Math.min(1, (clampedProg - w * 0.14) * 1.35));
    if (wProg <= 0) continue;
    const swR = baseRadius * (0.2 + wProg * 1.8);
    ctx.save();
    ctx.strokeStyle = waveColors[w];
    ctx.globalAlpha = (1 - wProg) * fadeAlpha;
    ctx.lineWidth = (4.8 - wProg * 3.0) * scale;
    ctx.beginPath();
    ctx.ellipse(cx, cy, swR, swR * (w === 1 ? 0.5 : 1), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // E. Central Cross Starlight Flare
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(elapsedSec * 0.6);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * fadeAlpha})`;
  for (let ray = 0; ray < 4; ray++) {
    ctx.save();
    ctx.rotate((ray * Math.PI) / 4);
    const rayLen = (ray % 2 === 0 ? 1.55 : 1.05) * baseRadius;
    const rayThick = (ray % 2 === 0 ? 5.5 : 3.2) * scale;
    ctx.beginPath();
    ctx.moveTo(0, -rayLen);
    ctx.quadraticCurveTo(rayThick, 0, 0, rayLen);
    ctx.quadraticCurveTo(-rayThick, 0, 0, -rayLen);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // F. 56 High-Energy Mythic Particles (Capped for Mobile GPU safety)
  const particleCount = 56;
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + elapsedSec * (i % 2 === 0 ? 1.8 : -1.4);
    const speed = 0.25 + ((i * 43) % 100) / 80;
    const dist = baseRadius * (0.1 + clampedProg * 1.85 * speed);
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist - (i % 4 === 0 ? clampedProg * 36 * scale : 0);
    const pSize = (2.6 + (i % 3) * 1.4) * scale;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 2 === 0 ? '#fda4af' : '#fde047';
    ctx.globalAlpha = fadeAlpha * (1 - clampedProg * 0.25);
    ctx.beginPath();
    ctx.moveTo(pSize * 1.8, 0);
    ctx.lineTo(0, -pSize * 0.85);
    ctx.lineTo(-pSize * 1.8, 0);
    ctx.lineTo(0, pSize * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}


interface GoldCoinParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  spin: number;
  spinSpeed: number;
  life: number;
  maxLife: number;
  groundY: number;
  bouncesLeft: number;
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
  basicAttackEvent = null,
  petAttackEvent = null,
  prestigeVfxEvent = null,
  dungeonVfxEvent = null,
  summonVfxEvent = null,
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
  const coinsRef = useRef<GoldCoinParticle[]>([]);

  // Prestige, Dungeon & Summon Sequence Refs
  const lastPrestigeEventIdRef = useRef<string | null>(null);
  const lastDungeonEventIdRef = useRef<string | null>(null);
  const lastSummonEventIdRef = useRef<string | null>(null);
  const summonVfxRef = useRef<{
    id: string;
    rarity: EquipmentRarity;
    startTime: number;
    duration: number;
    heroX: number;
    heroY: number;
  } | null>(null);

  const prestigeVfxRef = useRef<{
    id: string;
    startTime: number;
    duration: number;
    heroX: number;
    heroY: number;
    groundY: number;
  } | null>(null);

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
  const lastBasicEventIdRef = useRef<string | null>(null);
  const lastPetEventIdRef = useRef<string | null>(null);

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
    } else if (type === 'ground_breaker') {
      // 7. Ground Breaker: Heavy slam, downward crater shockwave + fissures + upward debris
      spawnShockwave(monsterX, groundY, 110, 480, '#f59e0b', 0.42, 8);
      const fissureCracks: { x: number; y: number }[][] = [];
      for (let c = 0; c < 4; c++) {
        const crackPath: { x: number; y: number }[] = [{ x: monsterX, y: groundY }];
        let curX = monsterX;
        let curY = groundY;
        const cAngle = (c / 4) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        for (let s = 0; s < 3; s++) {
          curX += Math.cos(cAngle) * (25 + Math.random() * 15);
          curY += Math.sin(cAngle) * (12 + Math.random() * 8);
          crackPath.push({ x: curX, y: curY });
        }
        fissureCracks.push(crackPath);
      }
      fissuresRef.current.push({
        id: `fis_gb_${Date.now()}`,
        originX: monsterX,
        originY: groundY,
        cracks: fissureCracks,
        color: '#f59e0b',
        life: 0,
        maxLife: 0.65,
      });
      spawnDirectionalSparks(monsterX, groundY - 15, 28, '#d97706', -Math.PI * 0.5, 1.8, 10, groundY);
    } else if (type === 'blood_thirst') {
      // 8. Blood Thirst: Crimson blood aura tendrils + inward red spark ribbons
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          slashesRef.current.push({
            id: `bt_${Date.now()}_${i}`,
            x: monsterX,
            y: monsterY,
            radius: 80 + i * 15,
            startAngle: -Math.PI * 0.8,
            endAngle: Math.PI * 0.4,
            maxThickness: 22,
            color: '#ef4444',
            glowColor: '#7f1d1d',
            life: 0,
            maxLife: 0.22,
            rotation: i * 0.5,
          });
          spawnDirectionalSparks(monsterX, monsterY, 16, '#dc2626', -Math.PI * 0.2, 1.4, 8, groundY);
        }, i * 70);
      }
      spawnShockwave(heroX, heroY, 65, 320, '#ef4444', 0.8, 5);
    } else if (type === 'execution') {
      // 9. Execution: Massive guillotine vertical cleave with dark crimson-ruby glow + heavy ground shockwave
      slashesRef.current.push({
        id: `exec_${Date.now()}`,
        x: monsterX,
        y: monsterY - 10,
        radius: 120,
        startAngle: -Math.PI * 0.95,
        endAngle: Math.PI * 0.45,
        maxThickness: 38,
        color: '#ffffff',
        glowColor: '#ef4444',
        life: 0,
        maxLife: 0.30,
        rotation: 0.05,
      });
      spawnShockwave(monsterX, groundY, 130, 520, '#ef4444', 0.45, 10);
      spawnDirectionalSparks(monsterX, monsterY, 36, '#dc2626', Math.PI * 0.5, 2.4, 12, groundY);
    } else if (type === 'flame_sword') {
      // 10. Flame Sword: Flaming ribbon slash arc + lingering ground fire sparks
      slashesRef.current.push({
        id: `fs_${Date.now()}`,
        x: monsterX,
        y: monsterY,
        radius: 90,
        startAngle: -Math.PI * 0.8,
        endAngle: Math.PI * 0.35,
        maxThickness: 26,
        color: '#f97316',
        glowColor: '#ea580c',
        life: 0,
        maxLife: 0.24,
        rotation: -0.3,
      });
      spawnShockwave(monsterX, monsterY, 70, 390, '#fbbf24', 0.75, 6);
      spawnDirectionalSparks(monsterX, groundY - 10, 22, '#f97316', -Math.PI * 0.4, 1.6, 9, groundY);
    } else if (type === 'iron_fortress') {
      // 11. Iron Fortress: Giant golden forcefield around hero
      spawnShockwave(heroX, heroY, 75, 240, '#fbbf24', 0.85, 10);
      spawnDirectionalSparks(heroX, heroY, 16, '#fef08a', 0, 3.14, 6, groundY);
    } else if (type === 'phantom_blade') {
      // 12. Phantom Blade: 5 rapid spatial shadow slashes with violet echoes
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          slashesRef.current.push({
            id: `pb_${Date.now()}_${i}`,
            x: monsterX + (Math.random() - 0.5) * 40,
            y: monsterY + (Math.random() - 0.5) * 40,
            radius: 80,
            startAngle: -Math.PI * 0.75,
            endAngle: Math.PI * 0.35,
            maxThickness: 18,
            color: '#a855f7',
            glowColor: '#581c87',
            life: 0,
            maxLife: 0.16,
            rotation: (i - 2) * 0.4,
          });
          spawnDirectionalSparks(monsterX, monsterY, 8, '#c084fc', Math.random() * Math.PI * 2, 1.5, 7, groundY);
        }, i * 50);
      }
    } else if (type === 'ragnarok_cleave') {
      // 14. Ragnarok Cleave (Warrior Awakening 2): Screen-cleaving void-fire doom slash
      awakeningAnimRef.current = {
        active: true,
        classId: 'warrior',
        startTime: performance.now(),
        targetX: monsterX,
        targetY: monsterY,
        groundY: groundY,
      };
      slashesRef.current.push({
        id: `rag_${Date.now()}`,
        x: monsterX,
        y: monsterY,
        radius: 160,
        startAngle: -Math.PI * 0.9,
        endAngle: Math.PI * 0.45,
        maxThickness: 45,
        color: '#ffffff',
        glowColor: '#dc2626',
        life: 0,
        maxLife: 0.45,
        rotation: 0.35,
      });
      spawnShockwave(monsterX, groundY, 160, 520, '#ef4444', 0.42, 12);
      spawnShockwave(monsterX, monsterY, 130, 480, '#7f1d1d', 0.85, 10);
      spawnDirectionalSparks(monsterX, groundY - 20, 50, '#f97316', -Math.PI * 0.5, 2.5, 13, groundY);
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
    } else if (type === 'blizzard') {
      // 5. Blizzard: Multi-layer Cryo Blizzard vortex
      for (let s = 0; s < 4; s++) {
        setTimeout(() => {
          spawnShockwave(monsterX + (Math.random() - 0.5) * 40, groundY - 10, 80 + s * 10, 320, '#67e8f9', 0.45, 5);
          spawnDirectionalSparks(monsterX, groundY - 20, 14, '#a5f3fc', Math.random() * Math.PI * 2, 2.0, 7, groundY);
        }, s * 70);
      }
    } else if (type === 'arcane_orb') {
      // 6. Arcane Orb: Large slow-moving violet piercing orb
      projectilesRef.current.push({
        id: `ao_${Date.now()}`,
        type: 'magic_missile',
        startX: heroX,
        startY: heroY,
        targetX: monsterX,
        targetY: monsterY,
        currentX: heroX,
        currentY: heroY,
        progress: 0,
        speed: 0.038,
        color: '#c084fc',
        size: 26,
        trail: [],
      });
    } else if (type === 'thunder_strike') {
      // 7. Thunder Strike: Single-target massive sky lightning bolt
      const { main, branches } = generateLightning(monsterX, -40, monsterX, monsterY, 40, 5, 0.35);
      lightningRef.current.push({
        id: `ts_${Date.now()}`,
        segments: main,
        branches: branches,
        color: '#fbbf24',
        coreColor: '#ffffff',
        life: 0,
        maxLife: 0.28,
        width: 4.5,
      });
      spawnShockwave(monsterX, monsterY, 90, 460, '#fbbf24', 0.85, 8);
      spawnDirectionalSparks(monsterX, monsterY, 30, '#fef08a', Math.PI * 0.5, 2.4, 11, groundY);
    } else if (type === 'frost_nova') {
      // 8. Frost Nova: Instant radial ice crystal shockwave
      spawnShockwave(monsterX, monsterY, 110, 480, '#38bdf8', 0.9, 8);
      spawnDirectionalSparks(monsterX, monsterY, 26, '#e0f2fe', 0, 3.14, 8.5, groundY);
    } else if (type === 'flame_pillar') {
      // 9. Flame Pillar: Erupting ground fire column
      spawnShockwave(monsterX, groundY, 85, 380, '#f97316', 0.42, 8);
      spawnDirectionalSparks(monsterX, groundY, 32, '#ea580c', -Math.PI * 0.5, 2.2, 10, groundY);
    } else if (type === 'gravity_well') {
      // 10. Gravity Well: Inward black hole vortex
      spawnShockwave(monsterX, monsterY, 95, 350, '#9333ea', 0.9, 8);
      spawnDirectionalSparks(monsterX, monsterY, 24, '#c084fc', 0, 3.14, 7, groundY);
    } else if (type === 'mana_burst') {
      // 11. Mana Burst: Concentrated prismatic energy explosion
      spawnShockwave(monsterX, monsterY, 115, 520, '#a855f7', 0.85, 9);
      spawnDirectionalSparks(monsterX, monsterY, 34, '#f0abfc', Math.random() * Math.PI * 2, 2.8, 10, groundY);
    } else if (type === 'arcane_familiar') {
      // 12. Arcane Familiar: Orbiting glowing wisp around hero shooting sub-bolts
      for (let f = 0; f < 3; f++) {
        setTimeout(() => {
          projectilesRef.current.push({
            id: `af_${Date.now()}_${f}`,
            type: 'magic_missile',
            startX: heroX + 25,
            startY: heroY - 30,
            targetX: monsterX,
            targetY: monsterY + (f - 1) * 15,
            currentX: heroX + 25,
            currentY: heroY - 30,
            progress: 0,
            speed: 0.075,
            color: '#e879f9',
            size: 9,
            trail: [],
          });
        }, f * 100);
      }
    } else if (type === 'absolute_zero') {
      // 14. Absolute Zero (Mage Awakening 2): Time freeze + Glacier shatter
      awakeningAnimRef.current = {
        active: true,
        classId: 'mage',
        startTime: performance.now(),
        targetX: monsterX,
        targetY: monsterY,
        groundY: groundY,
      };
      spawnShockwave(monsterX, monsterY, 160, 520, '#06b6d4', 0.9, 12);
      spawnShockwave(monsterX, groundY, 140, 420, '#bae6fd', 0.45, 10);
      spawnDirectionalSparks(monsterX, monsterY, 55, '#ffffff', 0, 3.14, 11, groundY);
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
  // Trigger 3-Stage Basic Attack Combo VFX (Warrior & Mage)
  // ==========================================
  useEffect(() => {
    if (!basicAttackEvent) return;
    if (lastBasicEventIdRef.current === basicAttackEvent.id) return;
    lastBasicEventIdRef.current = basicAttackEvent.id;

    const { heroX, heroY, monsterX, monsterY, groundY } = getAnchors();
    const { comboStep, classId: atkClass } = basicAttackEvent;

    if (atkClass === 'warrior') {
      if (comboStep === 1) {
        // ⚔️ Warrior Combo 1: Crisp Cyan-Silver Horizontal Slash (75ms Windup, 120ms Impact Peak)
        setTimeout(() => {
          slashesRef.current.push({
            id: `w_basic1_${Date.now()}`,
            x: monsterX - 6,
            y: monsterY,
            radius: 78,
            startAngle: -Math.PI * 0.70,
            endAngle: Math.PI * 0.20,
            maxThickness: 20,
            color: '#38bdf8',
            glowColor: '#0284c7',
            life: 0,
            maxLife: 0.19,
            rotation: 0.12,
          });
          spawnDirectionalSparks(monsterX, monsterY, 16, '#38bdf8', Math.PI * 0.2, 1.0, 8, groundY);
        }, 75);
      } else if (comboStep === 2) {
        // ⚔️ Warrior Combo 2: Reverse Upward Golden-Amber Slash (100ms Windup, 150ms Impact Peak)
        setTimeout(() => {
          slashesRef.current.push({
            id: `w_basic2_${Date.now()}`,
            x: monsterX + 4,
            y: monsterY - 4,
            radius: 84,
            startAngle: Math.PI * 0.78,
            endAngle: -Math.PI * 0.28,
            maxThickness: 24,
            color: '#fbbf24',
            glowColor: '#d97706',
            life: 0,
            maxLife: 0.21,
            rotation: -0.32,
          });
          spawnShockwave(monsterX, monsterY, 55, 360, '#fde047', 0.85, 4);
          spawnDirectionalSparks(monsterX, monsterY, 20, '#fbbf24', -Math.PI * 0.35, 1.2, 8.8, groundY);
        }, 100);
      } else {
        // 💥 Warrior Combo 3 (Finisher): Crimson-Gold X-Cross Cleave + Forward Sword Wave (125ms Cleave, 190ms Heavy Impact)
        setTimeout(() => {
          projectilesRef.current.push({
            id: `w_basic3_wave_${Date.now()}`,
            type: 'sword_wave',
            startX: heroX + 26,
            startY: heroY,
            targetX: monsterX,
            targetY: monsterY,
            currentX: heroX + 26,
            currentY: heroY,
            progress: 0,
            speed: 0.11,
            color: '#f97316',
            size: 22,
            trail: [],
          });
        }, 80);

        setTimeout(() => {
          slashesRef.current.push({
            id: `w_basic3a_${Date.now()}`,
            x: monsterX,
            y: monsterY,
            radius: 94,
            startAngle: -Math.PI * 0.82,
            endAngle: Math.PI * 0.32,
            maxThickness: 26,
            color: '#f97316',
            glowColor: '#ea580c',
            life: 0,
            maxLife: 0.24,
            rotation: 0.38,
          });
          slashesRef.current.push({
            id: `w_basic3b_${Date.now()}`,
            x: monsterX,
            y: monsterY,
            radius: 90,
            startAngle: Math.PI * 0.82,
            endAngle: -Math.PI * 0.32,
            maxThickness: 24,
            color: '#fbbf24',
            glowColor: '#d97706',
            life: 0,
            maxLife: 0.24,
            rotation: -0.38,
          });
          spawnShockwave(monsterX, groundY, 78, 420, '#fbbf24', 0.45, 6);
          spawnDirectionalSparks(monsterX, monsterY, 28, '#f97316', Math.PI * 0.5, 1.8, 10, groundY);
        }, 125);

        // ⚔️ Warrior 3-Hit Finisher: High-Speed Blade After-Image (검기 잔상)
        setTimeout(() => {
          slashesRef.current.push({
            id: `w_basic3_ghost_${Date.now()}`,
            x: monsterX + 3,
            y: monsterY,
            radius: 104,
            startAngle: -Math.PI * 0.78,
            endAngle: Math.PI * 0.28,
            maxThickness: 16,
            color: '#fef08a',
            glowColor: '#f97316',
            life: 0,
            maxLife: 0.18,
            rotation: 0.35,
          });
        }, 160);
      }
    } else {
      // 🔮 Mage 3-Stage Arcane Bolt Combo (Staff Anchor Coordinates)
      const staffTipX = heroX + 10;
      const staffTipY = heroY - 14;

      if (comboStep === 1) {
        // 1타: 마력 집중 후 지팡이 끝에서 아케인 볼트 발사 (80ms 발사, 170ms 적중)
        setTimeout(() => {
          projectilesRef.current.push({
            id: `m_basic1_${Date.now()}`,
            type: 'mage_bolt',
            startX: staffTipX,
            startY: staffTipY,
            targetX: monsterX,
            targetY: monsterY,
            currentX: staffTipX,
            currentY: staffTipY,
            progress: 0,
            speed: 0.12,
            color: '#38bdf8',
            size: 13,
            trail: [],
          });
        }, 80);
      } else if (comboStep === 2) {
        // 2타: 양손 집중 후 트윈 헬릭스 이중 투사체 발사 (100ms 발사, 190ms 적중)
        setTimeout(() => {
          [-20, 20].forEach((offset, idx) => {
            projectilesRef.current.push({
              id: `m_basic2_${Date.now()}_${idx}`,
              type: 'magic_missile',
              startX: staffTipX,
              startY: staffTipY + (idx === 0 ? -8 : 8),
              targetX: monsterX,
              targetY: monsterY,
              currentX: staffTipX,
              currentY: staffTipY,
              progress: 0,
              speed: 0.115,
              color: idx === 0 ? '#38bdf8' : '#c084fc',
              size: 11,
              waveOffset: offset,
              wavePhase: idx * Math.PI,
              trail: [],
            });
          });
        }, 100);
      } else {
        // 3타: 공중 부유 후 강화 아케인 노바 구체 발사 (130ms 발사, 230ms 대폭발 착탄)
        setTimeout(() => {
          projectilesRef.current.push({
            id: `m_basic3_${Date.now()}`,
            type: 'fireball',
            startX: staffTipX,
            startY: staffTipY - 8,
            targetX: monsterX,
            targetY: monsterY,
            currentX: staffTipX,
            currentY: staffTipY - 8,
            progress: 0,
            speed: 0.10,
            color: '#a855f7',
            size: 19,
            trail: [],
          });
        }, 130);

        setTimeout(() => {
          spawnShockwave(monsterX, monsterY, 78, 430, '#c084fc', 0.85, 6);
          spawnDirectionalSparks(monsterX, monsterY, 26, '#38bdf8', 0, 2.4, 9.5, groundY);
        }, 230);
      }
    }
  }, [basicAttackEvent]);

  // ==========================================
  // Trigger Active Pet Companion Projectile VFX
  // ==========================================
  useEffect(() => {
    if (!petAttackEvent) return;
    if (lastPetEventIdRef.current === petAttackEvent.id) return;
    lastPetEventIdRef.current = petAttackEvent.id;

    const { heroX, monsterX, monsterY, groundY } = getAnchors();
    const petColor = petAttackEvent.petId.includes('fox')
      ? '#f97316'
      : petAttackEvent.petId.includes('fairy')
      ? '#34d399'
      : petAttackEvent.petId.includes('dragon')
      ? '#ef4444'
      : '#38bdf8';

    // Launch projectile at 80ms when pet reaches leap forward apex
    setTimeout(() => {
      projectilesRef.current.push({
        id: `pet_proj_${petAttackEvent.id}`,
        type: 'magic_missile',
        startX: heroX - 20,
        startY: groundY - 26,
        targetX: monsterX,
        targetY: monsterY + 8,
        currentX: heroX - 20,
        currentY: groundY - 26,
        progress: 0,
        speed: 0.11,
        color: petColor,
        size: 11,
        waveOffset: -16,
        wavePhase: 0.5,
        trail: [],
      });
    }, 80);

    // Impact at 240ms exactly synchronized with App.tsx damage application
    setTimeout(() => {
      spawnShockwave(monsterX, monsterY + 8, 48, 340, petColor, 0.85, 3.5);
      spawnDirectionalSparks(monsterX, monsterY + 8, 14, petColor, 0, 2.0, 7.5, groundY);
    }, 240);
  }, [petAttackEvent]);

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
  // Trigger Celestial Prestige Ascension & Star Motes VFX
  // ==========================================
  useEffect(() => {
    if (!prestigeVfxEvent) return;
    if (lastPrestigeEventIdRef.current === prestigeVfxEvent.id) return;
    lastPrestigeEventIdRef.current = prestigeVfxEvent.id;

    const { heroX, heroY, groundY } = getAnchors();
    prestigeVfxRef.current = {
      id: prestigeVfxEvent.id,
      startTime: performance.now(),
      duration: 2000,
      heroX,
      heroY,
      groundY,
    };

    // Ascending radiant sparks and star motes
    for (let i = 0; i < 48; i++) {
      sparksRef.current.push({
        x: heroX + (Math.random() - 0.5) * 44,
        y: groundY - Math.random() * 25,
        vx: (Math.random() - 0.5) * 2.4,
        vy: -(4.0 + Math.random() * 5.0),
        life: 0,
        maxLife: 45 + Math.floor(Math.random() * 35),
        color: i % 2 === 0 ? '#fbbf24' : '#c084fc',
        coreColor: '#ffffff',
        width: 2.8 + Math.random() * 2.0,
        gravity: -0.05,
        drag: 0.985,
        bounceGroundY: 9999,
        bouncesLeft: 0,
      });
    }

    // Expanding celestial ground shockwaves
    shockwavesRef.current.push({
      x: heroX,
      y: groundY,
      currentRadius: 10,
      maxRadius: 150,
      speed: 4.8,
      thickness: 4.5,
      color: '#fbbf24',
      aspectY: 0.42,
      life: 0,
      maxLife: 35,
    });
    shockwavesRef.current.push({
      x: heroX,
      y: groundY,
      currentRadius: 10,
      maxRadius: 120,
      speed: 3.6,
      thickness: 3.5,
      color: '#a855f7',
      aspectY: 0.42,
      life: 0,
      maxLife: 32,
    });
  }, [prestigeVfxEvent]);

  // ==========================================
  // Trigger Dungeon Dedicated Canvas 2D VFX (Zero Text Emojis)
  // ==========================================
  useEffect(() => {
    if (!dungeonVfxEvent) return;
    if (lastDungeonEventIdRef.current === dungeonVfxEvent.id) return;
    lastDungeonEventIdRef.current = dungeonVfxEvent.id;

    const { heroX, heroY, monsterX, monsterY, groundY } = getAnchors();

    if (dungeonVfxEvent.type === 'gold_burst') {
      // Golden Goblin defeated: fountain of spinning Canvas 2D gold coins + golden shockwave
      spawnShockwave(monsterX, monsterY, 72, 420, '#fbbf24', 0.75, 5);
      spawnDirectionalSparks(monsterX, monsterY, 16, '#fde047', -Math.PI * 0.5, 2.2, 8.5, groundY);

      for (let i = 0; i < 12; i++) {
        const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.4;
        const speed = 5.5 + Math.random() * 5.0;
        coinsRef.current.push({
          x: monsterX + (Math.random() - 0.5) * 20,
          y: monsterY - 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.0,
          radius: 6 + Math.random() * 3.5,
          spin: Math.random() * Math.PI * 2,
          spinSpeed: 10 + Math.random() * 8,
          life: 0,
          maxLife: 0.65 + Math.random() * 0.25,
          groundY,
          bouncesLeft: 2,
        });
      }
    } else if (dungeonVfxEvent.type === 'wave_clear') {
      // Training Forest wave clear: emerald spirit rings + ascending green motes
      spawnShockwave(monsterX, groundY, 110, 440, '#10b981', 0.45, 6);
      spawnShockwave(heroX, heroY, 85, 380, '#34d399', 0.85, 4.5);
      spawnDirectionalSparks(monsterX, monsterY, 22, '#6ee7b7', -Math.PI * 0.5, 2.6, 9.0, groundY);
    } else if (dungeonVfxEvent.type === 'ruins_clear') {
      // Ancient Ruins boss defeated: arcane crystal burst + twin shockwaves
      spawnShockwave(monsterX, monsterY, 125, 460, '#a855f7', 0.8, 7);
      spawnShockwave(monsterX, groundY, 140, 480, '#38bdf8', 0.45, 6);
      spawnDirectionalSparks(monsterX, monsterY, 32, '#c084fc', -Math.PI * 0.5, 3.0, 10.5, groundY);
      spawnDirectionalSparks(monsterX, monsterY, 18, '#fbbf24', 0, 3.14, 8.5, groundY);
    }
  }, [dungeonVfxEvent]);

  // ==========================================
  // Trigger Equipment Summon Canvas 2D VFX
  // ==========================================
  useEffect(() => {
    if (!summonVfxEvent) return;
    if (lastSummonEventIdRef.current === summonVfxEvent.id) return;
    lastSummonEventIdRef.current = summonVfxEvent.id;

    const { heroX, heroY, groundY } = getAnchors();
    summonVfxRef.current = {
      id: summonVfxEvent.id,
      rarity: summonVfxEvent.rarity,
      startTime: performance.now(),
      duration: summonVfxEvent.rarity === 'mythic' ? 1600 : summonVfxEvent.rarity === 'legendary' ? 1400 : 1100,
      heroX,
      heroY,
    };

    const colorByRarity: Record<EquipmentRarity, string> = {
      common: '#cbd5e1',
      rare: '#38bdf8',
      epic: '#c084fc',
      legendary: '#fbbf24',
      mythic: '#f43f5e',
    };
    const col = colorByRarity[summonVfxEvent.rarity] || '#38bdf8';
    spawnShockwave(heroX, heroY, summonVfxEvent.rarity === 'mythic' ? 130 : 90, 420, col, 0.75, 5);
    spawnDirectionalSparks(
      heroX,
      heroY,
      summonVfxEvent.rarity === 'mythic' ? 28 : summonVfxEvent.rarity === 'legendary' ? 20 : 12,
      col,
      -Math.PI * 0.5,
      2.6,
      8.5,
      groundY
    );
  }, [summonVfxEvent]);


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

      // 🛡️ Long-run Memory Safety Caps (Prevents unbounded growth under extreme multi-hit / idle conditions)
      if (sparksRef.current.length > 150) {
        sparksRef.current.splice(0, sparksRef.current.length - 120);
      }
      if (shockwavesRef.current.length > 25) {
        shockwavesRef.current.splice(0, shockwavesRef.current.length - 20);
      }
      if (projectilesRef.current.length > 35) {
        projectilesRef.current.splice(0, projectilesRef.current.length - 25);
      }
      if (slashesRef.current.length > 25) {
        slashesRef.current.splice(0, slashesRef.current.length - 15);
      }

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
      // 1.5. Celestial Prestige Ascension Pillar & Ground Runic Star
      // ----------------------------------------------------
      if (prestigeVfxRef.current) {
        const pv = prestigeVfxRef.current;
        const elapsed = performance.now() - pv.startTime;
        if (elapsed >= pv.duration) {
          prestigeVfxRef.current = null;
        } else {
          const progress = elapsed / pv.duration;
          const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

          ctx.save();
          // A. Ascending Celestial Light Pillar (Top to Ground)
          const pillarWidth = 56 + Math.sin(progress * Math.PI) * 20;
          const beamGrad = ctx.createLinearGradient(pv.heroX, 0, pv.heroX, pv.groundY);
          beamGrad.addColorStop(0, `rgba(251, 191, 36, ${0.15 * alpha})`);
          beamGrad.addColorStop(0.35, `rgba(251, 191, 36, ${0.45 * alpha})`);
          beamGrad.addColorStop(0.7, `rgba(168, 85, 247, ${0.4 * alpha})`);
          beamGrad.addColorStop(1, `rgba(251, 191, 36, ${0.75 * alpha})`);

          ctx.fillStyle = beamGrad;
          ctx.fillRect(pv.heroX - pillarWidth / 2, 0, pillarWidth, pv.groundY);

          // B. Inner Bright Core Beam
          const coreWidth = pillarWidth * 0.35;
          const coreGrad = ctx.createLinearGradient(pv.heroX, 0, pv.heroX, pv.groundY);
          coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.2 * alpha})`);
          coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.65 * alpha})`);
          coreGrad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * alpha})`);
          ctx.fillStyle = coreGrad;
          ctx.fillRect(pv.heroX - coreWidth / 2, 0, coreWidth, pv.groundY);

          // C. Rotating Runic Star Circle on Ground
          const circleRadius = 55 + Math.sin(progress * Math.PI) * 10;
          const rotation = (elapsed / 1000) * 1.6;
          ctx.save();
          ctx.translate(pv.heroX, pv.groundY);
          ctx.scale(1, 0.42); // Ground perspective ellipse
          ctx.rotate(rotation);
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.75 * alpha})`;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12;

          // Outer circle
          ctx.beginPath();
          ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner concentric circle
          ctx.beginPath();
          ctx.arc(0, 0, circleRadius * 0.7, 0, Math.PI * 2);
          ctx.stroke();

          // Runic 6-pointed Star (Hexagram)
          for (let t = 0; t < 2; t++) {
            const offset = (t * Math.PI) / 3;
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
              const theta = offset + (k * 2 * Math.PI) / 3;
              const rx = Math.cos(theta) * circleRadius * 0.95;
              const ry = Math.sin(theta) * circleRadius * 0.95;
              if (k === 0) ctx.moveTo(rx, ry);
              else ctx.lineTo(rx, ry);
            }
            ctx.closePath();
            ctx.stroke();
          }
          ctx.restore();
          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // 1.6. Equipment Summon Ritual Canvas 2D VFX
      // ----------------------------------------------------
      if (summonVfxRef.current) {
        const sv = summonVfxRef.current;
        const elapsed = performance.now() - sv.startTime;
        if (elapsed >= sv.duration) {
          summonVfxRef.current = null;
        } else {
          drawEquipmentSummonRitual(
            ctx,
            sv.heroX,
            sv.heroY,
            sv.rarity,
            elapsed / sv.duration,
            elapsed / 1000,
            1.0
          );
        }
      }

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

      // ----------------------------------------------------
      // 9. Spinning Canvas 2D Gold Coins (Gold Mine Dungeon)
      // ----------------------------------------------------
      for (let i = coinsRef.current.length - 1; i >= 0; i--) {
        const coin = coinsRef.current[i];
        coin.life += dt;
        if (coin.life >= coin.maxLife) {
          coinsRef.current.splice(i, 1);
          continue;
        }

        coin.x += coin.vx;
        coin.y += coin.vy;
        coin.vy += 0.42; // gravity
        coin.vx *= 0.98;
        coin.spin += coin.spinSpeed * dt;

        if (coin.y >= coin.groundY && coin.bouncesLeft > 0) {
          coin.y = coin.groundY;
          coin.vy = -Math.abs(coin.vy) * 0.55;
          coin.vx *= 0.8;
          coin.bouncesLeft--;
        }

        const alpha = Math.max(0, 1 - Math.pow(coin.life / coin.maxLife, 1.6));
        const rx = Math.max(1.8, Math.abs(Math.cos(coin.spin)) * coin.radius);
        const ry = coin.radius;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(coin.x, coin.y);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;

        // Outer gold rim
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner embossed core
        if (rx > 3.2) {
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.ellipse(0, 0, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
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
