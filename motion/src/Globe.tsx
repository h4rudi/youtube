import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoDistance} from 'd3-geo';
import {feature} from 'topojson-client';
import land50 from 'world-atlas/land-50m.json';
import countries from 'world-atlas/countries-110m.json';
import {S} from './style2';

const VLA: [number, number] = [131.89, 43.12];
const FRA: [number, number] = [8.68, 50.11];
const KM = 8279;

// route timeline (local frames): 0-40 globe appears zoomed on Vladivostok, 40-60 pin, 70-290 route, 290+ arrival
export type GlobePal = {ocean0: string; ocean1: string; line: string; land: string};
const DEF: GlobePal = {ocean0: '#3a3a3a', ocean1: '#151515', line: '#e6e6e6', land: '#bdbdbd'};

export const Globe: React.FC<{speed?: number; pal?: GlobePal; font?: string}> = ({speed = 1, pal = DEF, font}) => {
  const f = useCurrentFrame() * speed;
  const landF = useMemo(() => feature(land50 as any, (land50 as any).objects.land) as any, []);
  const germany = useMemo(() => (feature(countries as any, (countries as any).objects.countries) as any).features.find((c: any) => c.id === '276'), []);
  const interp = useMemo(() => geoInterpolate(VLA, FRA), []);
  const p = interpolate(f, [70, 290], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const dot = interp(p);
  // camera: follow slightly behind the dot
  const cam = interp(Math.max(0, p - 0.08) * 0.92 + 0.04 * Math.min(1, p * 4));
  const scale = interpolate(f, [0, 45, 70, 180, 290, 330], [1400, 560, 520, 470, 520, 560], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const proj = geoOrthographic().scale(scale).translate([960, 560]).rotate([-cam[0], -cam[1] + 8]).clipAngle(90);
  const path = geoPath(proj);
  const n = 120;
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) { const t = (i / n) * p; pts.push(interp(t)); }
  const route = path({type: 'LineString', coordinates: pts} as any) || '';
  const visible = (c: [number, number]) => geoDistance(c, [cam[0], cam[1] - 8]) < Math.PI / 2 - 0.05;
  const P = (c: [number, number]) => proj(c) as [number, number];
  const pinV = interpolate(f, [40, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const pinG = interpolate(f, [290, 302], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const ping = Math.round(interpolate(p, [0, 1], [0, 150]));
  const km = Math.round(KM * p);
  const appear = interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  const [dx, dy] = P(dot);
  const pinEl = (c: [number, number], s: number, label: string, col: string) => {
    if (!visible(c) || s <= 0) return null;
    const [x, y] = P(c);
    return (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        <circle r={34} fill={col} opacity={0.18} />
        <circle r={13} fill={col} stroke="#fff" strokeWidth={4} />
        <g transform="translate(0,-40)">
          <rect x={-label.length * 13 - 20} y={-46} width={label.length * 26 + 40} height={56} rx={12} fill="rgba(10,10,10,0.85)" stroke={col} strokeWidth={3} />
          <text x={0} y={-8} textAnchor="middle" fill="#fff" style={{fontFamily: font ?? 'Montserrat', fontWeight: 900, fontSize: font ? 26 : 30}}>{label}</text>
        </g>
      </g>
    );
  };
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: appear}}>
      <defs>
        <radialGradient id="ocean" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={pal.ocean0} />
          <stop offset="100%" stopColor={pal.ocean1} />
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx={960} cy={560} r={scale} fill="url(#ocean)" stroke={pal.line} strokeOpacity={0.6} strokeWidth={3} />
      <path d={path(geoGraticule10()) || ''} fill="none" stroke={pal.line} strokeOpacity={0.16} strokeWidth={1.5} />
      <path d={path(landF) || ''} fill={pal.land} fillOpacity={0.3} stroke={pal.line} strokeOpacity={0.7} strokeWidth={1.6} />
      {germany && <path d={path(germany) || ''} fill={S.orange} fillOpacity={interpolate(f, [285, 300], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />}
      <path d={route} fill="none" stroke={S.orange} strokeWidth={14} strokeOpacity={0.25} strokeLinecap="round" />
      <path d={route} fill="none" stroke={S.orange} strokeWidth={6} strokeLinecap="round" strokeDasharray="22 14" strokeDashoffset={-f * 2} filter="url(#glow)" />
      {pinEl(VLA, pinV, 'ВЛАДИВОСТОК', S.orange)}
      {pinEl(FRA, pinG, 'ГЕРМАНИЯ', S.red)}
      {p > 0 && p < 1 && visible(dot) && (
        <g transform={`translate(${dx},${dy})`}>
          <circle r={20 + 6 * Math.sin(f / 3)} fill={S.orange} opacity={0.3} />
          <circle r={11} fill="#fff" />
        </g>
      )}
      {/* HUD bottom: distance + ping like a navigator */}
      <g transform="translate(960,1000)" opacity={interpolate(f, [60, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
        <rect x={-330} y={-50} width={660} height={86} rx={20} fill="rgba(10,10,10,0.85)" stroke="#555" strokeWidth={2} />
        <text x={-170} y={8} textAnchor="middle" fill="#fff" style={{fontFamily: font ?? 'Unbounded', fontWeight: 900, fontSize: 40}}>{km.toLocaleString('ru-RU')} КМ</text>
        <line x1={0} y1={-30} x2={0} y2={20} stroke="#555" strokeWidth={2} />
        <text x={170} y={8} textAnchor="middle" fill={ping < 60 ? '#2bd96b' : ping < 110 ? '#ffc400' : S.red} style={{fontFamily: font ?? 'Unbounded', fontWeight: 900, fontSize: 40}}>{ping >= 150 ? '150+' : ping} MS</text>
      </g>
    </svg>
  );
};
