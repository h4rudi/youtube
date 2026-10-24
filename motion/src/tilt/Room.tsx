// Комната Андрея: вид из-за спины на монитор с CS2, ночное окно, настенные часы, лампа; сцена в кровати.
import React from 'react';
import {CSScreen, ScreenMode, GameProps, MenuProps} from './CSScreen';

export const P = {
  wall: '#111830', wall2: '#0b1022', desk: '#1a2236', deskTop: '#253049', line: '#3a4a75', skin: '#e8b48f',
  hair: '#1c1a22', hood: '#2b3a66', hoodL: '#3d5190', chair: '#161b28', chairAcc: '#d8343f', glowGame: '#ffcf8a', glowRed: '#ff3344',
};
export const W = 1080, H = 1180; // область картинки над субтитрами

export const MON = {x: 210, y: 360, w: 660, h: 371}; // экран монитора в координатах комнаты

export type RoomProps = {
  mode: ScreenMode;
  game?: GameProps;
  menu?: MenuProps;
  defeat?: {appear?: number; score?: [number, number]; elo?: number};
  clock?: string;
  clockGlow?: number;
  lamp?: number; // 0..1 настольная лампа
  power?: number; // 0..1 монитор включён
  tint?: number; // 0..1 красный оттенок (злость)
  lean?: number; // 0..1 наклон к монитору
  stand?: number; // 0..1 встал из-за стола
  click?: number; // импульс клика мышью
  f: number;
};

const glowColor = (mode: ScreenMode, tint: number) => (tint > 0.5 || mode === 'defeat' ? P.glowRed : mode === 'menu' ? '#ffb070' : P.glowGame);

