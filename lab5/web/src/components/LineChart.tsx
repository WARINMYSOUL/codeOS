import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataPoint } from '../types';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type Point = DataPoint & { x: number; y: number };
type HoverState = (Point & { left: number; top: number }) | null;

interface Props {
  data: DataPoint[];
  height?: number;
  formatDate: (ts: number) => string;
}

export const LineChart: React.FC<Props> = ({ data, height = 260, formatDate }) => {
  const paddingX = 12;
  const paddingY = 16;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 1200, height });
  const chartWidth = size.width;
  const chartHeight = size.height;
  const [hover, setHover] = useState<HoverState>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = Math.max(el.clientWidth, 320);
      setSize({ width: w, height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  const points: Point[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const series = [...data].sort((a, b) => a.t - b.t);
    const times = series.map((s) => s.t);
    const vals = series.map((s) => s.v);
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const spanT = maxT - minT || 1;
    const spanV = maxV - minV || 1;

    return series.map((s) => ({
      x: paddingX + ((s.t - minT) / spanT) * (chartWidth - paddingX * 2),
      y: chartHeight - paddingY - ((s.v - minV) / spanV) * (chartHeight - paddingY * 2),
      ...s,
    }));
  }, [chartHeight, chartWidth, data]);

  if (!points.length) {
    return <div className="h-[260px] flex items-center justify-center text-slate-400">Нет данных</div>;
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = chartWidth / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    let best: Point | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    points.forEach((p: Point) => {
      const d = Math.abs(p.x - x);
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    });
    
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full bg-slate-900/60 rounded-2xl border border-slate-800"
        style={{ height: chartHeight }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2.4" />
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${
            chartHeight - paddingY
          } Z`}
          fill="url(#lineFill)"
          stroke="none"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#22d3ee" opacity="0.85" />
        ))}
        {hover && <circle cx={hover.x} cy={hover.y} r="6" fill="#f97316" stroke="#0f172a" strokeWidth="2" />}
      </svg>
      {hover && (
        <div
          className="absolute px-3 py-2 text-xs bg-slate-900/90 border border-amber-400/60 text-slate-100 rounded-xl shadow-xl pointer-events-none"
          style={{ left: hover.left, top: hover.top }}
        >
          <div className="font-semibold">{hover.v.toFixed(2)} °C</div>
          <div className="text-slate-400">{formatDate(hover.t)}</div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
