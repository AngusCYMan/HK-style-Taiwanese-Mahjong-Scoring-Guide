---
name: 港式台灣麻雀番數表
description: A group's house-rule 番 sheet as a bilingual MTR-style line map
colors:
  enamel-white: "#f4f4f1"
  panel-white: "#ffffff"
  platform-black: "#1b1b1b"
  ink-secondary: "#4a4a47"
  ink-tertiary: "#6b6b66"
  rule-grey: "#d9d9d3"
  plain-plate: "#ecece7"
  exit-yellow: "#f5c400"
  night-ground: "#0e0f10"
  night-panel: "#17181a"
  night-ink: "#f1f1ec"
  night-ink-secondary: "#c4c4bd"
  night-ink-tertiary: "#9a9a93"
  night-rule: "#2c2d30"
  night-plain-plate: "#26272a"
  night-plate-ink: "#111213"
  line-ba-red: "#d6202b"
  line-hf-blue: "#0071bc"
  line-tx-green: "#00843d"
  line-dr-orange: "#f47b20"
  line-ch-purple: "#7d4a9e"
  line-fa-sky: "#5bb8e6"
  line-cp-brick: "#9a3b26"
  line-wd-teal: "#00888a"
  line-oc-pink: "#e878b2"
  line-ev-lime: "#b6bd00"
  line-sp-grey: "#8e959c"
typography:
  display:
    fontFamily: "Noto Sans TC, PingFang HK, Microsoft JhengHei, sans-serif"
    fontSize: "clamp(1.6rem, 1.1rem + 2.2vw, 2.5rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Noto Sans TC, PingFang HK, Microsoft JhengHei, sans-serif"
    fontSize: "clamp(1.35rem, 1.1rem + 1vw, 1.75rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "0.02em"
  title:
    fontFamily: "Noto Sans TC, PingFang HK, Microsoft JhengHei, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Noto Sans TC, PingFang HK, Microsoft JhengHei, sans-serif"
    fontSize: "0.93rem"
    fontWeight: 400
    lineHeight: 1.55
  body-en:
    fontFamily: "Source Sans 3, Noto Sans TC, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.55
  label-en:
    fontFamily: "Source Sans 3, Noto Sans TC, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.2
  numeral:
    fontFamily: "Source Sans 3, Noto Sans TC, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum, lnum"
  code:
    fontFamily: "Source Sans 3, Noto Sans TC, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  flag: "3px"
  sm: "4px"
  tile: "5px"
  plate: "6px"
  md: "8px"
  card: "10px"
  pill: "999px"
  round: "50%"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  gutter: "clamp(16px, 4vw, 40px)"
components:
  fan-plate:
    backgroundColor: "{colors.plain-plate}"
    textColor: "{colors.platform-black}"
    typography: "{typography.numeral}"
    rounded: "{rounded.plate}"
    padding: "6px 10px 5px"
    width: "64px"
  fan-plate-limit:
    backgroundColor: "{colors.platform-black}"
    textColor: "{colors.panel-white}"
    typography: "{typography.numeral}"
    rounded: "{rounded.plate}"
    padding: "6px 10px 5px"
    width: "64px"
  direction-plate:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.platform-black}"
    rounded: "{rounded.md}"
    padding: "7px 16px 6px"
    width: "108px"
  direction-plate-active:
    backgroundColor: "{colors.platform-black}"
    textColor: "{colors.panel-white}"
  theme-button:
    textColor: "{colors.platform-black}"
    rounded: "{rounded.md}"
    size: "44px"
  station-dot:
    typography: "{typography.code}"
    rounded: "{rounded.round}"
    size: "26px"
  station-dot-wide:
    rounded: "{rounded.round}"
    size: "30px"
  roundel:
    typography: "{typography.label-en}"
    rounded: "{rounded.round}"
    size: "48px"
  station-flag:
    backgroundColor: "{colors.exit-yellow}"
    textColor: "{colors.platform-black}"
    rounded: "{rounded.flag}"
    padding: "2px 4px"
  item-chip:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.platform-black}"
    rounded: "{rounded.pill}"
    padding: "3px 9px 3px 4px"
  rel-tag-contains:
    textColor: "{colors.platform-black}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  rel-tag-highest:
    backgroundColor: "{colors.plain-plate}"
    textColor: "{colors.platform-black}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  rel-tag-exclusive:
    backgroundColor: "{colors.platform-black}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  rel-tag-add:
    backgroundColor: "{colors.exit-yellow}"
    textColor: "{colors.platform-black}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  notice-card:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.card}"
    padding: "8px 20px"
  notice-head:
    backgroundColor: "{colors.platform-black}"
    textColor: "{colors.panel-white}"
    padding: "12px 20px"
