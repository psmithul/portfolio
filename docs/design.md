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

Selected builds use one dominant image per cover. Extra CAD views are placed in their relevant case studies, addressing the user's correction about the redundant homepage CAD gallery. Project illustrations have transparent backgrounds, a restrained accent, and clear illustration labels. No invented plots, test results, lab photographs, or prototype images are shown.

## Scroll and cursor

Four selected projects are followed by eight side quests. Desktop's side-quest rail uses a sticky viewport and measured travel distance. Ordinary vertical page scrolling translates the rail horizontally. No wheel events are prevented. The final card reaches the starting inset, then the section releases into experience. Keyboard focus scrolls the corresponding card into view. Touch layouts use native horizontal scrolling and snap, with approximately 85 percent of a card visible on phones.

Reduced motion disables the pinned rail, custom cursor, parallax, and reveals. Content remains readable without JavaScript through the native carousel fallback. The custom cursor is limited to fine pointers on the homepage and disappears on keyboard use, forms, pointer exit, and other routes.

## Professional content

All original eleven projects remain, with a twelfth case study for the verified Vayu Aerospace internship. Featured studies distinguish design-stage work, simulation, reference CAD, and hardware evaluation. ISTE NITK Secretary and NH66 Fund Manager details come from the supplied research CV. The writing desk, database, authorization, and published journal remain part of the same application.