export const Room: React.FC<RoomProps> = ({mode, game, menu, defeat, clock = '02:00', clockGlow = 0, lamp = 1, power = 1, tint = 0, lean = 0, stand = 0, click = 0, f}) => {
  const g = glowColor(mode, tint);
  const flick = 0.9 + 0.1 * Math.sin(f / 7) * Math.sin(f / 13);
  const headY = 690 + lean * 30 - stand * 330;
  const headX = 540;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="r-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.wall2} />
          <stop offset="1" stopColor={P.wall} />
        </linearGradient>
        <radialGradient id="r-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={g} stopOpacity={0.55 * power * flick} />
          <stop offset="1" stopColor={g} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="r-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={0.45 * lamp} />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="r-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={g} stopOpacity={0.9 * power} />
          <stop offset="1" stopColor={g} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#r-wall)" />
      {/* окно с ночным городом */}
      <g transform="translate(880, 120)">
        <rect width={180} height={330} fill="#0a1430" stroke={P.line} strokeWidth={8} />
        <circle cx={130} cy={60} r={20} fill="#dfe6ff" opacity={0.85} />
        {[[0, 220, 40], [38, 180, 30], [70, 240, 34], [106, 200, 40], [146, 230, 34]].map(([x, y, w], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={330 - y} fill="#060b1c" />
            {[0, 1, 2, 3].map((k) => ((i + k + Math.floor(f / 90)) % 3 === 0 ? <rect key={k} x={x + 8} y={y + 16 + k * 22} width={7} height={9} fill="#f3c86a" opacity={0.8} /> : null))}
          </g>
        ))}
        <line x1={90} y1={0} x2={90} y2={330} stroke={P.line} strokeWidth={6} />
        <line x1={0} y1={165} x2={180} y2={165} stroke={P.line} strokeWidth={6} />
      </g>
      {/* настенные часы */}
      <g transform="translate(60, 150)" opacity={clock ? 1 : 0}>
        <rect width={240} height={110} rx={14} fill="#05070e" stroke={P.line} strokeWidth={5} />
        {clockGlow > 0 && <rect x={-10} y={-10} width={260} height={130} rx={20} fill="none" stroke="#ff3344" strokeWidth={6} opacity={clockGlow} />}
        <text x={120} y={82} textAnchor="middle" fontFamily="Russo One" fontSize={70} fill="#ff3344" style={{filter: 'drop-shadow(0 0 8px #ff3344)'}}>{clock}</text>
      </g>
      {/* свечение от монитора на стене */}
      <ellipse cx={MON.x + MON.w / 2} cy={MON.y + MON.h / 2} rx={620} ry={460} fill="url(#r-glow)" />
      {/* лампа */}
      <g transform="translate(70, 520)">
        <path d="M60 280 L60 120 L150 40" stroke="#2c3550" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M120 20 L200 40 L180 90 L110 60 Z" fill="#2c3550" />
        <path d="M160 70 L60 290 L330 290 Z" fill="url(#r-lamp)" />
        <rect x={20} y={274} width={90} height={14} rx={6} fill="#2c3550" />
      </g>
      {/* стол */}
      <rect x={0} y={800} width={W} height={34} fill={P.deskTop} />
      <rect x={0} y={834} width={W} height={400} fill={P.desk} />
      {/* монитор */}
      <rect x={MON.x - 16} y={MON.y - 16} width={MON.w + 32} height={MON.h + 32} rx={14} fill="#0a0d16" stroke="#2a3350" strokeWidth={4} />
      <svg x={MON.x} y={MON.y} width={MON.w} height={MON.h} viewBox="0 0 1600 900">
        <CSScreen mode={mode} game={game} menu={menu} defeat={defeat} tint={tint} power={power} />
      </svg>
      <rect x={MON.x + MON.w / 2 - 30} y={MON.y + MON.h + 16} width={60} height={56} fill="#141a2a" />
      <rect x={MON.x + MON.w / 2 - 110} y={792} width={220} height={14} rx={6} fill="#141a2a" />
      {/* мышь */}
      <g transform={`translate(${stand > 0.3 ? 860 : 830}, ${812 + click * 3})`}>
        <ellipse rx={30} ry={18} fill="#0e121c" stroke={click > 0 ? '#ff4d5a' : '#3a4568'} strokeWidth={3} />
      </g>
      {/* кресло */}
      <g transform={`translate(${headX}, ${stand * 60}) scale(${1 - stand * 0.08})`}>
        <path d="M-190 1180 L-175 780 Q-170 720 -110 715 L110 715 Q170 720 175 780 L190 1180 Z" fill={P.chair} />
        <path d="M-120 1180 L-112 760 L-92 760 L-100 1180 Z" fill={P.chairAcc} opacity={0.9} />
        <path d="M120 1180 L112 760 L92 760 L100 1180 Z" fill={P.chairAcc} opacity={0.9} />
        <path d="M-175 780 Q-170 720 -110 715 L110 715 Q170 720 175 780" stroke="url(#r-rim)" strokeWidth={6} fill="none" />
      </g>
      {/* Андрей со спины */}
      <g transform={`translate(${headX}, ${headY})`}>
        {stand > 0 && (
          <g opacity={Math.min(1, stand * 2)}>
            <path d="M-150 120 Q-150 60 -90 50 L90 50 Q150 60 150 120 L140 420 L-140 420 Z" fill={P.hood} />
            <rect x={-120} y={410} width={100} height={260} fill="#1d2233" />
            <rect x={20} y={410} width={100} height={260} fill="#1d2233" />
          </g>
        )}
        {/* плечи и руки к столу */}
        <path d={`M-165 190 Q-170 110 -100 95 L100 95 Q170 110 165 190 Z`} fill={P.hood} />
        {stand < 0.3 && (
          <>
            <path d="M-150 150 Q-210 120 -230 115" stroke={P.hood} strokeWidth={46} strokeLinecap="round" fill="none" />
            <path d="M150 150 Q240 130 280 122" stroke={P.hood} strokeWidth={46} strokeLinecap="round" fill="none" />
          </>
        )}
        <path d="M-100 95 Q0 80 100 95" stroke="url(#r-rim)" strokeWidth={8} fill="none" />
        {/* капюшон */}
        <path d="M-80 110 Q0 150 80 110 L70 90 Q0 120 -70 90 Z" fill={P.hoodL} />
        {/* шея и голова */}
        <rect x={-26} y={40} width={52} height={60} fill="#c8946f" />
        <circle cx={0} cy={0} r={74} fill={P.hair} />
        <path d="M-74 -5 A74 74 0 0 1 74 -5" stroke="url(#r-rim)" strokeWidth={6} fill="none" />
        {/* уши под наушниками */}
        <ellipse cx={-76} cy={10} rx={12} ry={20} fill={P.skin} />
        <ellipse cx={76} cy={10} rx={12} ry={20} fill={P.skin} />
        {/* наушники */}
        <path d="M-78 0 Q-82 -95 0 -98 Q82 -95 78 0" stroke="#0b0d14" strokeWidth={16} fill="none" />
        <rect x={-100} y={-24} width={34} height={64} rx={14} fill="#0b0d14" />
        <rect x={66} y={-24} width={34} height={64} rx={14} fill="#0b0d14" />
        <rect x={-96} y={-8} width={6} height={32} rx={3} fill={tint > 0.5 ? '#ff3344' : '#44e0ff'} />
        <rect x={90} y={-8} width={6} height={32} rx={3} fill={tint > 0.5 ? '#ff3344' : '#44e0ff'} />
      </g>
      {/* затемнение без лампы */}
      <rect width={W} height={H} fill="#000" opacity={(1 - lamp) * 0.35 + (1 - power) * 0.25} />
    </svg>
  );
};

