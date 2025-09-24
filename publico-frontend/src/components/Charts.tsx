import React from "react";

export const LineChart: React.FC<{ points?: number[]; max?: number }> = ({
  points = [400, 650, 520, 760, 680, 820, 740],
  max = 1000,
}) => {
  const w = 320, h = 140, p = 24;
  const step = (w - p * 2) / (points.length - 1);
  const path = points
    .map((v, i) => {
      const x = p + i * step;
      const y = h - p - (v / max) * (h - p * 2);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="12" className="fill-slate-50" />
      <path d={path} className="stroke-blue-600 fill-none" strokeWidth={2.2} strokeLinecap="round" />
      <path d={`${path} L ${w - p},${h - p} L ${p},${h - p} Z`} fill="url(#lineGrad)" />
    </svg>
  );
};

export const Donut: React.FC<{
  segments?: number[];
  labels?: string[];
  colors?: string[];
}> = ({
  segments = [36, 28, 23, 13],
  labels = ["Education", "Infrastructure", "Health", "Fiscal Control"],
  colors = ["#3b82f6", "#22c55e", "#10b981", "#f97316"],
}) => {
  const total = segments.reduce((a, b) => a + b, 0);
  let a0 = -90;
  const radius = 62;
  const cx = 90, cy = 90;
  const arcs = segments.map((val, idx) => {
    const angle = (val / total) * 360;
    const a1 = a0 + angle;
    const large = angle > 180 ? 1 : 0;
    const p0 = polar(cx, cy, radius, a0);
    const p1 = polar(cx, cy, radius, a1);
    a0 = a1;
    return (
      <path key={idx} d={`M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`}
        stroke={colors[idx]} strokeWidth={18} fill="none" />
    );
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-40 h-40">
        <circle cx={cx} cy={cy} r={radius} className="stroke-slate-200" strokeWidth={18} fill="none" />
        {arcs}
        <text x="90" y="90" textAnchor="middle" dominantBaseline="middle"
          className="fill-slate-700 text-sm font-semibold">Allocation</text>
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((v, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-700">
            <span className="w-3 h-3 rounded-sm" style={{ background: colors[i] }} />
            <span className="w-32">{labels[i]}</span>
            <span className="font-semibold">{v}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
