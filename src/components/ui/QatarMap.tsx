import { cn } from '@/lib/utils';

/** Simplified Qatar coastline (lon, lat), clockwise from the Salwa border. Stylised, not survey-accurate. */
const coast: [number, number][] = [
  [50.8, 24.75], [50.86, 24.9], [50.82, 25.05], [50.78, 25.25], [50.76, 25.45], [50.8, 25.55], [50.83, 25.62],
  [50.88, 25.75], [50.95, 25.88], [51.03, 26.0], [51.12, 26.08], [51.22, 26.15], [51.3, 26.12], [51.4, 26.02],
  [51.52, 25.93], [51.55, 25.8], [51.5, 25.69], [51.53, 25.55], [51.52, 25.45], [51.55, 25.37], [51.53, 25.33],
  [51.55, 25.29], [51.61, 25.28], [51.62, 25.2], [51.6, 25.15], [51.58, 25.05], [51.55, 24.95], [51.5, 24.8],
  [51.42, 24.65], [51.3, 24.58], [51.2, 24.52], [51.0, 24.6], [50.85, 24.7],
];

const LON0 = 50.66;
const LAT0 = 26.24;
const S = 400;
const KX = Math.cos((25.3 * Math.PI) / 180);
export const MAP_W = Math.round((51.7 - LON0) * KX * S);
export const MAP_H = Math.round((LAT0 - 24.44) * S);

export const project = (lng: number, lat: number) => ({ x: (lng - LON0) * KX * S, y: (LAT0 - lat) * S });

const outline = coast.map(([lng, lat], i) => {
  const { x, y } = project(lng, lat);
  return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join('') + 'Z';

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  /** Label side relative to the dot */
  labelSide?: 'start' | 'end';
  tone?: 'gold' | 'white';
  active?: boolean;
}

/** Inline SVG map of Qatar — no external tiles — with pulsing pins. */
export function QatarMap({ points, label, className }: { points: MapPoint[]; label: string; className?: string }) {
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={label} direction="ltr" className={cn("h-auto w-full", className)}>
      <defs>
        <pattern id="qa-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="#C99A2E" strokeOpacity=".12" strokeWidth=".6" />
        </pattern>
        <linearGradient id="qa-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15426B" stopOpacity=".55" />
          <stop offset="1" stopColor="#052F57" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <path d={outline} fill="url(#qa-fill)" />
      <path d={outline} fill="url(#qa-grid)" />
      <path d={outline} fill="none" stroke="#C99A2E" strokeOpacity=".7" strokeWidth="1.4" strokeLinejoin="round" />
      {points.map((p, i) => {
        const { x, y } = project(p.lng, p.lat);
        const color = p.tone === 'white' ? '#FFFFFF' : '#DFB95C';
        const end = p.labelSide !== 'start';
        return (
          <g key={p.id}>
            <circle cx={x} cy={y} r="5" fill={color} className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.35}s` }} />
            <circle cx={x} cy={y} r={p.active ? 6 : 4.5} fill={color} stroke="#02101F" strokeWidth="1.5" />
            {p.label && (
              <text
                x={end ? x + 10 : x - 10}
                y={y + 4}
                textAnchor={end ? 'start' : 'end'}
                fill="#FFFFFF"
                fillOpacity=".85"
                fontSize="13"
                fontWeight="600"
                style={{ fontFamily: 'var(--font-tnr)' }}
              >
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