// Сцена в кровати (вид сбоку): тёмная комната, тумбочка с телефоном
export const BedScene: React.FC<{f: number; breathe: number; phone: number; buzz: number}> = ({f, breathe, phone, buzz}) => {
  const jitter = buzz > 0 ? Math.sin(f * 2.4) * 4 * buzz : 0;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="b-phone" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fd0ff" stopOpacity={0.6 * phone} />
          <stop offset="1" stopColor="#9fd0ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#070a16" />
      {/* окно с луной */}
      <g transform="translate(140, 170)">
        <rect width={300} height={260} fill="#0b1532" stroke="#26324f" strokeWidth={8} />
        <circle cx={220} cy={70} r={30} fill="#dfe6ff" opacity={0.7} />
        <line x1={150} y1={0} x2={150} y2={260} stroke="#26324f" strokeWidth={6} />
      </g>
      {/* лунный свет на полу */}
      <path d="M140 430 L440 430 L620 1180 L60 1180 Z" fill="#9fb4ff" opacity={0.05} />
      {/* свечение телефона */}
      <ellipse cx={890} cy={760} rx={340} ry={300} fill="url(#b-phone)" />
      {/* кровать */}
      <rect x={60} y={800} width={700} height={70} rx={14} fill="#1c2540" />
      <rect x={60} y={870} width={700} height={160} fill="#121a30" />
      <rect x={40} y={660} width={40} height={380} rx={10} fill="#1a2238" />
      {/* подушка и голова */}
      <ellipse cx={170} cy={790} rx={100} ry={30} fill="#3a4770" />
      <g transform={`translate(190, ${758 - breathe * 2})`}>
        <circle r={46} fill={P.skin} />
        <path d="M-46 -6 A46 46 0 0 1 40 -24 Q20 -40 -10 -44 Q-40 -36 -46 -6 Z" fill={P.hair} />
        <path d="M14 0 Q22 4 30 0" stroke="#5a3a2a" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      {/* одеяло с дыханием */}
      <path d={`M230 ${800 - breathe * 14} Q420 ${740 - breathe * 22} 740 ${790 - breathe * 6} L760 830 L230 830 Z`} fill="#2f3f73" />
      <path d={`M230 ${800 - breathe * 14} Q420 ${740 - breathe * 22} 740 ${790 - breathe * 6}`} stroke="#4a5d9e" strokeWidth={6} fill="none" />
      {/* выдох */}
      {breathe > 0 && (
        <g opacity={Math.sin(Math.min(1, breathe) * Math.PI) * 0.6} transform={`translate(${250 + breathe * 60}, ${730 - breathe * 30})`}>
          <circle r={14 + breathe * 18} fill="#c8d6ff" opacity={0.4} />
          <circle cx={30} cy={-12} r={10 + breathe * 10} fill="#c8d6ff" opacity={0.3} />
        </g>
      )}
      {/* тумбочка и телефон */}
      <rect x={800} y={800} width={200} height={240} rx={8} fill="#161e34" />
      <rect x={812} y={850} width={176} height={6} fill="#0c1222" />
      <g transform={`translate(${900 + jitter}, 790)`}>
        <rect x={-50} y={-12} width={100} height={18} rx={6} fill={phone > 0.1 ? '#cfe6ff' : '#1a1f2e'} />
        {buzz > 0 && (
          <g stroke="#cfe6ff" strokeWidth={4} strokeLinecap="round" opacity={buzz}>
            <path d="M-70 -20 l-12 -10 M-70 4 l-14 4 M70 -20 l12 -10 M70 4 l14 4" />
          </g>
        )}
      </g>
    </svg>
  );
};

