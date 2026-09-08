/* oxlint-disable jsx-a11y/prefer-tag-over-role -- An inline SVG needs its image role and description for screen readers. */
export function TensegrityDiagram() {
  const nodes = [
    [154, 310],
    [354, 329],
    [268, 421],
    [207, 100],
    [386, 190],
    [127, 217],
  ];
  const cables = [
    [0, 1],
    [1, 2],
    [2, 0],
    [3, 4],
    [4, 5],
    [5, 3],
    [0, 3],
    [1, 4],
    [2, 5],
  ];
  const struts = [
    [0, 4],
    [1, 5],
    [2, 3],
  ];
  return (
    <svg
      className="tensegrity-diagram"
      viewBox="0 0 500 490"
      role="img"
      aria-label="Conceptual tensegrity prism: three compression struts suspended in a continuous network of tension cables. This is a principle diagram, not a project prototype."
    >
      <defs>
        <pattern
          id="diagram-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".055"
          />
        </pattern>
        <linearGradient id="strut" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f0e8d7" />
          <stop offset=".48" stopColor="#858e87" />
          <stop offset="1" stopColor="#e8e1d2" />
        </linearGradient>
      </defs>
      <rect width="500" height="490" fill="url(#diagram-grid)" />
      <g fill="none" stroke="#f4eee1" strokeOpacity=".15" strokeDasharray="3 6">
        <path d="M70 345 320 473 443 369M257 448V50M82 251H439" />
        <ellipse
          cx="255"
          cy="331"
          rx="180"
          ry="80"
          transform="rotate(-17 255 331)"
        />
      </g>
      <g stroke="#cd764e" strokeWidth="1.6">
        {cables.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g stroke="url(#strut)" strokeWidth="8" strokeLinecap="round">
        {struts.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g>
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="7"
              fill="#1c2825"
              stroke="#e7dfcd"
              strokeWidth="1.5"
            />
            <circle cx={x} cy={y} r="2" fill="#e7dfcd" />
          </g>
        ))}
      </g>
      <g className="svg-label" fill="#c4c9bf">
        <text x="224" y="83">
          N₁
        </text>
        <text x="399" y="193">
          N₂
        </text>
        <text x="95" y="215">
          N₃
        </text>
        <text x="278" y="447">
          N₆
        </text>
        <text x="74" y="364">
          x
        </text>
        <text x="446" y="371">
          y
        </text>
        <text x="268" y="59">
          z
        </text>
      </g>
      <g stroke="#c4c9bf" strokeOpacity=".55" fill="none">
        <path d="M274 243h94l26-28" />
        <path d="M163 274H81l-15-22" />
      </g>
      <g className="svg-label" fill="#c4c9bf">
        <text x="355" y="209">
          COMPRESSION
        </text>
        <text x="35" y="242">
          TENSION
        </text>
      </g>
    </svg>
  );
}
