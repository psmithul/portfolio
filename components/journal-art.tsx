/* oxlint-disable next/no-img-element -- Covers added in the writing desk retain their original URL. */
import { journalArtKind, type JournalSummary } from '@/lib/journal-editorial';

export function JournalArt({ post }: { post: JournalSummary }) {
  if (post.cover)
    return (
      <div className="journal-art journal-art-photo">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  const kind = journalArtKind(post);
  const space = kind === 'astra' || kind === 'efficiency';
  return (
    <div
      className={`journal-art journal-art-${kind} journal-art-pixel`}
      aria-hidden="true"
    >
      <span className="journal-art-kicker">
        {post.category === 'Controls'
          ? 'On learning control'
          : post.category === 'AI'
            ? 'Notes on AI'
            : 'Notes and questions'}
      </span>
      <svg
        className="journal-pixel-illustration"
        viewBox="0 0 384 240"
        shapeRendering="crispEdges"
        focusable="false"
      >
        <rect width="384" height="240" fill={space ? '#17353e' : '#859f71'} />
        {space ? (
          <>
            {[
              [34, 42],
              [112, 28],
              [286, 51],
              [338, 24],
              [264, 102],
              [62, 98],
              [324, 132],
            ].map(([x, y]) => (
              <path
                key={x}
                d={`M${x} ${y - 4}v8m-4-4h8`}
                stroke="#d7d9b3"
                strokeWidth="2"
              />
            ))}
            <path d="M298 28h26v8h8v26h-8v8h-26v-8h-8V36h8Z" fill="#d4c998" />
            <path d="M290 36h8v26h-8Zm8 26h26v8h-26Z" fill="#aab888" />
          </>
        ) : (
          <>
            <path
              d="M28 44h20v-8h36v8h20v8H28Zm228 24h20v-8h42v8h20v8h-82Z"
              fill="#e7e5c7"
            />
            <path
              d="M0 120h48v-16h36v16h44v-8h52v8h36v-16h52v16h52v-8h64v128H0Z"
              fill="#486b46"
            />
            <path
              d="M0 138h72v-8h64v16h64v-8h48v-8h48v16h88v94H0Z"
              fill="#32573c"
            />
          </>
        )}
        <path d="M0 188h384v52H0Z" fill="#775537" />
        <path d="M0 188h384v8H0Z" fill="#ba9761" />
        <path
          d="M0 208h384M0 232h384M44 196v12m98 0v24m132-36v12m58 0v24"
          stroke="#946c44"
          strokeWidth="3"
        />
        <path d="M81 164h16v-30h78v8h34v-8h78v30h16v30H81Z" fill="#5c5745" />
        <path d="M89 164h12v-30h72v8h18v44h-18v-6h-72v-6H89Z" fill="#ded4ac" />
        <path d="M191 142h18v-8h72v30h12v10h-12v6h-72v6h-18Z" fill="#efdfb8" />
        <path
          d="M101 180h72v6h36v-6h72v6h12v8h-92v5h-20v-5H89v-8h12Z"
          fill={space ? '#ac7958' : '#365b3e'}
        />
        <path d="M183 144h10v42h-10Z" fill="#b2a26e" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} fill="#88774e">
            <rect
              x="113"
              y={146 + i * 7}
              width={i === 3 ? 32 : 50}
              height="2"
            />
            <rect
              x="217"
              y={146 + i * 7}
              width={i === 2 ? 34 : 52}
              height="2"
            />
          </g>
        ))}
        <path d="M61 136h14v46H61Z" fill="#a8834f" />
        <path d="M57 118h22v20H57Z" fill="#dcc474" />
        <path d="M63 111h10v12H63Z" fill="#f2dea0" />
        <path d="M55 183h26v5H55Z" fill="#bca373" />
        <path d="M315 154h19v27h-19Z" fill="#538474" />
        <path
          d="M334 158h8v17h-8"
          fill="none"
          stroke="#83a687"
          strokeWidth="4"
        />
        <path d="M318 150h13v6h-13Z" fill="#203d2d" />
      </svg>
      <span className="journal-art-number">
        {kind === 'control'
          ? 'PID'
          : kind === 'sol'
            ? '5.6'
            : kind === 'note'
              ? 'Aa'
              : '6'}
      </span>
      <span className="journal-art-bottom">
        {kind === 'efficiency'
          ? 'Sol / Luna'
          : kind === 'astra'
            ? 'Astra'
            : kind === 'sol'
              ? 'Sol'
              : kind === 'control'
                ? 'A question of feedback.'
                : 'A page from my notebook'}
      </span>
    </div>
  );
}
