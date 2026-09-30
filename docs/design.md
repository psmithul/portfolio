# Portfolio design notes

## Palette

Source: Sanzo Wada, A Dictionary of Color Combinations, combination 321, verified at https://sanzo-wada.dmbk.io/combination/321 and against the supplied palette PDF. The website collection supplies the screen HEX values.

| Swatch           | HEX     | Use                                               |
| ---------------- | ------- | ------------------------------------------------- |
| Deep Slate Olive | #172713 | Main text, buttons, structure                     |
| Sulpher Yellow   | #f5f5b8 | Rover art, pale reading surfaces, button text     |
| Salvia Blue      | #96bfe6 | Portrait frame, tensegrity art, satellite surface |
| Light Brown Drab | #b08699 | Large hero emphasis, knee art, fine outline       |

Body text uses olive or an accessible olive/white mixture. Small accents use a darker olive/drab mixture. Exact dusty rose is reserved for large type and surfaces: it has 3.13:1 contrast on white, while olive on the dusty rose surface has 5.03:1. Olive on yellow has 13.95:1 and on blue 8.15:1. White tints are explicit CSS color mixtures of the selected swatches, not additional unrelated hues.

## Portrait

Use the supplied `Candid Courtyard Portrait in Black 2.PNG`. The website asset is `public/images/mithul-courtyard.webp`. Preserve the photograph's identity, expression, pose, and clothing. Do not replace it with a reconstructed face. The generated character was rejected by Mithul for inaccurate likeness and is not shipped. Image encoding and CSS framing are the only transformations.

This is a photographic portrait with layered spatial motion, not a photogrammetric mesh or a rigged avatar.

## Motion

The opening's sticky composition follows native vertical scrolling. The photo, solid frame, and outline move at different depths; the introductory copy gives way to current research questions. There is no scroll hijacking, custom cursor, particle decoration, autoplay character motion, or hero workbench toolbar. Updates run on a scheduled animation frame only when scrolling or resizing occurs. Reduced-motion preferences remove the pinned journey and movement. Without JavaScript, the introduction and portrait remain readable.

The four featured projects form an asymmetric gallery with alternating visual sizes and vertical offsets. On phones, they return to one column. Gallery artwork has a small scroll-driven depth movement inside its reserved area. Project pages retain clearly described conceptual engineering viewers; these are illustrations, not the user's CAD or measured results.
