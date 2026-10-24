// Экраны CS2 для «Миллион за катку»: победа с выплатой, баннер «Вышел Counter-Strike 3», монитор-вставка.
import React from 'react';
import {MenuView, MenuProps, CS} from '../tilt/CSScreen';

const T: React.FC<{x: number; y: number; s: number; c?: string; a?: 'start' | 'middle' | 'end'; children: React.ReactNode; ls?: number; o?: number}> = ({x, y, s, c = '#fff', a = 'middle', children, ls = 0, o = 1}) => (
  <text x={x} y={y} fontSize={s} fill={c} fontFamily="Montserrat" fontWeight={900} textAnchor={a} letterSpacing={ls} opacity={o}
    style={{paintOrder: 'stroke'}} stroke="rgba(0,0,0,0.5)" strokeWidth={s * 0.06}>{children}</text>
);

export const VictoryView: React.FC<{appear: number; pay: number; n: number}> = ({appear, pay, n}) => (
  <g>
    <defs>
      <radialGradient id="vv-bg" cx="0.5" cy="0.4" r="0.8">
        <stop offset="0" stopColor="#1f4a2a" />
        <stop offset="1" stopColor="#07110a" />
      </radialGradient>
    </defs>
    <rect width={1600} height={900} fill="url(#vv-bg)" />
    {[...Array(14)].map((_, i) => (
      <rect key={i} x={800 - 4} y={-200} width={8} height={700} fill="#4cff6a" opacity={0.06} transform={`rotate(${i * 26 + appear * 20} 800 330)`} />
    ))}
    <g opacity={appear} transform={`translate(800, 330) scale(${0.8 + 0.2 * appear})`}>
      <T x={0} y={0} s={150} c={CS.green} ls={8}>ПОБЕДА</T>
      <T x={-90} y={140} s={90} a="end" c={CS.ct}>13</T>
      <T x={0} y={130} s={70} c="#888">:</T>
      <T x={90} y={140} s={90} a="start" c={CS.t}>{[9, 7, 11, 5, 8, 10, 6, 12, 4][(n - 1) % 9]}</T>
      <T x={0} y={210} s={34} c="#cfe9d5">КАТКА №{n} · MVP: ЛЁХА</T>
    </g>
    {pay > 0 && (
      <g opacity={pay} transform={`translate(800, 700) scale(${0.7 + 0.3 * pay})`}>
        <rect x={-380} y={-70} width={760} height={120} rx={20} fill="rgba(255,210,63,0.15)" stroke="#ffd23f" strokeWidth={5} />
        <T x={0} y={14} s={72} c="#ffd23f">+1 000 000 ₽</T>
      </g>
    )}
  </g>
);

export const CS3Banner: React.FC<{p: number; pulse: number}> = ({p, pulse}) => (
  <g opacity={Math.min(1, p * 2)}>
    <rect width={1600} height={900} fill="rgba(0,0,0,0.55)" />
    <defs>
      <linearGradient id="cs3-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff8a1f" />
        <stop offset="1" stopColor="#b8320c" />
      </linearGradient>
    </defs>
    <g transform={`translate(800, 450) scale(${(0.7 + 0.3 * p) * (1 + pulse * 0.03)})`}>
      <rect x={-640} y={-260} width={1280} height={520} rx={26} fill="url(#cs3-g)" stroke="#fff" strokeWidth={6} />
      <rect x={-600} y={-220} width={170} height={56} rx={12} fill="#fff" />
      <T x={-515} y={-180} s={34} c="#b8320c">НОВОЕ</T>
      <T x={0} y={-60} s={44} c="#ffe7cf" ls={6}>ВЫШЛА НОВАЯ ЧАСТЬ</T>
      <T x={-90} y={70} s={96} ls={3}>COUNTER-STRIKE</T>
      <T x={540} y={96} s={190} c="#1b1b1b">3</T>
      <rect x={-180} y={130} width={360} height={90} rx={16} fill="#1b1b1b" />
      <T x={0} y={190} s={46}>ОБНОВИТЬ</T>
    </g>
  </g>
);

// монитор-вставка на тёмном фоне подвала: экран 1000×562
export const MonitorInsert: React.FC<{children: React.ReactNode; s?: number; glow?: string}> = ({children, s = 1, glow = '#7fb2ff'}) => (
  <>
    <div style={{position: 'absolute', inset: 0, height: 1180, background: `radial-gradient(ellipse at 50% 48%, ${glow}33, #0d0e12 70%)`}} />
    <div style={{position: 'absolute', left: 540, top: 560, width: 1040, height: 602, transform: `translate(-50%, -50%) scale(${s})`, background: '#0a0b0f',
      border: '8px solid #2a2d36', borderRadius: 22, boxShadow: `0 0 90px ${glow}55, 0 30px 60px rgba(0,0,0,0.7)`, overflow: 'hidden'}}>
      <svg width={1024} height={576} viewBox="0 0 1600 900" style={{display: 'block', margin: 5}}>{children}</svg>
    </div>
  </>
);

export const Menu: React.FC<MenuProps & {cs3?: number; pulse?: number}> = ({cs3 = 0, pulse = 0, ...m}) => (
  <g>
    <MenuView rating={['ELO 1 250', '▲ 25']} {...m} />
    {cs3 > 0 && <CS3Banner p={cs3} pulse={pulse} />}
  </g>
);
