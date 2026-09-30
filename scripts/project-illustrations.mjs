import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Temporary subject illustrations, never project documentation or measured results.
const directory = fileURLToPath(
  new URL('../public/images/projects/', import.meta.url),
);
const olive = '#24231f';
const blue = '#8296a5';
const yellow = '#c59a4a';
const drab = '#98a886';
const escapeXml = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const line = (x1, y1, x2, y2, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
const circle = (cx, cy, r, fill = 'white', extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const rect = (x, y, width, height, fill = 'white', extra = '') =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="${fill}" ${extra}/>`;
const wheel = (x, y, r = 58) =>
  `<g>${circle(x, y, r, olive)}${circle(x, y, r - 15, blue)}${circle(x, y, 10, olive)}${[0, 60, 120].map((a) => `<path d="M${x - r + 22} ${y}H${x + r - 22}" transform="rotate(${a} ${x} ${y})" stroke="${olive}" stroke-width="2"/>`).join('')}</g>`;
const spring = (x, y, width, height) =>
  `<path d="M${x} ${y}v12${Array.from({ length: 7 }, () => `l${width} ${height / 16}l-${width} ${height / 16}`).join('')}v12" fill="none" stroke-width="4"/>`;
const pin = (x, y) => `${circle(x, y, 14, yellow)}${circle(x, y, 4, olive)}`;
const leaf = (x, y, angle = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 0C-35-45-14-78 18-100C42-65 42-22 0 0Z" fill="${yellow}"/><path d="M0 0L18-90" fill="none"/></g>`;

const illustrations = {
  'uav-vibration-integration': {
    label: 'UAV HARDWARE / MOUNTING CONCEPT',
    drawing: `<g transform="translate(170 70)">
      <path d="M170 440L395 160L635 460M395 160L715 165" fill="none" stroke-width="22" stroke="${blue}"/>
      ${[
        [170, 440],
        [395, 160],
        [635, 460],
        [715, 165],
      ]
        .map(
          ([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="98" ry="24" fill="none" stroke="${olive}" opacity=".55"/>${circle(x, y, 25, olive)}`,
        )
        .join('')}
      <path d="M305 240L515 225L585 310L340 330Z" fill="${blue}"/>
      <path d="M305 285L515 270L585 355L340 375Z" fill="${drab}"/>
      ${[
        [330, 270],
        [500, 255],
        [555, 320],
        [355, 340],
      ]
        .map(
          ([x, y]) =>
            `<path d="M${x} ${y}v38" stroke-width="13" stroke="${olive}"/>`,
        )
        .join('')}
      <path d="M365 222L445 215L495 267L385 280Z" fill="${yellow}"/>
      ${circle(425, 247, 15, olive)}<path d="M390 300H620L690 380H780" fill="none" stroke-dasharray="7 8" opacity=".5"/>
      <path d="M390 225L290 115H150" fill="none" opacity=".5"/>
    </g>`,
  },
  'adaptive-suspension-rover': {
    label: 'FIELD ROBOTICS',
    drawing: `<g transform="translate(90 75)">
      ${[300, 520, 740].map((x) => wheel(x + 45, 400, 54)).join('')}
      <path d="M245 195L800 195L855 245L800 285H245L205 240Z" fill="${blue}"/>
      <path d="M245 195L800 195L765 158H285Z" fill="${yellow}"/>
      <path d="M800 195L855 245V305L800 265Z" fill="${drab}"/>
      ${[300, 520, 740].map((x) => `<path d="M${x} 275L${x - 35} 325L${x} 435" fill="none" stroke-width="13"/>${spring(x + 20, 276, 17, 86)}${wheel(x, 435)}${pin(x, 275)}`).join('')}
      ${rect(460, 110, 120, 48, 'white')}${line(520, 110, 520, 55)}${circle(520, 48, 14, blue)}
      <path d="M150 500H940" opacity=".25"/><path d="M850 160H950M925 148L950 160L925 172" fill="none" opacity=".5"/>
    </g>`,
  },
  kneeassist: {
    label: 'ASSISTIVE MECHATRONICS',
    drawing: `<g transform="translate(265 50) rotate(-10 300 300)">
      ${rect(192, 60, 150, 195, blue)}${rect(208, 337, 150, 220, blue)}
      ${rect(140, 85, 255, 48, yellow)}${rect(155, 450, 255, 48, yellow)}
      <path d="M210 160V285L295 355V485M332 160V285L370 355V485" fill="none" stroke-width="13"/>
      ${circle(271, 285, 48, 'white')}${circle(271, 285, 24, yellow)}${pin(271, 285)}
      ${rect(415, 105, 108, 108, drab)}${circle(469, 159, 27, 'white')}
      <path d="M469 213V298L370 355" fill="none" stroke-width="4"/>${spring(422, 328, 18, 125)}
      ${rect(247, 237, 48, 24, olive)}${line(390, 100, 560, 100, 'opacity=".3"')}
    </g>`,
  },
  'off-road-leaf-robot': {
    label: 'ROBOT ARCHITECTURE',
    drawing: `<g transform="translate(135 75)">
      ${wheel(355, 445, 63)}${wheel(740, 445, 63)}
      <path d="M320 210H765V410H300Z" fill="${blue}"/><path d="M320 210L390 140H825L765 210Z" fill="${yellow}"/><path d="M765 210L825 140V345L765 410Z" fill="${drab}"/>
      <path d="M175 425L320 320H435V392L305 465Z" fill="${yellow}"/>
      ${circle(210, 442, 48, olive)}${circle(210, 442, 30, blue)}
      ${[0, 45, 90, 135].map((a) => `<path d="M147 442H273" transform="rotate(${a} 210 442)" stroke-width="5"/>`).join('')}
      <path d="M415 210V410M570 210V410" opacity=".3"/>${leaf(105, 445, -30)}${leaf(70, 515, 50)}${leaf(865, 365, 15)}
      <path d="M80 510H910" opacity=".25"/>
    </g>`,
  },
  'neoleg-knee-mechanism': {
    label: 'PASSIVE MECHANISMS',
    drawing: `<g transform="translate(320 40)">
      ${rect(80, 65, 210, 55, blue)}${rect(208, 470, 210, 55, blue)}
      <path d="M135 120L195 285L300 475M235 120L275 285L365 475" fill="none" stroke-width="18"/>
      <path d="M195 285L275 285L365 475L300 475Z" fill="${yellow}"/>
      ${circle(236, 285, 53, 'white')}${pin(236, 285)}${spring(390, 200, 25, 205)}
      <path d="M415 200L230 150M415 428L365 475" fill="none" stroke-width="4"/>
      <path d="M60 270C20 390 80 515 175 550" fill="none" stroke-dasharray="8 9" opacity=".4"/>
      <path d="M168 525L175 550L150 548" fill="none" opacity=".4"/>
    </g>`,
  },
  'uncertainty-aware-navigation': {
    label: 'PLANNING & LOCALIZATION',
    drawing: `<g transform="translate(205 90)">
      ${rect(0, 0, 790, 510, 'white')}
      ${Array.from({ length: 8 }, (_, i) => line(25 + i * 100, 25, 25 + i * 100, 485, 'opacity=".1"')).join('')}
      ${Array.from({ length: 5 }, (_, i) => line(25, 55 + i * 100, 765, 55 + i * 100, 'opacity=".1"')).join('')}
      ${rect(170, 75, 170, 190, drab)}${rect(510, 315, 150, 170, drab)}${rect(425, 40, 255, 120, yellow)}
      <path d="M75 410H395V230H725V65" fill="none" stroke="${blue}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="395" cy="285" rx="62" ry="85" fill="${blue}" fill-opacity=".15" stroke-dasharray="7 7"/>
      ${circle(395, 285, 29, blue)}<path d="M383 293L395 270L407 293Z" fill="${olive}"/>
      ${circle(75, 410, 13, olive)}${circle(725, 65, 18, yellow)}
    </g>`,
  },
  'four-bar-door-mechanism': {
    label: 'KINEMATICS',
    drawing: `<g transform="translate(175 40)">
      <path d="M540 75H755V560H540Z" fill="${blue}"/><path d="M540 75L470 125V600L540 560Z" fill="${yellow}"/>
      <path d="M190 475H645" stroke-width="12" stroke-linecap="round"/>
      <path d="M190 475L310 245L575 185L645 475" fill="none" stroke="${drab}" stroke-width="22" stroke-linejoin="round"/>
      ${[
        [190, 475],
        [310, 245],
        [575, 185],
        [645, 475],
      ]
        .map(([x, y]) => pin(x, y))
        .join('')}
      <path d="M180 330A150 150 0 0 1 320 120M575 120A350 350 0 0 1 800 350" fill="none" stroke-dasharray="8 8" opacity=".35"/>
      ${circle(720, 350, 9, olive)}
    </g>`,
  },
  'easy-access-wallet': {
    label: 'MECHANICAL DESIGN',
    drawing: `<g transform="translate(335 65) rotate(-9 270 290)">
      ${rect(110, 35, 350, 360, drab, 'transform="rotate(12 285 215)"')}
      ${rect(80, 65, 350, 360, yellow, 'transform="rotate(5 255 245)"')}
      ${rect(55, 105, 350, 360, 'white')}
      <path d="M90 175H215M90 195H180" opacity=".3"/>
      <path d="M25 260H435V555H25Z" fill="${blue}"/>
      <path d="M25 260H158C175 320 282 320 300 260H435" fill="none"/>
      ${rect(125, 465, 210, 32, yellow)}
      <path d="M460 255V95M447 118L460 95L473 118" fill="none" stroke-dasharray="7 6" opacity=".5"/>
    </g>`,
  },
  'solar-smart-home': {
    label: 'ELECTRONICS & SENSING',
    drawing: `<g transform="translate(125 75)">
      <path d="M405 205L570 70L735 205V445H405Z" fill="${yellow}"/><path d="M385 210L570 55L755 210" fill="none" stroke-width="10"/>
      ${rect(465, 242, 80, 85, blue)}${rect(590, 305, 78, 140, 'white')}
      ${rect(60, 265, 240, 180, blue)}${rect(105, 310, 100, 65, olive)}
      ${Array.from({ length: 8 }, (_, i) => circle(83 + i * 27, 285, 4, yellow)).join('')}
      <path d="M300 320H365V380H405M300 380H345V480H615V445" fill="none" stroke-width="4"/>
      <g transform="translate(760 195) rotate(12)">${rect(0, 0, 170, 230, blue)}${[1, 2, 3].map((i) => line(10, i * 55, 160, i * 55, 'opacity=".4"')).join('')}${line(85, 10, 85, 220, 'opacity=".4"')}</g>
      ${circle(170, 115, 45, yellow)}${[0, 45, 90, 135].map((a) => `<path d="M105 115H235" transform="rotate(${a} 170 115)" stroke="${yellow}" stroke-width="4"/>`).join('')}
    </g>`,
  },
  'traffic-and-elevated-bus': {
    label: 'LOGIC & WORKING MODELS',
    drawing: `<g transform="translate(90 75)">
      ${rect(90, 75, 102, 242, olive)}${circle(141, 130, 28, drab)}${circle(141, 197, 28, yellow)}${circle(141, 264, 28, blue)}${line(141, 317, 141, 520, 'stroke-width="13"')}
      <path d="M335 150H875Q925 150 925 200V345H850V435H785V345H435V435H370V345H320V185Q320 150 335 150Z" fill="${blue}"/>
      ${[365, 455, 545, 635, 725, 815].map((x) => rect(x, 185, 68, 78, 'white')).join('')}
      <path d="M320 300H925" opacity=".35"/>${wheel(400, 437, 34)}${wheel(820, 437, 34)}
      ${rect(535, 383, 170, 75, yellow)}${circle(565, 465, 18, olive)}${circle(675, 465, 18, olive)}
      <path d="M90 520H950M260 485H460M745 485H950" opacity=".3" stroke-dasharray="20 12"/>
    </g>`,
  },
};

await mkdir(directory, { recursive: true });
const accents = {
  'adaptive-suspension-rover': '#c59a4a',
  'uav-vibration-integration': '#8296a5',
  'four-bar-door-mechanism': '#c45a3d',
  'easy-access-wallet': '#98a886',
  'uncertainty-aware-navigation': '#8296a5',
};
for (const [slug, { label, drawing }] of Object.entries(illustrations)) {
  const inkedDrawing = drawing
    .replaceAll(blue, accents[slug] || '#8296a5')
    .replaceAll(yellow, '#ddd7cb')
    .replaceAll(drab, '#c9c6bb');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Temporary ${escapeXml(label.toLowerCase())} subject illustration">
    <g stroke="${olive}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inkedDrawing}</g>
    <path d="M56 718H1144" stroke="${olive}" stroke-opacity=".15"/>
    <text x="56" y="755" font-family="Arial,sans-serif" font-size="14" letter-spacing="2" fill="${olive}" opacity=".6">PROJECT ILLUSTRATION</text>
    <text x="1144" y="755" text-anchor="end" font-family="monospace" font-size="14" fill="${olive}" opacity=".6">M / ${String(Object.keys(illustrations).indexOf(slug) + 1).padStart(2, '0')}</text>
  </svg>`;
  await writeFile(`${directory}illustration-${slug}.svg`, svg);
}
console.log(
  `Generated ${Object.keys(illustrations).length} temporary project illustrations.`,
);
