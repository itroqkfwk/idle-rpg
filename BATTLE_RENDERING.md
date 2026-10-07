# 2D Idle RPG Battle Rendering Architecture & Animation System

## 1. 개요 (Overview)
본 문서는 2D 방치형 RPG 게임의 전투 연출 엔진 및 렌더링 파이프라인의 구조와 동작 방식을 정의합니다.
기존 웹 DOM 기반의 단순 깜빡임 및 평면적 CSS 효과를 전면 개편하여, 고성능 **HTML5 Canvas 2D 하이브리드 전투 연출 엔진**과 **7단계 시퀀스 캐릭터 모션**을 구축했습니다.

---

## 2. 렌더링 레이어 파이프라인 (Layer Pipeline)

전투 씬은 z-index 기준 6개의 독립적인 레이어로 구성되어 부드러운 60fps 연출과 시각적 깊이감을 제공합니다:

```
[Layer 6] UI & Overhead HUD Layer (z-index: 30)
  ├── Combatant Overhead HP Bars & Lv Tags
  ├── Floating Damage Numbers (Anchored to Combatant DOM coordinates)
  └── Stage/Boss Alert Banners
         ▲
[Layer 5] Combatant Sprites & Shadows (z-index: 6 ~ 10)
  ├── Hero 2D Sprite (Warrior 대검 / Mage 지팡이)
  ├── Companion Pet (귀여운 여우)
  └── Enemy Monster Sprite & Hit-Stop Feedback
         ▲
[Layer 4] 2D Canvas Battle VFX Engine (z-index: 25)
  ├── Real-time Projectile Flight (Magic Missile, Fireball, Ice Spear, Sword Wave, Meteor)
  ├── Dynamic Particle Impact Bursts & Lightning Arcs
  └── Ambient Environment Motes (Pollen, Leaves, Water Orbs)
         ▲
[Layer 3] Atmospheric Lighting & Fog Overlays (z-index: 2 ~ 5)
  ├── God-Rays Overlay / Twilight Fog Gradient
  ├── Foreground Bush Silhouette Framing
  └── Boss Raid Crimson Pulse Vignette
         ▲
[Layer 2] CSS Ambient Leaves & Fireflies (z-index: 2)
  └── Drifting Leaves & Glowing Firefly Motes
         ▲
[Layer 1] High-Resolution 2D Environment Backdrop (z-index: 1)
  └── Chapter 1 (Sprout Forest) / Chapter 2 (Moonlit Lake) / Chapter 3 (Autumn Red Maple Valley)
```

---

## 3. 직업별 모션 시퀀스 안무 (Motion Choreography)

### 3.1 전사 (Warrior) - 근접 돌진 및 타격 시퀀스
1. **Idle (대기, 0ms)**: 안정적인 호흡 애니메이션 (`translateY(-2px) scale(0.995, 1.008)`).
2. **Anticipation (공격 준비, 0 ~ 80ms)**: 몸을 뒤로 당겨 힘을 축적 (`translateX(-12px) translateY(3px) rotate(-6deg)`).
3. **Dash Rush (돌진, 80 ~ 180ms)**: 몬스터 전방으로 강력하게 돌진 (`translateX(78px)` 모바일, `translateX(clamp(85px, 7vw, 135px))` PC).
4. **Weapon Swing & Impact (타격 접촉, 180 ~ 260ms)**: 대검을 크게 휘두르며 타격 (`rotate(12deg)`), 하얀색/청록색 궤적 호선 (`hero-slash-arc-vfx`) 방출.
5. **Hit-Stop Freeze Frame (역경직, 50 ~ 85ms)**: 공격자와 몬스터의 애니메이션을 일시 정지시키고 화면 미세 진동 (`shake-normal` / `shake-crit` / `shake-boss`).
6. **Enemy Knockback & Sparks (적 피격 및 스파크)**: 몬스터가 8px 뒤로 밀려나며 캔버스 상에서 황금빛 스파크 파티클 14개 폭발.
7. **Recovery (복귀, 260 ~ 520ms)**: 원래 위치로 유연하게 복귀 (`translateX(0) rotate(0deg)`).

### 3.2 마법사 (Mage) - 원거리 영창 및 투사체 발사 시퀀스
1. **Idle (대기, 0ms)**: 지팡이를 들고 대기하는 귀여운 치비 스탠스.
2. **Casting Stance (영창, 0 ~ 100ms)**: 전방 돌진 없이 제자리 유지, 지팡이를 살짝 모음 (`translateX(-8px) translateY(-3px) rotate(-4deg)`).
3. **Staff Flare & Launch (발사, 100 ~ 220ms)**: 지팡이를 높이 치켜들며 마법 보석 섬광 방출 (`translateY(-15px) rotate(4deg)`).
4. **Projectile Flight (투사체 궤적, 220 ~ 360ms)**: `BattleFxCanvas`를 통해 지팡이 끝(Staff Core)에서 몬스터 중심(Monster Center)으로 비전 마력탄/원소 투사체가 빛의 궤적을 그리며 60fps로 비행.
5. **Impact & Magic Burst (마법 폭발, 360 ~ 440ms)**: 투사체가 몬스터에 도달하는 순간 충격파와 함께 18개의 비전/속성 스파크 파티클 확산.
6. **Recovery (복귀, 440 ~ 500ms)**: 제자리로 안정적으로 착지 (`translateY(0)`).

---

## 4. 고성능 2D Canvas 투사체 & 파티클 시스템 (`BattleFxCanvas`)

웹 브라우저의 DOM 노드 증식(DOM Bloat)과 리플로우를 방지하기 위해 `BattleFxCanvas`는 순수 HTML5 Canvas 2D Context를 사용하여 독립적인 `requestAnimationFrame` 루프에서 실행됩니다.

- **Magic Missile**: 3발의 유도 마력탄이 70ms 시차를 두고 순차 발사되어 몬스터를 타격.
- **Fireball**: 화염 코어와 긴 연기 잔상을 남기며 날아가 폭발하는 중형 화염구.
- **Ice Spear**: 날카로운 얼음 파편과 청백색 꼬리를 남기며 고속 관통하는 빙결 창.
- **Meteor**: 화면 상단 대각선에서 몬스터 머리 위로 낙하하여 대지를 흔드는 거대 운석.
- **Chain Lightning**: 지팡이와 몬스터 사이를 가르는 고압 전기 스파크 24개 실시간 연쇄 생성.
- **Ambient Particles**: 맵 테마에 맞춰 흩날리는 나뭇잎, 붉은 단풍잎, 달빛 수련 물방울, 보스 불씨가 자연스럽게 부유.

---

## 5. 데미지 수치 및 앵커링 시스템

- 데미지 수치(Damage Numbers)는 더 이상 화면 중앙이나 임의 좌표에 뜨지 않습니다.
- 몬스터 및 영웅 스프라이트 박스 상단의 앵커 레이어(`player-damage-anchor-layer`, `monster-hp-anchor`)에 정밀하게 마운트됩니다.
- 타격 순간 폰트 크기 `14~18px`, 굵기 `900`의 텍스트가 위로 `15~24px` 솟아오르며 450ms 내에 페이드아웃됩니다.
- 일반 데미지, 치명타(CRIT!), 스킬 명칭 칩이 시각적으로 명확하게 구분됩니다.
