type Tone = "default" | "light";

type LogoProps = {
  className?: string;
  markSize?: number;
  tone?: Tone;
};

// Regular heptagon vertices (7 points), top-centered.
const SIDES = 7;
const R = 46;
const CX = 50;
const CY = 52;
const points = Array.from({ length: SIDES }, (_, i) => {
  const angle = (-90 + (i * 360) / SIDES) * (Math.PI / 180);
  return {
    x: CX + R * Math.cos(angle),
    y: CY + R * Math.sin(angle),
  };
});

// All diagonals (non-adjacent vertex pairs).
const diagonals: Array<[number, number]> = [];
for (let i = 0; i < SIDES; i++) {
  for (let j = i + 1; j < SIDES; j++) {
    const adjacent = j - i === 1 || (i === 0 && j === SIDES - 1);
    if (!adjacent) diagonals.push([i, j]);
  }
}

const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

export function HeptagonMark({ size = 28, tone = "default" }: { size?: number; tone?: Tone }) {
  const outline = tone === "light" ? "var(--ink-foreground)" : "var(--ink)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Violet inner diagonals */}
      {diagonals.map(([a, b], idx) => (
        <line
          key={idx}
          x1={points[a].x}
          y1={points[a].y}
          x2={points[b].x}
          y2={points[b].y}
          stroke="var(--violet)"
          strokeWidth={2}
        />
      ))}
      {/* Border */}
      <polygon
        points={polygonPoints}
        stroke={outline}
        strokeWidth={4}
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className = "", markSize = 28, tone = "default" }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 font-bold tracking-tight ${className}`}>
      <HeptagonMark size={markSize} tone={tone} />
      <span className="flex items-center">
        <span className={tone === "light" ? "text-ink-foreground" : "text-foreground"}>3</span>
        <span className="text-violet">pix</span>
      </span>
    </span>
  );
}
