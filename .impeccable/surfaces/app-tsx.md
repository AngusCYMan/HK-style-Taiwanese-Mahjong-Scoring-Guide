---
version: 1
slug: "app-tsx"
primary_target: "App.tsx"
related_targets: ["components/ScoringTable.tsx","components/RulesPage.tsx"]
---

# Surface: 番數表 + 規則流程 (App.tsx, single page app)

Mode: Read (lookup-heavy reference; mid-game phone lookups and at-home reading, equally).
Audience/job: the group checks a 番 or an overlap rule while scoring a 食糊; newer players read the flow.
Constraints: full table stays visible on one scroll; jump-to-category is the main wayfinding; no decoration that slows scanning; no casino look; 中文 first, English second; light + dark; 番 values never change.

## Direction contract

THESIS: The house rules as a transit system. Each category is a coloured line, each 番 a stop reachable in one tap. It refuses the gradient-header card-table stack and the green-felt casino look.

OWN-WORLD: Enamel sign white (#f4f4f1) and platform black, with bold Noto Sans TC 黑體 over Source Sans 3 English. Eleven line colours mark categories only (line bar, roundel, station dot) and never fill whole areas. 番 values sit on number plates. Limit hands (≥40) invert to a black plate with a light number. Dark mode is a night platform: black enamel with the same line colours.

STORY: The reader sees every line at once, taps a line, lands on its signboard, and reads name, English and 番 in one sweep. On the rules page, typed relation chips (包含 / 不同計 / 相加) link each rule to the item codes it names.

FIRST VIEWPORT: A white header sign with the title, and 番數一覽 / 規則流程 as direction plates. Below it, a sticky strip map with 11 stations on a line track (a horizontal scroller on phones). Then the first line's signboard: a line bar, a roundel code, the bilingual heading, and rows each ending in a right-aligned 番 plate.

FORM: MTR bilingual line signage, #4 on my ordered list; seed key d0523377. Raises: stable item codes linked from rules (patent), inverted limit plates (depot blind), a remembered last line flagged on the map (cutting bench), and typed rule relations (provenance). Signature interaction: a "train" marker that slides along the strip map to the section in view.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
