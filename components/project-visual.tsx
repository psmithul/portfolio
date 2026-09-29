import type { ModelKind } from '@/lib/engineering-scene';
export function ProjectVisual({
  kind,
}: {
  kind:
    | ModelKind
    | 'navigation'
    | 'linkage'
    | 'electronics'
    | 'collection'
    | 'wallet';
}) {
  return (
    <svg
      className={`project-model-visual model-${kind}`}
      viewBox="0 0 640 390"
      aria-label={`${kind} conceptual engineering illustration`}
    >
      <title>{`${kind} conceptual engineering illustration`}</title>
      <defs>
        <linearGradient id={`metal-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e2e9e6" />
          <stop offset=".48" stopColor="#93aca8" />
          <stop offset="1" stopColor="#e7eeea" />
        </linearGradient>
        <linearGradient id={`dark-${kind}`}>
          <stop stopColor="#33494a" />
          <stop offset="1" stopColor="#132d30" />
        </linearGradient>
      </defs>
      <ellipse
        cx="325"
        cy="320"
        rx="180"
        ry="28"
        fill="#1b3133"
        opacity=".09"
      />
      {kind === 'rover' || kind === 'collection' ? (
        <g transform="translate(95 66)">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${145 + i * 82} ${145 - i * 20})`}>
              <ellipse rx="34" ry="45" fill="#172e31" />
              <ellipse cx="7" rx="25" ry="36" fill="#879d98" />
              <ellipse cx="9" rx="19" ry="28" fill="#223b3d" />
              <ellipse cx="11" rx="10" ry="15" fill="#ff603b" />
            </g>
          ))}
          <path d="M95 109 258 63 386 99 226 147Z" fill="#daeecf" />
          <path d="M95 109V147L226 185V147Z" fill="#6b9883" />
          <path d="M226 147 386 99V137L226 185Z" fill="#b9eab0" />
          <path
            d="m113 104 144-36 105 29-140 41Z"
            fill={`url(#metal-${kind})`}
          />
          <path d="m154 91 90-23 47 13-92 24Z" fill="#274b4d" />
          <path d="M304 106V58" stroke="#879c98" strokeWidth="8" />
          <path d="m287 39 38-9 15 7v27l-39 10-14-10Z" fill="#223b3d" />
          <ellipse cx="329" cy="48" rx="6" ry="8" fill="#9cd3d0" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${113 + i * 83} ${192 - i * 23})`}>
              <path
                d="m-5-29 2-32"
                stroke="#ff603b"
                strokeWidth="10"
                strokeDasharray="3 3"
              />
              <ellipse rx="35" ry="46" fill="#172d30" />
              <ellipse cx="10" rx="27" ry="38" fill={`url(#metal-${kind})`} />
              <ellipse cx="13" rx="21" ry="30" fill="#254142" />
              {[0, 1, 2].map((j) => (
                <path
                  key={j}
                  d="M14-25V25"
                  stroke="#bfe5b6"
                  strokeWidth="5"
                  transform={`rotate(${j * 60} 13 0)`}
                />
              ))}
              <ellipse cx="13" rx="9" ry="13" fill="#ff603b" />
            </g>
          ))}
        </g>
      ) : kind === 'tensegrity' ? (
        <g transform="translate(320 208)">
          <ellipse cy="98" rx="113" ry="39" fill="#48686a" />
          <ellipse cy="90" rx="113" ry="39" fill={`url(#metal-${kind})`} />
          <path
            d="m-82 94 155-172M80 105-59-190M-4 128-3-177"
            stroke="#9bb1a8"
            strokeWidth="13"
          />
          <path
            d="m-82 94 79-271 83 282-139-295 55 318 77-206M-82 94 80 105-4 128Z"
            fill="none"
            stroke="#e85735"
            strokeWidth="2.5"
          />
          <ellipse cy="-148" rx="103" ry="34" fill="#659581" />
          <ellipse cy="-155" rx="103" ry="34" fill="#cbefbf" />
          <ellipse
            cy="-155"
            rx="70"
            ry="21"
            fill="none"
            stroke="#8eb5a0"
            strokeWidth="3"
          />
        </g>
      ) : kind === 'knee' ? (
        <g transform="translate(309 204) rotate(-13)">
          <path
            d="M-57-129V128M49-129V128"
            stroke={`url(#metal-${kind})`}
            strokeWidth="17"
          />
          <rect
            x="-75"
            y="-135"
            width="137"
            height="40"
            rx="12"
            fill="#bddbab"
          />
          <rect
            x="-72"
            y="102"
            width="137"
            height="40"
            rx="12"
            fill="#a4c390"
          />
          <path d="M-59-83V-21M47 37V91" stroke="#274346" strokeWidth="24" />
          <circle cx="-57" r="21" fill="#ff603b" />
          <circle cx="49" r="21" fill="#ff603b" />
          <circle cx="49" r="8" fill="#a3b9b0" />
          <circle cx="-57" r="8" fill="#a3b9b0" />
          <rect x="58" y="-71" width="32" height="63" rx="5" fill="#233b3e" />
          <path
            d="M-73 14V79"
            stroke="#fb6a43"
            strokeWidth="12"
            strokeDasharray="4 4"
          />
          <path d="M80-32V88" stroke="#294044" strokeWidth="2" />
        </g>
      ) : kind === 'satellite' ? (
        <g transform="translate(90 90)">
          <path d="m20 112 254-74 198 83-258 87Z" fill="#b79853" />
          <path d="M20 112v15l254 86 258-83v-9l-258 76Z" fill="#987b3c" />
          {Array.from({ length: 5 }, (_, i) => (
            <path
              key={i}
              d={`m${47 + i * 48} ${109 - i * 13} 194 81 36-11-194-81Z`}
              fill="#173c50"
              stroke="#87b1c0"
              strokeWidth=".5"
            />
          ))}
          <ellipse cx="151" cy="95" rx="51" ry="25" fill="#92a9a7" />
          <path d="M100 65v30c0 35 102 35 102 0V65" fill="#637f80" />
          <ellipse cx="151" cy="65" rx="51" ry="25" fill="#e9a76e" />
          <ellipse cx="151" cy="65" rx="31" ry="16" fill="#183139" />
          <ellipse cx="151" cy="65" rx="10" ry="5" fill="#d0b166" />
          <path d="m274 38 64 22V126l-64-22Z" fill="#afc2bd" />
          <path d="m274 38 44-13 64 22-44 13Z" fill="#dfebe7" />
          <path d="m338 60 44-13v66l-44 13Z" fill="#6d8889" />
          <ellipse cx="374" cy="84" rx="16" ry="23" fill="#19353b" />
          <ellipse cx="378" cy="84" rx="10" ry="15" fill="#5a99a0" />
        </g>
      ) : (
        <g transform="translate(320 198)">
          <path
            d="m-136 0 136-80 136 80L0 80Z"
            fill="#afcec1"
            stroke="#29494b"
            strokeWidth="3"
          />
          {[-70, 0, 70].map((x, i) => (
            <g key={x}>
              <path
                d={`M${x} ${-44 + i * 28}v89`}
                stroke="#29494b"
                strokeWidth="4"
              />
              <circle cx={x} cy={-44 + i * 28} r="13" fill="#ff603b" />
            </g>
          ))}
          <path
            d="m-95 17 70-48 84 83 51-41"
            fill="none"
            stroke="#ff603b"
            strokeWidth="6"
            strokeDasharray={kind === 'navigation' ? '7 5' : undefined}
          />
        </g>
      )}
    </svg>
  );
}
