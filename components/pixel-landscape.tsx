/** Original, static pixel illustration. No canvas, animation or game assets. */
export function PixelLandscape({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={'pixel-landscape' + (small ? ' pixel-landscape-small' : '')}
      viewBox="0 0 384 192"
      aria-hidden="true"
      shapeRendering="crispEdges"
      focusable="false"
    >
      <rect width="384" height="192" fill="#aed7d9" />
      <path
        d="M0 114h32v-8h24v-8h32v16h40v-8h32v-8h24v-8h40v16h32v8h40v-8h40v8h48v78H0Z"
        fill="#88aa75"
      />
      <path
        d="M0 132h48v-8h40v8h40v-16h32v8h48v16h40v-8h56v8h40v-8h40v60H0Z"
        fill="#658b57"
      />
      <rect x="304" y="18" width="28" height="28" fill="#fff0a6" />
      <path
        d="M28 30h16v-8h32v8h20v8H28Zm112 24h16v-8h40v8h28v8h-84Zm164 16h12v-8h28v8h24v8h-64Z"
        fill="#f5f3df"
      />
      {[24, 104, 338].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 8 : 0})`}>
          <path d="M14 96h10v58H14Z" fill="#76533c" />
          <path d="M14 96h4v58h-4Z" fill="#9b7450" />
          <path d="M0 90h8V76h24v8h8v28H0Z" fill="#376943" />
          <path d="M8 84h16v12H8Zm16 12h8v8h-8Z" fill="#4d7d47" />
        </g>
      ))}
      <path d="M0 162h384v30H0Z" fill="#87633f" />
      <path d="M0 158h384v8H0Z" fill="#7f9d49" />
      <path d="M0 166h384v4H0Z" fill="#597e3c" />
      <path d="M0 172h384v4H0Z" fill="#263934" />
      <path d="M0 180h384v4H0Z" fill="#263934" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect
          key={i}
          x={i * 16 + 4}
          y="171"
          width="4"
          height="14"
          fill="#ba9b61"
        />
      ))}
      <g className="pixel-locomotive">
        <path d="M134 152h10v-2h10v2h10" stroke="#2d4037" strokeWidth="4" />
        <path d="M170 152h10v-2h10v2h10" stroke="#2d4037" strokeWidth="4" />
        {[64, 138].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <rect y="110" width="64" height="7" fill="#294b43" />
            <rect x="4" y="117" width="56" height="34" fill="#62927a" />
            <rect x="4" y="143" width="56" height="8" fill="#3e6654" />
            {[9, 25, 41].map((wx) => (
              <g key={wx}>
                <rect x={wx} y="120" width="12" height="19" fill="#bcdfd5" />
                <path
                  d={`M${wx + 3} 122v13h6`}
                  fill="none"
                  stroke="#8cb6ad"
                  strokeWidth="2"
                />
              </g>
            ))}
            <path d="M2 151h60v7H2Z" fill="#2e3d37" />
            {[14, 48].map((wx) => (
              <g key={wx} transform={`translate(${wx} 159)`}>
                <path d="M-6-9H6v3h3V6H6v3H-6V6h-3V-6h3Z" fill="#293b35" />
                <rect x="-4" y="-4" width="8" height="8" fill="#ca9557" />
              </g>
            ))}
          </g>
        ))}
        <g transform="translate(218 0)">
          <path d="M0 104h40v8H0Z" fill="#294b43" />
          <path d="M4 112h30v40H4Z" fill="#427e66" />
          <rect x="9" y="117" width="20" height="22" fill="#afd2c4" />
          <path d="M17 121h10v10H17Z" fill="#e6a9b2" />
          <path d="M17 119h10v3H17Zm0-3h3v4h-3Zm7 0h3v4h-3Z" fill="#edcc5e" />
          <path d="M18 131h8v11h-8Z" fill="#ac4647" />
          <path d="M34 127h42v26H34Z" fill="#bf8653" />
          <path d="M36 128h38v6H36Z" fill="#dba46a" />
          <path d="M60 106h12v22H60Z" fill="#35453e" />
          <path d="M58 103h16v5H58Z" fill="#263a33" />
          <path d="M1 151h82v7H1Z" fill="#2e3d37" />
          {[18, 60].map((wx) => (
            <g key={wx} transform={`translate(${wx} 159)`}>
              <path d="M-7-10H7v3h3V7H7v3H-7V7h-3V-7h3Z" fill="#293b35" />
              <rect x="-5" y="-5" width="10" height="10" fill="#d4a362" />
              <rect x="-2" y="-2" width="4" height="4" fill="#704d34" />
            </g>
          ))}
          <path d="M12 159h54" stroke="#e4c591" strokeWidth="3" />
        </g>
      </g>
      <path d="M314 155v-10h4v10m-4-10h-4v-4h4m4 6h4v-4h-4" fill="#d1cf64" />
      <path d="M49 159v-9h4v9m-4-9h-4v-4h4m4 6h4v-4h-4" fill="#e7be86" />
    </svg>
  );
}
