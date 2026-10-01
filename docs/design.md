# Portfolio design notes

## Current brief

The 30 September reference recording and the accompanying personal brief define the current direction: warm paper, industrial materials, large editorial type, a supplied photographic portrait, and motion that follows normal scrolling. The previous exact Wada combination 321 is superseded by the explicit muted palette in that brief. This is a Wada-inspired harmony, not a claim that these HEX values reproduce a numbered combination from the book.

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

The main portrait remains the supplied courtyard photograph with its background removed. It is not a generated face, scanned model, or rigged avatar. A warm ochre paper note replaces the second hero image and carries the exact supplied quote: “Satisfaction of one's curiosity is one of the greatest sources of happiness in life”. The portrait and note move at slightly different rates. The phone layout separates the portrait caption and note so they stay readable. The opening leads with the approved lines “Hi, I’m Mithul. I like understanding things deeply and building with what I learn.” Its supporting copy describes a final-year NITK student who wants to understand ideas deeply: their origins, reasoning, and development. It names current design work on rough-terrain robots and a tensegrity joint. No childhood biography or other people's career claims are added. The 1 October correction replaces flat illustrations with actual Three.js geometry: a CubeSat with deployed solar panels, a mechanically assembled six-wheel rover, and an axisymmetric rocket with four fins and an open engine bell. Rapier advances three massive rigid bodies at a fixed 120 Hz. Bounded scroll forces, translational springs, quaternion torsional springs, and damping create movement within reserved space. Motion pauses offscreen, in hidden tabs, and for reduced motion. These are decorative generic models, not scans of Mithul’s prototypes. Earlier generated component manifests are historical provenance only.

The three ongoing projects use compact headers above one unobstructed image per cover, following the supplied 30 September screenshots. The year, full date, and Ongoing label sit beside the title on desktop. Rounded tags and a short description stay together beneath the title, with a right-facing arrow at the far edge. Phones place the date row above the title and keep the arrow beside it. Completed carousel cards also place their information above their images. Layered cover labels and annotations have been removed; images fill their frames with cover sizing and retain their natural colours. Extra CAD views are placed in their relevant case studies, addressing the user's correction about the redundant homepage CAD gallery. External photographs carry reference labels and credits on their case studies. No invented plots, test results, lab photographs, or prototype images are shown.

## Scroll and cursor

The homepage follows the résumé: three ongoing projects, then a seven-item Completed projects carousel. Completed projects retain the shared `ScrollRail`: normal vertical scrolling moves the cards horizontally on large, sufficiently tall screens, then releases to the page. Phones and short viewports use native horizontal scrolling and snap, with 44-pixel arrow controls.

The Home and Projects navigation links explicitly scroll to their section when already on the homepage, including when the current hash is clicked again. Hash changes use the browser history API. Links from other pages retain Next.js client navigation. The header contains only navigation; the Mithul Sourav name mark has been removed at the user's request.

Five internship and leadership cards burst out of the toolbox, and two certificate-style accolade cards emerge from the folder. `ArchiveReveal` contains no carousel state, horizontal scrolling, navigation buttons, or swipe instructions. At widths of at least 1280 pixels, the experience cards settle along a circular arc, with matching sizes, consistent internal spacing, and only one or two degrees of tilt. A 750-millisecond burst uses short staggered delays and a restrained overshoot. The stage holds briefly when it fits the viewport; shorter desktop screens scroll through the complete arc naturally. The accolade fan retains its 1580-pixel width and 960-pixel height threshold. Scrolling back above the trigger collapses the fan; keyboard focus reveals every card immediately. Narrower screens use a two-column or single-column vertical grid whose cards pop into place on entry. Reduced motion and no JavaScript use the complete readable static grid. The toolbox and folder are native SVG illustrations in the portfolio palette, replacing generated decorative images. All source facts remain the same five roles and two verified team achievements.

The 1 October archive refinement gives the native toolbox illustration a recessed indigo lining, folded metal panels, hinges, and silver catches. The folder uses ochre card stock with ivory paper edges and a shaded pocket. Both stay within the existing palette, with thin edges and soft contact shadows. Experience cards use a lighter ivory surface, ink headings, blue details, and a ruled separator; their desktop fan height is 460 pixels. Certificate results and titles use Tanker to match the other home sections, with a fine inner rule rather than a gold frame. The scroll triggers, semicircular fan, keyboard reveal, and reduced-motion grid are unchanged.

The custom cursor stays limited to fine pointers and disappears on keyboard use, forms, pointer exit, and other routes. Project hover shows a compact 132-by-38-pixel “Understand more” pill with 16-pixel type and a small arrow. Its position is clamped inside the viewport. Each whole project card remains a single link for keyboard and touch.

Tools follows the supplied logo-carousel screenshot: a large centred heading, broad rounded cards, and a continuous row with partial cards at both edges. The original six software marks keep their colours and proportions against the light paper background. Two equally sized groups form a seamless 52-second loop; the duplicate is hidden from assistive technology. Fine-pointer hover pauses the row, and a 44-pixel Pause/Resume button provides keyboard control. Reduced motion removes the animation and duplicate, leaving a native horizontal list with snap points. Vertical page scrolling remains native.

## Professional content

Ten project records remain after the two knee projects were combined, plus a case study for the verified Vayu Aerospace internship. Featured studies distinguish design-stage work, simulation, reference CAD, and hardware evaluation. ISTE NITK Secretary and NH66 Fund Manager details come from the supplied research CV. The writing desk, database, authorization, and published journal remain part of the same application.

## Mobile and copy refinements

Phone headers use one stable 72-pixel navigation row after scrolling, with at least 44-pixel touch targets. The portrait and quote note use a grid with readable captions. Dates and touch controls follow the résumé, including the completed reaction-wheel study’s August–October 2026 period. The opening name and tagline have separate responsive font sizes, so the approved wording stays readable without colliding with the description. No hardware photography has been fabricated.

The opening leads with Mithul’s name and plain first-person copy about building and asking questions, replacing the oversized discipline label. The 3D display uses a transparent canvas across the hero, below the heading, description, and links in the layer order. A reserved layout cell keeps its starting positions in the open space beside the copy, or below it on phones. Scrolling advances a satellite orbit and turn, moves the rover along its heading, and raises the rocket. Rover wheel rotation is calculated from the rigid body's actual travel and wheel radius. Rapier springs track these target poses instead of teleporting the models. The supplied portrait and exact favourite quote remain.

Every completed-project preview, including the CAD preview, uses cover sizing to fill its frame. Ten externally sourced photographs replace the temporary generated/project-subject illustrations. Each is explicitly captioned as a reference, with creator and license details on the case page. The reaction-wheel cover retains verified native project reference CAD. Source links, licenses and file hashes are recorded in `project-photo-assets.json`. Main covers use natural photo colours; photographs fill their containers with cover sizing and no inset or letterbox frame.

The September 30 updated CV combines the former NeoLeg and KneeAssist entries as Actuated Knee Assistance System, October 2025–September 2026. The listing now contains one combined knee card. Its case study separates passive mechanism development, actuation, procurement readiness, and planned bench verification. The old NeoLeg URL permanently redirects to the combined study.
