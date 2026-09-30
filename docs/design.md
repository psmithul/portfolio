# Portfolio design notes

## Palette

Source: Sanzo Wada, A Dictionary of Color Combinations, combination 321, verified at https://sanzo-wada.dmbk.io/combination/321 and against the supplied palette PDF. The website collection supplies the screen HEX values.

| Swatch           | HEX     | Use                                       |
| ---------------- | ------- | ----------------------------------------- |
| Deep Slate Olive | #172713 | Main text, buttons, structure             |
| Sulpher Yellow   | #f5f5b8 | Pale reading surfaces and button text     |
| Salvia Blue      | #96bfe6 | Quiet status surfaces and reading accents |
| Light Brown Drab | #b08699 | Large hero emphasis                       |

Body text uses olive or an accessible olive/white mixture. Small accents use a darker olive/drab mixture. Exact dusty rose is reserved for large type and surfaces: it has 3.13:1 contrast on white, while olive on the dusty rose surface has 5.03:1. Olive on yellow has 13.95:1 and on blue 8.15:1. White tints are explicit CSS color mixtures of the selected swatches, not additional unrelated hues.

## Portrait

The hero uses `public/images/mithul-cutout.webp`, a transparent portrait edited from the supplied `Candid Courtyard Portrait in Black 2.PNG`. The courtyard and framing have been removed. The edit brief prioritizes the source likeness, glasses, hair, expression, pose, and black outfit. No anime reconstruction is used. Keep the RGBA transparency when changing formats. A short fade at the crop's lower edge avoids an abrupt clothing edge. See `docs/assets.md` for the exact edit prompt and source provenance.

This is a photographic portrait with layered spatial motion, not a photogrammetric mesh or a rigged avatar.

## Motion

The opening follows native vertical scrolling: centered headline, an isolated portrait with gentle depth movement, then a centered personal introduction. There is no surrounding card, background scene, scroll hijacking, custom cursor, particle decoration, autoplay character motion, or hero workbench toolbar. Updates run on a scheduled animation frame only when scrolling or resizing occurs. Reduced-motion preferences remove movement. Without JavaScript, the introduction and portrait remain readable.

The page flow follows the supplied https://nehayadav.framer.website/ reference: centered statement, personal portrait and introduction, full-width selected projects, smaller builds, a visual gallery, experience, tools, and a large contact ending. Mika’s Life remains between the tools and contact sections. Barlow Condensed provides the bold heading rhythm; Manrope carries reading text. The light Wada palette and engineering content remain the user's own.

The tensegrity and reaction-wheel projects use existing, verified CAD screenshots or renders with captions identifying their scope. Projects without verified assets use their title, contribution, and factual project details. The visual gallery uses four views from these same verified CAD packages. There are no substitute illustrations, stock robots, image placeholders, or generic interactive models on any project page.

## Identity

Use a plain name wordmark: Mithul Sourav, with a small mechanical engineering and robotics caption. The favicon is a single vector M with no font dependency or decorative dot. Keep the name visible on phones; navigation occupies a separate row when needed.
