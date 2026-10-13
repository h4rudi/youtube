import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, F, loadFonts} from './theme';
import {Flash, GridBg, PingBadge, Shake, glitchShadow, useSlam} from './fx';
import {GAMES} from './games';

const Stat: React.FC<{label: string; value: string; at: number; color?: string}> = ({label, value, at, color = C.white}) => {
  const f = useCurrentFrame();
  const y = interpolate(f - at, [0, 12], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const o = interpolate(f - at, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{transform: `translateY(${y}px)`, opacity: o, textAlign: 'center', minWidth: 250}}>
      <div style={{fontFamily: F.ui, fontWeight: 600, fontSize: 32, color: C.grey, letterSpacing: 3}}>{label}</div>
      <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 64, color}}>{value}</div>
    </div>
  );
};

export const GameCard: React.FC<{game: number}> = ({game}) => {
  loadFonts();
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const g = GAMES[game - 1];
  const res = g.win ? C.green : C.red;
  const {scale, opacity} = useSlam(14, 1.9);
  const out = interpolate(f, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rating = parseFloat(g.rating);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <GridBg accent={res} />
      <Shake at={14} amount={18}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: 40}}>
          {/* progress slots */}
          <div style={{display: 'flex', gap: 16, position: 'absolute', top: 70}}>
            {GAMES.map((x, i) => {
              const past = i < game - 1, cur = i === game - 1;
              const s = cur ? spring({frame: f - 30, fps, config: {damping: 10}}) : 1;
              const bg = past || (cur && f >= 30) ? (x.win ? C.green : C.red) : 'transparent';
              return (
                <div key={i} style={{width: 64, height: 64, borderRadius: 12, border: `3px solid ${past || cur ? (x.win ? C.green : C.red) : '#3a3a44'}`,
                  background: bg, opacity: past ? 0.55 : 1, transform: `scale(${cur ? interpolate(s, [0, 1], [0.4, 1]) : 1})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.title, fontSize: 26, color: C.white}}>{i + 1}</div>
              );
            })}
          </div>
          <div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 40, color: C.grey, letterSpacing: 10}}>КАЛИБРОВКА {game}/10 · {g.map}</div>
          <div style={{transform: `scale(${scale})`, opacity, fontFamily: F.title, fontWeight: 900, fontSize: 190, color: res, lineHeight: 1.1, marginTop: 10,
            textShadow: glitchShadow(f, f >= 14 && f < 22, 16)}}>{g.win ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}</div>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 110, color: C.white, opacity: interpolate(f, [24, 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{g.score}</div>
          <div style={{display: 'flex', gap: 40, marginTop: 50}}>
            <Stat label="У / С / А" value={g.kda} at={40} />
            <Stat label="К/Д" value={g.kd} at={48} />
            <Stat label="РЕЙТИНГ" value={g.rating} at={56} color={rating >= 1.3 ? C.green : rating < 0.95 ? C.red : C.white} />
            <Stat label="СУ/Р" value={g.adr} at={64} />
          </div>
        </AbsoluteFill>
      </Shake>
      <div style={{position: 'absolute', right: 50, top: 50}}><PingBadge value={150} scale={0.55} /></div>
      <Flash at={14} dur={9} color={res} />
    </AbsoluteFill>
  );
};
