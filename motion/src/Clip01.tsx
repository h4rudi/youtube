// Кусок ролика №1 (9,9 с): закадр + субтитры по 1–2 слова (тайминги из распознавания речи) + мини-плашка «голос за кадром»,
// полоски которой реагируют на громкость реального голоса.
import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender} from 'remotion';
import {Video} from '@remotion/media';
import ENV from './clip01_env.json';

let ld = false;
const loadBenzin = () => {
  if (ld || typeof document === 'undefined') return; ld = true;
  const h = delayRender('benzin-c1');
  new FontFace('Benzin', `url(${staticFile('fonts/Benzin-Bold.ttf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
};

const K = {amber: '#ffb238', yellow: '#ffe14a', cyan: '#7fe0ff', green: '#4df095', red: '#ff5a6a'};
// [start sec, text, color?]
const CUES: [number, string, string?][] = [
  [0.0, 'В ОБЩЕМ,'], [0.4, 'ПЕРВУЮ СВОЮ'], [0.8, 'КАЛИБРОВОЧНУЮ', K.yellow], [1.58, 'ИГРУ'], [1.86, 'Я ПРОИГРАЛ,', K.red],
  [2.62, 'ДАЖЕ НЕ'], [2.98, 'ВЫЙДЯ'], [3.24, 'В КД,', K.red], [3.86, 'НО Я'], [4.1, 'НЕ ОТЧАЯЛСЯ', K.green],
  [4.7, 'И СРАЗУ'], [4.96, 'ЖЕ ЗАРЕГАЛ'], [5.52, 'НЕКСТ,', K.cyan], [6.0, 'В КОТОРОЙ,'], [6.38, 'КСТАТИ,'],
  [6.96, 'НАБИЛ'], [7.24, 'ДОВОЛЬНО-ТАКИ'], [7.78, 'СИЛЬНУЮ', K.amber], [8.26, 'СТАТИСТИКУ.', K.amber],
];
const END = 9.6;
const X = 780, Y = 878; // free strip right of the chat, above the HUD

const shadow = (c: string) => {
  const L: string[] = [];
  for (let i = 1; i <= 5; i++) L.push(`${(i * 0.7).toFixed(1)}px ${(i * 1.2).toFixed(1)}px 0 rgba(0,0,0,${0.9 - i * 0.08})`);
  L.push('0 0 3px #000', '0 0 3px #000', `0 0 18px ${c}aa`, `0 0 36px ${c}44`, '4px 10px 18px rgba(0,0,0,0.5)');
  return L.join(',');
};

const VoicePill: React.FC<{show: number}> = ({show}) => {
  const f = useCurrentFrame();
  const lvl = (k: number) => ENV[Math.max(0, Math.min(ENV.length - 1, f - k))] ?? 0;
  const ring = (f % 50) / 50;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, height: 64, padding: '0 18px 0 8px', borderRadius: 32, background: 'rgba(12,12,16,0.72)',
      border: '2px solid rgba(255,140,60,0.75)', boxShadow: '0 0 18px rgba(255,106,19,0.45)', opacity: show, transform: `scale(${0.8 + 0.2 * show})`, transformOrigin: 'left center'}}>
      <div style={{position: 'relative', width: 48, height: 48}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #ff6a13', transform: `scale(${1 + ring * 0.5})`, opacity: (1 - ring) * 0.8 * (0.3 + lvl(0))}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ff8a3d, #ff6a13 55%, #b33d00)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={26} height={26} viewBox="0 0 24 24">
            <rect x={8.5} y={2.5} width={7} height={12} rx={3.5} fill="#fff" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />
            <path d="M12 18v3.5" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 40}}>
        {[3, 0, 2, 5, 1].map((d, i) => {
          const v = Math.max(lvl(d), lvl(d + 2) * 0.8);
          return <div key={i} style={{width: 5, height: 6 + v * (i === 2 ? 34 : 26), borderRadius: 3, background: 'linear-gradient(180deg,#ffb238,#ff6a13)'}} />;
        })}
      </div>
    </div>
  );
};

const Words: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  let i = -1;
  CUES.forEach((c, k) => { if (t >= c[0]) i = k; });
  if (i < 0 || t >= END) return null;
  const [st, text, col] = CUES[i];
  const nextT = i + 1 < CUES.length ? CUES[i + 1][0] : END;
  const out = interpolate(t, [nextT - 0.06, nextT], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const c = col ?? '#ffffff';
  return (
    <div style={{display: 'flex', gap: 14, opacity: 0.95 * out}}>
      {text.split(' ').map((w, k) => {
        const s = spring({frame: f - Math.round(st * fps) - k * 3, fps, config: {damping: 9, stiffness: 260, mass: 0.5}});
        return <span key={k} style={{display: 'inline-block', fontFamily: 'Benzin', fontSize: 46, color: c, textShadow: shadow(c), opacity: Math.min(1, s * 2),
          transform: `translateY(${(1 - s) * 22}px) scale(${0.88 + 0.12 * s})`}}>{w}</span>;
      })}
    </div>
  );
};

export const CLIP01_FRAMES = 595;
export const Clip01: React.FC = () => {
  loadBenzin();
  const f = useCurrentFrame();
  const show = interpolate(f, [0, 10, CLIP01_FRAMES - 14, CLIP01_FRAMES - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Video src={staticFile('clips/clip01.mp4')} />
      <div style={{position: 'absolute', left: X, top: Y, display: 'flex', alignItems: 'center', gap: 20}}>
        <VoicePill show={show} />
        <Words />
      </div>
    </AbsoluteFill>
  );
};
