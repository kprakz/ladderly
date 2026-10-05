/**
 * The Ladderly logo: a white ladder rising toward a yellow star on a dark grey tile.
 * Same artwork as `build/icon.svg` (the app icon) and `src/app/icon.svg` (the browser tab icon).
 * @param {Object} props
 * @param {number} [props.size=32] Width and height in pixels.
 * @param {string} [props.className] Extra CSS classes.
 * @returns {JSX.Element} An inline SVG, hidden from screen readers (the name is shown next to it).
 */
export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ladderly-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f3f46" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="ladderly-star" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#facc15" />
        </linearGradient>
        <radialGradient id="ladderly-glow">
          <stop offset="0" stopColor="#facc15" stopOpacity="0.45" />
          <stop offset="1" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#ladderly-bg)" />
      <circle cx="256" cy="96" r="104" fill="url(#ladderly-glow)" />
      <g stroke="#ffffff" fill="none">
        <path d="M174 392 H338 M188 326 H324 M202 260 H310 M216 194 H296" strokeWidth="22" />
        <path d="M164 440 L222 168 M348 440 L290 168" strokeWidth="28" strokeLinecap="round" />
      </g>
      <path
        d="M256 44 C262 82 270 90 308 96 C270 102 262 110 256 148 C250 110 242 102 204 96 C242 90 250 82 256 44 Z"
        fill="url(#ladderly-star)"
      />
    </svg>
  );
}
