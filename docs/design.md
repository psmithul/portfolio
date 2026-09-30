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

The opening uses two supplied portraits in an overlapping composition. The main subject is `public/images/mithul-cutout.webp`, edited from the courtyard photograph with its background removed. The secondary café image is a WebP encoding of the supplied PNG, with no face generation or retouching. Preserve the cutout's alpha channel. The short lower-edge fade avoids an abrupt clothing crop. See `docs/assets.md` for provenance.

This is a photographic portrait with layered spatial motion, not a photogrammetric mesh or a rigged avatar.

## Motion

The opening follows native scrolling: a centered two-level headline, overlapping portraits moving at different rates, and a centered introduction. Work-history cards fan above a 3D folder as the section enters the viewport. Updates run on a scheduled animation frame only after scrolling or resizing. Reduced-motion preferences remove movement; content remains readable without JavaScript. The page does not intercept wheel events or pin the reader in a scene.

The page follows the supplied https://nehayadav.framer.website/ composition: quiet right-aligned navigation, a centered opening, a portrait transition and introduction, three project stories, one side-project feature, a wide visual gallery, work history, tool cards, and a large contact ending. Mika’s Life remains before contact. Earlier projects sit in a native disclosure under the side-project feature. Text sits under the main project images, with a narrow year column and compact tags. Tanker and Space Grotesk are the reference's actual typefaces; licensed copies are hosted locally. The light Wada palette and personal content are retained.

The tensegrity and reaction-wheel projects use existing, verified CAD screenshots or renders with captions identifying their scope. At the user’s request, the other nine projects now use temporary subject illustrations made from the Wada palette. They are marked as project illustrations in the visual and caption, rather than presented as actual CAD or hardware. Replace each `illustration(...)` entry in `content/projects.ts` with verified imagery when it is available. The visual gallery continues to use four views from the verified CAD packages. Generic interactive project models remain removed.

## Identity

There is no header logo or wordmark. The name appears in the introduction and footer. Navigation stays in one readable row on phones. The small favicon is retained; the journal's decorative m. symbol has been removed.