---

# Design System: 港式台灣麻雀番數表

## Overview

**Creative North Star: "The House-Rule Metro"**

The house rules are drawn as a transit system in the idiom of Hong Kong MTR bilingual signage. Every scoring category is a coloured line with a two-letter code, every 番 is a stop on that line, and every value sits on a number plate at the end of the row. The page is enamel-sign white with platform-black type, and the line colours appear only as small marks that identify a line: the bar, the roundel, station dots and the stop track. They never fill whole areas.

The system is dense and made for scanning. It has to work mid-game, when someone reads a phone one-handed at the table, and it has to work for careful reading at home. Chinese always leads in heavy Noto Sans TC 黑體. English follows underneath in Source Sans 3, smaller and greyer, as the second line of a bilingual sign. Surfaces are flat enamel. Depth comes from inversion: limit hands, notice heads and active direction plates turn black on light, or light on black at night. Dark mode is the night platform: black enamel with the same line colours and a light plate in place of the black one.

The signature motion is the train, a ring marker that slides along the strip map to whichever line is in view. Everything else stays still apart from short colour transitions and a one-time flash on a stop you jump to.

**Key Characteristics:**
- Eleven line colours, one per category, each used only for small identifying marks
- Bilingual pairs: 中文 bold and first, English secondary on the next line
- Stable item codes (BA-01, HF-03…) printed on every stop and linked from the rules
- Number plates for 番; limit hands (≥40番) invert
- Exit yellow is a signal colour, never a category
- One signature motion: the train ring on the strip map

## Colors

A neutral enamel-and-black sign system carrying eleven transit line colours, plus a single signal yellow.

### Primary
- **Platform Black** (`platform-black`): All primary ink, the 2px frames on direction plates and section heads, the calculation-flow track, and the inverted plates (limit 番, notice heads, the 雙食 total, the 不同計 tag). In dark mode it swaps to Night Ink (`night-ink`) for the same roles.

### Secondary
- **Exit Yellow** (`exit-yellow`, ink `platform-black`): The signal colour, taken from MTR exit lettering. It is used only for the focus ring, text selection, the 上次 last-line flag on the strip map, the 雙食 branch step in the calculation flow, and the 相加 relation tag. It is the same in both themes.

