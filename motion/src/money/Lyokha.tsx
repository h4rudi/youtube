// Лёха v2 — детализированный персонаж в стиле «мультяшного сторителлинга»: контур, большие глаза, мешки под глазами,
// чёлка, худи и наушники на шее (геймер). Эмоции переключаются пропсами.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFonts} from '../theme';

export type Mood = 'neutral' | 'worried' | 'shocked' | 'happy' | 'tired';

const INK = '#15131a';
export const L = {skin: '#e9b48e', skinS: '#d49b76', hair: '#1c1a20', hood: '#2c313d', hoodS: '#232733', hoodL: '#3a4152', eye: '#fbfbf7'};

const brows: Record<Mood, [number, number, number, number]> = {
  // [внутренний подъём, наружный подъём, левый y, наклон] — грубые параметры
  neutral: [0, 0, 0, 0], worried: [16, -6, 0, 1], shocked: [14, 10, -14, 0], happy: [4, 6, -6, 0], tired: [-4, -2, 6, 0],
};

export const LyokhaHead: React.FC<{mood?: Mood; look?: number; blink?: number; sweat?: boolean; tears?: number; light?: string; lightAmt?: number; age?: number; hair?: string}> = ({mood = 'neutral', look = 0, blink = 0, sweat = false, tears = 0, light, lightAmt = 0, age = 0, hair = L.hair}) => {
  const [bi, bo, by] = brows[mood];
  const pupil = mood === 'shocked' ? 9 : 14;
  const lid = Math.max(blink, mood === 'tired' ? 0.35 : 0);
  const px = look * 14;
  const eyeY = 18;
  const mouth = {
    neutral: 'M-26 108 Q0 102 26 108',
    worried: 'M-28 112 Q0 98 28 112',
    shocked: '',
    happy: 'M-34 100 Q0 128 34 100',
    tired: 'M-24 110 Q0 106 24 110',
  }[mood];
  return (
    <g>
      <defs>
        <clipPath id="ly-face"><path d="M-128 -40 C-132 -150 132 -150 128 -40 L122 70 C112 150 60 186 0 188 C-60 186 -112 150 -122 70 Z" /></clipPath>
      </defs>
      {/* шея */}
      <path d="M-46 150 L-50 230 L50 230 L46 150 Z" fill={L.skinS} stroke={INK} strokeWidth={5} />
      {/* уши */}
      <ellipse cx={-130} cy={30} rx={24} ry={36} fill={L.skin} stroke={INK} strokeWidth={5} />
      <ellipse cx={130} cy={30} rx={24} ry={36} fill={L.skin} stroke={INK} strokeWidth={5} />
      <path d="M-136 20 Q-128 32 -134 44" stroke={INK} strokeWidth={3} fill="none" />
      <path d="M136 20 Q128 32 134 44" stroke={INK} strokeWidth={3} fill="none" />
      {/* лицо */}
      <path d="M-128 -40 C-132 -150 132 -150 128 -40 L122 70 C112 150 60 186 0 188 C-60 186 -112 150 -122 70 Z" fill={L.skin} stroke={INK} strokeWidth={6} />
      <g clipPath="url(#ly-face)">
        {/* тень от волос и щёк */}
        <path d="M-140 -90 Q0 -50 140 -90 L140 -66 Q0 -26 -140 -66 Z" fill={L.skinS} opacity={0.55} />
        <path d="M60 60 Q130 80 120 160 L160 160 L160 40 Z" fill={L.skinS} opacity={0.45} />
        {light && <rect x={-200} y={-200} width={400} height={400} fill={light} opacity={lightAmt} style={{mixBlendMode: 'multiply'}} />}
        {/* морщины для «постаревшей» версии */}
        {age > 0 && <g stroke={INK} strokeWidth={3} fill="none" opacity={age}><path d="M-60 -50 Q0 -60 60 -50 M-50 -36 Q0 -44 50 -36 M-70 70 Q-60 96 -66 116 M70 70 Q60 96 66 116" /></g>}
      </g>
      {/* мешки под глазами */}
      <path d="M-86 58 Q-56 72 -26 58" stroke={INK} strokeWidth={3.5} fill="none" opacity={0.75} />
      <path d="M26 58 Q56 72 86 58" stroke={INK} strokeWidth={3.5} fill="none" opacity={0.75} />
      {/* глаза */}
      {[-56, 56].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={eyeY} r={34} fill={L.eye} stroke={INK} strokeWidth={5.5} />
          <circle cx={x + px} cy={eyeY + 6} r={pupil} fill={INK} />
          <circle cx={x + px - 5} cy={eyeY} r={4.5} fill="#fff" />
          {lid > 0 && <path d={`M${x - 36} ${eyeY - 36} H${x + 36} V${eyeY - 36 + 72 * lid} H${x - 36} Z`} fill={L.skin} stroke={INK} strokeWidth={5} />}
        </g>
      ))}
      {/* брови */}
      <path d={`M-96 ${-34 + by + bo} Q-66 ${-46 + by} -28 ${-34 + by - bi}`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d={`M96 ${-34 + by + bo} Q66 ${-46 + by} 28 ${-34 + by - bi}`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
      {/* нос */}
      <path d="M6 30 Q-12 66 0 76 Q10 80 18 74" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* рот */}
      {mood === 'shocked'
        ? <ellipse cx={0} cy={112} rx={18} ry={24} fill="#5a1f22" stroke={INK} strokeWidth={5} />
        : <path d={mouth} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
      {/* волосы: шапка + рваная чёлка */}
      <path d="M-146 -10 C-170 -140 -80 -196 10 -192 C110 -190 170 -130 146 -10 L132 -40 L120 -76 C80 -66 40 -84 20 -96 L4 -60 L-18 -96 C-50 -80 -70 -74 -96 -86 L-112 -50 L-132 -64 Z"
        fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-40 -170 Q10 -150 70 -168" stroke="#34313b" strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* пот и слёзы */}
      {sweat && <path d="M118 -40 Q132 -18 124 -6 Q112 4 106 -10 Q104 -22 118 -40 Z" fill="#bfe3ff" stroke={INK} strokeWidth={3.5} />}
      {tears > 0 && [-56, 56].map((x, i) => (
        <path key={i} d={`M${x + 14} ${eyeY + 34} Q${x + 22} ${eyeY + 34 + 50 * tears} ${x + 12} ${eyeY + 40 + 60 * tears}`} stroke="#9fd0ff" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
      ))}
    </g>
  );
};

