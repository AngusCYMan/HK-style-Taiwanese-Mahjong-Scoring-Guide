# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
A regular group of friends who play 17-tile HK-style Taiwan mahjong (台灣麻雀・港式). They use the guide in two equal situations: mid-game on a phone, looking up a 番 quickly while a win is being scored, and at home, reading the rules through before playing.

## Product Purpose
It is the group's agreed house-rule sheet: every scoring item (番), its value, what counts and what doesn't, and the calculation flow. Success means a 食糊 can be scored correctly and without arguments, and any dispute gets settled by pointing at this page.

## Positioning
It records one specific group's house rules, not a generic mahjong table. The values and overlap rules are what the group agreed, even where other tables disagree.

## Operating Context
- Checked at the mahjong table, usually one-handed on a phone, often in the middle of a round.
- Read at leisure before games, sometimes by newer players learning the scoring.
- Money settlement (底注, 每番金額, 拉注, 即時付款) happens at the table using the rules page.

## Capabilities and Constraints
- Two views: 番數一覽 (the full 番 table, grouped by category) and 規則流程 (rules, calculation flow, 不重複計算, 雙食, economy, instant payments).
- Data lives in `constants.tsx`; the user confirmed the 番 values are correct and must not change.
- A static Vite + React build, deployed to GitHub Pages.
- Light and dark modes.
- It is a reference only; there is no hand calculator (the user chose "fix the guide", not a calculator).

## Brand Commitments
- Bilingual: Traditional Chinese (Cantonese usage) first, English as a secondary line.
- Name: 台灣麻雀（港式）/ 港式台灣麻雀番數表.

## Evidence on Hand
- Full 番 dataset in `constants.tsx`; rule copy in `components/RulesPage.tsx`.
- No imagery, logos, or tile artwork assets exist.

## Product Principles
1. The rule is the authority: every value and exclusion must be unambiguous.
2. Fast lookup beats decoration: finding a 番 mid-game should take seconds.
3. Chinese first; English supports, never competes.
4. Never change a house value without the group's say.