### Tertiary: Line colours
Each category owns one line colour and one ink colour that reads on it (`types.ts` CATEGORY_META), which the component receives as `--line` / `--line-ink`:
- **BA Red** (`line-ba-red`, white ink), **HF Blue** (`line-hf-blue`, white), **TX Green** (`line-tx-green`, white), **DR Orange** (`line-dr-orange`, black ink), **CH Purple** (`line-ch-purple`, white), **FA Sky** (`line-fa-sky`, black), **CP Brick** (`line-cp-brick`, white), **WD Teal** (`line-wd-teal`, white), **OC Pink** (`line-oc-pink`, black), **EV Lime** (`line-ev-lime`, black), **SP Grey** (`line-sp-grey`, near-black ink #111111).

### Neutral
- **Enamel White** (`enamel-white`): Page ground. Also the fill of hollow stop dots and flow numbers, and the 3px halo that lifts station dots off the track.
- **Panel White** (`panel-white`): Header sign, notice card, worked-example card, item chips. Also the plate ink on inverted plates.
- **Secondary Ink** (`ink-secondary`): Chinese descriptions, English headings under Chinese titles, the title's small suffix.
- **Tertiary Ink** (`ink-tertiary`): English descriptions, item codes, counts, meta lines, operators and separators.
- **Rule Grey** (`rule-grey`): 1px row dividers, the strip track, tile borders, the resting theme-button border.
- **Plain Plate** (`plain-plate`): Standard 番 plates, example and formula tokens, tile groups, the 取最高 tag, hover fill on inactive plates and sidebar stations.
- **Night set** (`night-ground`, `night-panel`, `night-ink`, `night-ink-secondary`, `night-ink-tertiary`, `night-rule`, `night-plain-plate`, `night-plate-ink`): Direct replacements under `html.dark`. The limit plate becomes `night-ink` with `night-plate-ink`.

### Named Rules
**The Line Colour Marks, Never Fills Rule.** A line colour appears only on the line bar (8px), the roundel, station dots, the 4px stop track, stop-dot rings and chip code pills. It never becomes a section background, a card fill or body text.

**The Exit Yellow Is Not A Line Rule.** Yellow means "look here": focus, the flag, the branch, 相加. No category may take yellow or a near-yellow. This is why SP is grey (#8e959c) with dark ink.

**The Paired Ink Rule.** Every line colour comes with its own ink (white or #1b1b1b / #111111), chosen so it reads on that colour. Never assume white text on a line colour.

## Typography

**Display Font:** Noto Sans TC (with PingFang HK, Microsoft JhengHei, sans-serif), weights 400/500/700/900
**Body Font:** Noto Sans TC for Chinese; Source Sans 3 (with Noto Sans TC) for English, numerals and codes, weights 400/600/700
Both load from Google Fonts.

**Character:** Heavy 黑體 Chinese does the work of the sign's main line. A lighter humanist Latin sits under it as the translation. All numbers, 番 values and line codes use Source Sans 3 with tabular lining figures, so the plates line up down the column.

### Hierarchy
- **Display** (900, clamp(1.6rem → 2.5rem), 1.1, +0.02em): Header sign title only. A 700-weight suffix at 0.55em in secondary ink.
- **Headline** (900, clamp(1.35rem → 1.75rem), 1.15, +0.02em): Line signboard titles. Rules-section heads use the same weight at clamp(1.3rem → 1.6rem).
- **Title** (700, 1.08rem, 1.3): Stop (item) names. Flow steps are 1.02rem and notice heads 1.1rem at the same weight.
- **Body** (400, 0.93rem, 1.55): Chinese descriptions, capped at 62–66ch.
- **Body EN** (400, 0.84rem): English descriptions in tertiary ink, capped at 70ch, always a block line under the Chinese.
- **Label EN** (600, 0.85–0.98rem, 1.2): English names beside or under Chinese headings.
- **Numeral** (700, 1.55rem, 1, −0.01em, tabular): 番 values on plates. Formula values drop to 1.05rem, and the plate shrinks to 1.3rem at ≤480px.
- **Code** (700, 0.62–0.72rem, +0.04em): Line codes in dots and roundels, and item codes under each stop.

### Named Rules
**The Chinese Leads Rule.** In every bilingual pair the Chinese comes first, at the heavier weight and in the stronger ink. English sits on its own line or to the right, one ink step lighter and smaller. English never gets larger or bolder than the Chinese it translates.

**The Plate Numeral Rule.** Anything countable (番, codes, tile faces, costs) is set in Source Sans 3 with tabular lining numerals.

## Layout

A single centred shell (max 1200px, gutter `clamp(16px, 4vw, 40px)`). The rules page narrows to 880px. The spacing rhythm follows the frontmatter scale: 36px above each line, 12px vertical padding per stop, 48–56px between rules sections.

- **Phone and tablet (<1024px):** The strip map is a sticky bar across the top: translucent ground at 92% with a 10px backdrop blur and a hairline bottom rule. It holds 11 stations spaced evenly on a horizontal 4px track. Each station is a 26px coded dot in a hit area at least 30px wide and 44px tall. The station names are hidden, and a live line under the track names the current line in Chinese and English. The scroller auto-centres the active station.
- **≥1024px:** The layout becomes a two-column grid (250px sidebar + fluid content, 48px gap). The strip turns into a vertical sidebar, sticky at 24px, with a heading (番種路線 Lines), a vertical track, 30px dots, and each station's Chinese name over its English name. Hovering a station fills it with plain plate.
- **Stop rows:** A three-column grid: 48px dot column on the track, fluid body, right-aligned 番 plate. At ≤480px the dot column shrinks to 36px and the plate to 54px min, and the item count is hidden.
- **Rules page:** Fact rows are a 7.5em label and fluid value, collapsing to one column at ≤560px. Readings and payment cards auto-fit at 260px / 240px minimums.
- Scroll padding is 96px and stop scroll margin 110px, so jumps land below the sticky strip.

## Elevation & Depth

This is a flat enamel system. Depth comes from inversion and hairlines, not shadow. There is one ambient shadow, and it is kept for the two freestanding cards on the rules page (the notice and the worked example). Station dots and the train ring use a solid ground-colour halo (`0 0 0 3px` / `0 0 0 2px` in the ground colour) to cut them out of the track. That halo is a knockout, not elevation.

### Shadow Vocabulary
- **Notice lift** (`box-shadow: 0 1px 2px rgba(20,20,18,0.06), 0 6px 18px -8px rgba(20,20,18,0.18)`; night `0 1px 2px rgba(0,0,0,0.4), 0 8px 22px -10px rgba(0,0,0,0.7)`): Only for the notice card and the 雙食 worked-example card.

### Named Rules
**The Invert, Don't Lift Rule.** To give something more weight, invert it to a black plate (a light plate at night). Don't add a shadow. Limit 番, notice heads, the active direction plate, the 雙食 total and the 不同計 tag all do this.

## Shapes

Round is the transit vocabulary: circles for roundels, station dots, stop dots, flow numbers and the train ring. Pills are for chips and relation tags. The small rectangular pieces use modest radii: plates 6px, tiles 5px, tokens and examples 4px, controls 8px, cards 10px, the flag 3px. Lines are 4px tracks with 2px rounded ends. The line bar is 8px with 4px ends. Structural frames are 2px black (direction plates, section-head underlines, table heads), and dividers are 1px rule grey.

## Components

### Direction Plates (view switch)
Sign plates, not tabs.
- **Shape:** One segmented group, 2px black frame, 8px radius, internal 2px black dividers. Each plate is at least 108px wide.
- **Content:** Chinese label at 700 1rem, over a 0.75rem 600 English line in tertiary ink.
- **Active (`aria-pressed`):** Inverted to plate colours; the English drops to 0.75 opacity.
- **Hover (inactive):** Plain plate fill, 0.2s colour transition.

### Theme Button
- 44×44px square, 8px radius, 2px rule-grey border that turns black on hover. It holds a 20px stroked inline SVG (sun / moon).

### Strip Map and Train (signature)
- **Stations:** Coded circular dots in the line colour with paired ink and a 3px ground halo. 26px on phones, 30px on the sidebar.
- **Track:** 4px rule-grey, horizontal on phones, vertical on the sidebar.
- **Train:** A hollow ring (3px ink border, 2px ground halo), 34px on phones and 40px on the sidebar. It is centred on the active dot and slides there with `transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)`. It follows scrolling, web-font load and resizes. This is the only signature motion.
- **上次 flag:** A small exit-yellow tag (0.6rem 700) above the last-visited station on phones and to its right on the sidebar. It shows only when that line isn't active.

### Line Signboard
- An 8px line bar, then a head row: a 48px roundel with the line code, a 900-weight Chinese title over a 600 English name, and a right-aligned item count in tertiary ink.

### Stop Row
- A hollow 16px stop dot (4px line-colour ring on ground) sits on the line's 4px track. Name row: Chinese 700 + English 600 tertiary. Then the Chinese description, English description, an optional plain-plate example, and the item code. Rows are separated by 1px rules.
- **Jump target:** Background flashes 9% ink for 1.8s and the dot pulses to 1.6× twice (0.9s).

### 番 Plate
- Plain plate, 6px radius, min 64px. Tabular 1.55rem numeral over a 0.68rem 700 "番" at 0.7 opacity.
- **Limit (≥40番):** Inverted to the plate colours. This is the only plate that inverts.

### Item Chip
- A pill with a panel background and 1px rule border, 700 0.92rem. It leads with a line-coloured code pill (0.7rem, paired ink). On hover the border turns ink. The chip links to the stop in the table.

### Relation Tags
A typed pill vocabulary for 不重複計算, with a 2px border at 700 0.85rem:
- **包含** (contains): outline only, ink border.
- **取最高** (take highest): plain-plate fill.
- **不同計** (not together): plate fill, inverted.
- **相加** (add): exit-yellow fill.

### Calculation Flow
- A 4px ink track with 38px hollow numbered circles (4px ink ring on ground). The 雙食 branch step fills exit yellow.

### Notice Card
- Panel background, 10px radius, the single ambient shadow. An inverted head bar with Chinese title and English at 0.75 opacity, over definition rows split by 1px rules. Formulas are built from plain-plate tokens with tertiary operators.

## Do's and Don'ts

### Do:
- **Do** give every new category a line colour, a paired ink and a two-letter code, and use the colour only for its bar, roundel, dots, track and code pill.
- **Do** set every bilingual pair Chinese first (heavier, darker) with English below or beside it in Source Sans 3, one ink step lighter.
- **Do** put 番 values on plates with tabular numerals. Invert the plate when the value is ≥40番.
- **Do** use exit yellow (#f5c400) only for focus, selection, the 上次 flag, the 雙食 branch and the 相加 tag.
- **Do** keep the focus ring a 3px exit-yellow outline at 2px offset on every interactive element.
- **Do** keep phone strip hit areas at least 44px tall with 26px dots, and switch the strip to a vertical sidebar at 1024px.
- **Do** show weight by inverting, not with shadow. Keep the ambient shadow for the notice and worked-example cards.
- **Do** honour `prefers-reduced-motion`: transitions and animations collapse, and smooth scrolling turns off.

### Don't:
- **Don't** give any category yellow or a near-yellow line colour. Yellow is the signal, not a line.
- **Don't** fill sections, cards or headers with a line colour, and don't set body text in one.
- **Don't** put white text on a line colour without checking its paired ink.
- **Don't** add a second signature motion beside the train. Other motion stays at 0.2–0.35s colour or transform transitions.
- **Don't** reintroduce green felt, gradient headers or a card-table stack. The thesis rejects the casino look.
- **Don't** let English outrank Chinese in size, weight or ink.