// Бюст: голова + худи + наушники на шее
export const LyokhaBust: React.FC<{mood?: Mood; look?: number; blink?: number; sweat?: boolean; tears?: number; light?: string; lightAmt?: number; age?: number; hair?: string; hood?: string}> = ({hood = L.hood, ...p}) => (
  <g>
    {/* худи */}
    <path d="M-230 520 L-210 320 Q-200 250 -120 228 L120 228 Q200 250 210 320 L230 520 Z" fill={hood} stroke={INK} strokeWidth={6} />
    <path d="M-120 228 Q0 300 120 228 L104 214 Q0 270 -104 214 Z" fill={L.hoodL} stroke={INK} strokeWidth={5} />
    <path d="M-40 290 L-46 400 M40 290 L46 400" stroke="#cfd3dc" strokeWidth={6} strokeLinecap="round" />
    <circle cx={-46} cy={404} r={7} fill="#cfd3dc" /><circle cx={46} cy={404} r={7} fill="#cfd3dc" />
    <path d="M-160 330 L-170 520 M160 330 L170 520" stroke={L.hoodS} strokeWidth={8} />
    <g transform="translate(0, -30)">
      <LyokhaHead {...p} />
    </g>
    {/* наушники на шее */}
    <path d="M-104 216 Q0 280 104 216" stroke="#0e0f14" strokeWidth={16} fill="none" strokeLinecap="round" />
    <rect x={-138} y={186} width={46} height={66} rx={18} fill="#0e0f14" stroke={INK} strokeWidth={4} transform="rotate(-18 -115 219)" />
    <rect x={92} y={186} width={46} height={66} rx={18} fill="#0e0f14" stroke={INK} strokeWidth={4} transform="rotate(18 115 219)" />
    <rect x={-128} y={202} width={6} height={36} rx={3} fill="#44e0ff" transform="rotate(-18 -115 219)" />
    <rect x={122} y={202} width={6} height={36} rx={3} fill="#44e0ff" transform="rotate(18 115 219)" />
  </g>
);

// Лист персонажа для согласования внешности
export const LyokhaSheet: React.FC = () => {
  loadFonts();
  const moods: [Mood, string, Partial<React.ComponentProps<typeof LyokhaBust>>][] = [
    ['neutral', 'обычный', {}],
    ['worried', 'переживает', {sweat: true, look: -0.6}],
    ['shocked', 'в шоке', {}],
    ['happy', 'победа', {}],
    ['tired', 'девятая катка', {sweat: true, light: '#ff5560', lightAmt: 0.18}],
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #22262f, #0b0c10 75%)'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <text x={960} y={110} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={64} fill="#fff">ЛЁХА — НОВЫЙ ВИД</text>
        {moods.map(([m, label, extra], i) => (
          <g key={m} transform={`translate(${210 + i * 375}, 560) scale(0.62)`}>
            <LyokhaBust mood={m} {...extra} />
            <text x={0} y={640} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={56} fill="#ffd23f">{label.toUpperCase()}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