// Лицо-аватар для сцены «двое злых»
export const Avatar: React.FC<{x: number; y: number; r: number; name: string; anger: number; hair?: string; color: string}> = ({x, y, r, name, anger, hair = P.hair, color}) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle r={r + 14} fill={color} opacity={0.25 + anger * 0.35} />
    <circle r={r} fill={P.skin} />
    <path d={`M${-r} ${-r * 0.1} A${r} ${r} 0 0 1 ${r} ${-r * 0.1} Q${r * 0.6} ${-r * 0.75} 0 ${-r * 0.8} Q${-r * 0.6} ${-r * 0.75} ${-r} ${-r * 0.1} Z`} fill={hair} />
    {/* брови сведены от злости */}
    <path d={`M${-r * 0.55} ${-r * 0.12 - anger * 4} L${-r * 0.15} ${r * 0.02 + anger * 10}`} stroke="#2a1a14" strokeWidth={r * 0.1} strokeLinecap="round" />
    <path d={`M${r * 0.55} ${-r * 0.12 - anger * 4} L${r * 0.15} ${r * 0.02 + anger * 10}`} stroke="#2a1a14" strokeWidth={r * 0.1} strokeLinecap="round" />
    <circle cx={-r * 0.32} cy={r * 0.15} r={r * 0.08} fill="#2a1a14" />
    <circle cx={r * 0.32} cy={r * 0.15} r={r * 0.08} fill="#2a1a14" />
    <path d={`M${-r * 0.3} ${r * 0.55} Q0 ${r * (0.55 - anger * 0.25)} ${r * 0.3} ${r * 0.55}`} stroke="#2a1a14" strokeWidth={r * 0.08} fill="none" strokeLinecap="round" />
    {/* наушники */}
    <path d={`M${-r * 1.02} 0 Q${-r * 1.05} ${-r * 1.3} 0 ${-r * 1.28} Q${r * 1.05} ${-r * 1.3} ${r * 1.02} 0`} stroke="#0b0d14" strokeWidth={r * 0.14} fill="none" />
    <rect x={-r * 1.18} y={-r * 0.3} width={r * 0.34} height={r * 0.7} rx={r * 0.14} fill="#0b0d14" />
    <rect x={r * 0.84} y={-r * 0.3} width={r * 0.34} height={r * 0.7} rx={r * 0.14} fill="#0b0d14" />
    <text y={r + 70} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#fff">{name}</text>
  </g>
);
