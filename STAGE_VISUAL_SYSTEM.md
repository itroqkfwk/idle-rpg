# 2D Idle RPG Stage Visual & Environment System

## 1. 개요 (Overview)
본 문서는 스테이지 및 챕터별 동적 환경 변화 시스템(`src/data/stages.ts`)의 설계와 시각적 전환 원리를 설명합니다.
모든 스테이지가 동일한 숲 배경으로 보였던 단조로움을 탈피하고, 챕터 진행 및 보스전에 따라 맵 아트, 조명 필터, 안개 그라데이션, 부유 파티클이 유기적으로 연동됩니다.

---

## 2. 챕터별 환경 구성 (Chapter Environments)

| 챕터 | 명칭 | 배경 에셋 | 테마 / 톤앤매너 | 특수 파티클 | 조명 & 필터 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Chapter 1** | **새싹의 숲 (Sprout Forest)** | `forest_bg.jpg` | 햇살 가득한 동화풍 녹색 숲길과 고대 고성 | 초록 잎사귀 / 반딧불이 | `brightness(1.02) saturate(1.05)`, 햇살 갓레이 |
| **Chapter 2** | **달빛 호숫가 (Moonlit Lake)** | `lake_bg.jpg` | 신비로운 밤하늘 초승달과 푸른 수련 호수, 석조 아치 | 달빛 물방울 / 반딧불이 | `brightness(1.0) saturate(1.05)`, 심야 블루 안개 |
| **Chapter 3** | **노을빛 단풍 골짜기 (Autumn Valley)** | `autumn_bg.jpg` | 황금빛 석양과 붉은 단풍나무, 고대 사당로 | 붉은 단풍잎 (Maple Leaves) | `brightness(0.94) saturate(1.2)`, 노을 앰버 안개 |

---

## 3. 세부 구역 변주 (Sub-Area Progression)

각 챕터 내에서도 10단계의 스테이지 진행에 따라 4단계의 분위기 변화가 실시간 반영됩니다:

1. **입구 구역 (Stage 1~3)**:
   - 맑고 화사한 기본 환경. 탐험의 시작을 알리는 부드러운 채도.
2. **심층 구역 (Stage 4~6)**:
   - 대비와 채도가 약 10~15% 상승하며 숲과 물, 단풍이 더욱 짙어짐.
3. **신비/유적 구역 (Stage 7~9)**:
   - 안개 그라데이션 밀도가 높아지며 고대 유적의 마력 효과 가미.
4. **보스 제단 (Stage 10 Raid)**:
   - `boss_crimson` 모드로 전환: `brightness(0.78) contrast(1.25)`, 붉은 경고 비네트 펄스(`boss-vignette-pulse`), 타오르는 화염 불씨 파티클(`boss_embers`) 발동.

---

## 4. 무중단 전환 원리 (Seamless Crossfade Transitions)

- **Key 기반 이미지 렌더링**: 챕터 변경 시 `key={stageEnv.bgImage}`를 통해 새 이미지가 마운트되며 부드러운 전환을 지원합니다.
- **CSS 필터 가속**: GPU 하드웨어 가속 스타일(`will-change: transform`, `transform: scale(1.03)`)을 적용하여 씬 전환 시 프레임 드랍이 발생하지 않습니다.
- **동적 캔버스 파티클 연계**: 챕터 변경 시 `BattleFxCanvas`의 `ambientType`이 즉시 갱신되어, 1챕터 잎사귀 → 2챕터 푸른 물방울 → 3챕터 붉은 단풍잎으로 자연스럽게 교체됩니다.
