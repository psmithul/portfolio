# Portfolio design notes

## Current brief

The 30 September reference recording and the accompanying personal brief define the current direction: warm paper, industrial materials, large editorial type, four tactile mechanical cutouts, and motion that follows normal scrolling. The previous exact Wada combination 321 is superseded by the explicit muted palette in that brief. This is a Wada-inspired harmony, not a claim that these HEX values reproduce a numbered combination from the book.

| Role                     | Colour        | HEX     |
| ------------------------ | ------------- | ------- |
| Main background          | Warm ivory    | #F4F0E6 |
| Secondary surface        | Paper         | #E9E3D7 |
| Text                     | Sumi charcoal | #24231F |
| Secondary text           | Warm grey     | #5E5A52 |
| Main accent              | Muted indigo  | #334E68 |
| Rover / small accents    | Ochre         | #C59A4A |
| Mechanism study          | Celadon       | #98A886 |
| UAV study                | Dusty blue    | #8296A5 |
| Small typographic accent | Vermilion     | #C45A3D |

Body copy uses charcoal and warm grey. Accent colours are confined to large type, decorative objects, and individual project surfaces. Tanker and Space Grotesk retain the reference's typographic rhythm; Fraunces remains in the journal.

## Opening and imagery

The main portrait remains the supplied courtyard photograph with its background removed. It is not a generated face, scanned model, or rigged avatar. A paper-based tensegrity CAD study replaces the second portrait. The two move at slightly different rates. Four transparent mechanical components frame the headline with pointer movement bounded to six pixels in either direction. They are generic decorative assets, never project evidence. Exact generation prompts and file paths are in `mechanical-hero-assets.json`; asset provenance is in `assets.md`.

The three ongoing projects use one unobstructed image per cover. Full dates and Ongoing labels sit beneath each image. Layered cover labels and annotations have been removed; images use contain sizing and their original colors. Extra CAD views are placed in their relevant case studies, addressing the user's correction about the redundant homepage CAD gallery. Project illustrations have transparent backgrounds, a restrained accent, and clear illustration labels. No invented plots, test results, lab photographs, or prototype images are shown.

## Scroll and cursor

The homepage follows the résumé: three ongoing projects, then an eight-item Completed projects carousel. Vayu Aerospace appears in a separate six-item experience and leadership carousel rather than the project list. Both rails use the shared `ScrollRail` component with a sticky viewport and measured travel distance on large, sufficiently tall desktop screens. Ordinary vertical page scrolling translates the rail horizontally. No wheel events are prevented. The final card reaches the starting inset, then the section releases to normal page scrolling. Keyboard focus scrolls the corresponding card into view. Touch layouts use native horizontal scrolling and snap, with a partial next card visible on phones. Both rails provide 44-pixel previous/next buttons with disabled end states. Experience is framed by an open mechanic’s toolbox, replacing the file-folder visual; its prompt and provenance are in `experience-toolbox-asset.json`. Short desktop viewports use the native rail so content is never clipped.

Reduced motion disables the pinned rail, custom cursor, parallax, and reveals. Content remains readable without JavaScript through the native carousel fallback. The custom cursor is limited to fine pointers on the homepage and disappears on keyboard use, forms, pointer exit, and other routes.

## Professional content

All original eleven projects remain, with a twelfth case study for the verified Vayu Aerospace internship. Featured studies distinguish design-stage work, simulation, reference CAD, and hardware evaluation. ISTE NITK Secretary and NH66 Fund Manager details come from the supplied research CV. The writing desk, database, authorization, and published journal remain part of the same application.

## Mobile and copy refinements

The hero introduces Mechanical engineering & robotics directly, with a factual student description. Slogan sections and the large working-principle block were removed. Phone headers stay in two stable rows even after scrolling; the inherited flex-wrap bug was corrected. Decorative components stay below the hero description on phones, the portrait pair uses a grid, and captions, dates, and touch controls are readable. Full project dates and classifications follow the provided CV, including the completed reaction-wheel study’s August–October 2026 period. The leaf-robot architecture and UAV mounting comparison are explicit schematics rather than generic vehicle images. No new hardware photography has been fabricated.
