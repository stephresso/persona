# Persona design system

How every screen should feel: warm bakery-collage energy (Baristi), cream canvas, burgundy ink, soft stickers, Morphin-style motion. Use this before inventing new UI.

## Source of truth

| What | Where |
|------|--------|
| Tokens (color, type, space, radius) | `constants/theme.ts`, `constants/fonts.ts` |
| Stickers (Vecteezy hippie set) | `assets/stickers/`, `components/Sticker.tsx` |
| Soft scallop badge | `components/Shapes.tsx` → `WavyBadge` |
| Floating sticker motion | `components/FloatingSticker.tsx` |
| Primary CTA | `components/PrimaryButton.tsx` |
| Glass tabs | `components/GlassTabBar.tsx` |
| Baristi visual refs | `assets/framer-baristi/` + [Framer project](https://framer.com/projects/Baristi-copy--u9KiaSse4VqyjyB3Q0h6-3lLUE?node=cJvED4Rj3) |
| Motion reference | [Morphin — Animated Text Hero](https://morphin.dev/components/animated-text-hero-section-motion-react) |

Exported Baristi styles live in `assets/framer-baristi/styles.json` (cream `#F9F1DD`, title brown → we map to burgundy `#6B2438`, pastel Blue/Pink/Orange/Yellow/Green/Violet).

## Palette

- **Canvas:** `#F9F1DD` (cream). Soft alt: `#E8DFC8`.
- **Ink:** `#6B2438` burgundy for wordmark, heroes, solid CTAs. Soft ink: `rgba(107,36,56,0.72)`.
- **Stickers (unisex vivid):** coral `#F47B5A`, mustard `#F5D24A`, sage `#B5D96A`, sky `#6BB8F0`, lilac `#A894F0`, peach `#FFB088`.
- **Avoid:** neon, muddy earth, purple-gradient AI defaults, chocolate-brown ink, flat white-only chrome.

## Typography

From [Baristi](https://framer.com/projects/Baristi-copy--u9KiaSse4VqyjyB3Q0h6-3lLUE?node=cJvED4Rj3) / `assets/framer-baristi/styles.json`:

- **Display:** Boldonse — uppercase heroes / labels.
- **Body / UI:** Manrope Medium / SemiBold — subcopy, buttons, tabs.
- **Leading (use `FONT.leading` / `displayLineHeight()`):**
  - Stacked heroes → **130%** (`tight`, Framer Heading 4)
  - Big display → **135%** (`display`, Heading 2)
  - Smaller Boldonse → **140–150%**
- Boldonse’s shipped `hhea`/`OS/2` metrics were oversized (ascent 1520 on UPM 1000) and clipped at Framer leading — patched in `assets/fonts/Boldonse-Regular.ttf`. Don’t reintroduce fat per-line padding.
- Stack heroes as short lines (“What are / you meant / to do?”).
- Tokens: `FONT.size.hero` = 40 (Heading 5).

## Shape language

From Baristi’s “OUR MENU” / “OUR STATS” badges and food stickers:

| Do | Don’t |
|----|--------|
| Soft cloud-scallop ovals (~8–12 large round lobes) | Postage-stamp circle-union edges |
| Organic sticker silhouettes (scallop, arch, flower, star…) | Plain circles, hex slabs, sharp rectangles |
| Real padding inside badges (≈22–26px x, 14–16px y) | Text kissing the scallop edge |
| One vivid fill per sticker | Multi-stop neon gradients on shapes |

`WavyBadge` is the only label badge. If it looks “busy,” reduce lobe count or deepen padding — don’t add more tiny scallops.

## Composition

Baristi presents one idea per viewport: big type, one badge, one CTA, stickers as garnish.

1. **Wordmark** top-left (`PERSONA`) — brand-first.
2. **Eyebrow badge** (optional) — soft sky scallop, sits *above* the title with gap.
3. **Hero type** — burgundy Boldonse, stacked lines.
4. **Stickers** — frame the block (e.g. arch top-right, scallop bottom-left). **Never cover letterforms.**
5. **Subcopy** — Manrope, max ~280px width.
6. **CTA** — chunky hug pill under subcopy; no icon/arrow.
7. **Glass tab bar** — Home / Careers / You.

Background washes (if any) are large `faceLess` stickers at low opacity — not a second hero graphic.

## Motion (Morphin-style)

Match [Morphin’s hero](https://morphin.dev/components/animated-text-hero-section-motion-react): spring entrances + gentle idle life.

- Title lines: staggered `FadeInDown` / spring (≈80–100ms apart).
- Badge: slight scale + settle rotate.
- Stickers: spring in from below, then loop soft translateY + tilt (`FloatingSticker`).
- Cap at 2–3 intentional motions per screen. No continuous chaos.

Requires `react-native-reanimated` and the babel plugin (`babel.config.js`).

## Components checklist

- [ ] Tokens from `theme.ts` only — no one-off hex in screens
- [ ] Badge = `WavyBadge`, not a custom View border
- [ ] Stickers = `Sticker` / `FloatingSticker`, not emoji or SF Symbols as decoration
- [ ] CTA = `PrimaryButton` with `hug` on marketing surfaces
- [ ] Tabs = glass custom tab bar
- [ ] Unique sticker shape + color vs other tabs/screens
- [ ] Entrance + float motion on collage heroes

## Screen roles

| Screen | Accent idea |
|--------|-------------|
| Home | Sky badge, coral scallop + mustard arch framing title |
| Careers | Different sticker + accent (e.g. sage / lilac) |
| You | Softer peach / cream stickers, personal tone |
| Quiz / Results | Keep ink + cream; accents per question/result, still unisex |

## Color pairs (cards ↔ characters)

Characters on pastel cards must **never** share the card fill. Use `characterTintForCard()` / `CARD_CHARACTER_PAIR`:

| Card | Character |
|------|-----------|
| sky | lilac |
| sage | peach |
| mustard | coral |
| lilac | mustard |
| coral | sky |
| peach | sage |

## Skills

Every career skill string in `data/careers.json` needs a short definition in `constants/skills.ts` (`SKILL_DEFS`). Career details show name + definition — not bare chips.

## Anti-patterns we already rejected

- Orange/coral sticker parked on top of “YOU” / hero letters
- Dense scallop stamp with dozens of tiny lobes
- Full-bleed CTA with arrow icon
- Chocolate ink + dull muddy stickers
- Neon washes / purple gradient chrome
- Dashboard-y first viewport (stats strips, chip rows, cards in hero)
