// Субтитры по 1–2 слова: Benzin Bold, полупрозрачные, чёрная тень + свечение, подпрыг слов, ключевые слова цветом
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type Cue = {at: number; text: string; color?: string};
const W = '#ffffff';
// подобраны под красный фон: тёплые жёлтые/янтарные + холодные голубой/зелёный
export const SUB = {amber: '#ffb238', yellow: '#ffe14a', cyan: '#7fe0ff', green: '#4df095', white: '#ffffff'};

const shadow = (color: string) => {
  const L: string[] = [];
  for (let i = 1; i <= 5; i++) L.push(`${(i * 0.7).toFixed(1)}px ${(i * 1.2).toFixed(1)}px 0 rgba(0,0,0,${0.9 - i * 0.08})`);
  L.push('0 0 3px #000', '0 0 3px #000', '0 0 6px rgba(0,0,0,0.8)', `0 0 20px ${color}aa`, `0 0 40px ${color}55`, '4px 10px 18px rgba(0,0,0,0.5)');
  return L.join(',');
};

export const Subs: React.FC<{cues: Cue[]; end: number; font?: string; bottom?: number; size?: number}> = ({cues, end, font = 'Benzin', bottom = 34, size = 54}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  let idx = -1;
  for (let i = 0; i < cues.length; i++) if (f >= cues[i].at) idx = i;
  if (idx < 0 || f >= end) return null;
  const cue = cues[idx];
  const next = idx + 1 < cues.length ? cues[idx + 1].at : end;
  const out = interpolate(f, [next - 5, next], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const words = cue.text.split(' ');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: bottom, pointerEvents: 'none'}}>
      <div style={{display: 'flex', gap: size * 0.32, opacity: 0.94 * out}}>
        {words.map((w, i) => {
          const s = spring({frame: f - cue.at - i * 3, fps, config: {damping: 9, stiffness: 260, mass: 0.5}});
          const col = cue.color ?? W;
          return (
            <span key={i} style={{display: 'inline-block', fontFamily: font, fontSize: size, color: col, textShadow: shadow(col === W ? '#ffffff' : col),
              transform: `translateY(${(1 - s) * 26}px) scale(${0.88 + 0.12 * s})`, opacity: Math.min(1, s * 2)}}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// distribute chunks evenly inside a scene window [from, to)
export const spread = (from: number, to: number, chunks: (string | [string, string])[]): Cue[] => {
  const step = (to - from) / chunks.length;
  return chunks.map((c, i) => (typeof c === 'string' ? {at: Math.round(from + i * step), text: c} : {at: Math.round(from + i * step), text: c[0], color: c[1]}));
};
