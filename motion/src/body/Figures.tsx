// Фигуры ролика «8 часов в CS2»: Лёха в профиль за столом (осанка, зоны тела), глаз, запястье в разрезе.
import React from 'react';
import {CSScreen, GameProps} from '../tilt/CSScreen';
import {P, W, H} from '../tilt/Room';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pt = (a: [number, number], b: [number, number], t: number): [number, number] => [mix(a[0], b[0], t), mix(a[1], b[1], t)];

export type Zones = {eyes?: number; neck?: number; back?: number; wrist?: number; legs?: number};

// Красное пульсирующее пятно на проблемной зоне
const Hot: React.FC<{x: number; y: number; r: number; v: number; f: number; color?: string}> = ({x, y, r, v, f, color = '#ff3344'}) =>
  v > 0 ? (
    <g opacity={v}>
      <circle cx={x} cy={y} r={r * (1.15 + 0.15 * Math.sin(f / 4))} fill={color} opacity={0.28} />
      <circle cx={x} cy={y} r={r * 0.6} fill={color} opacity={0.45} />
    </g>
  ) : null;

export type SideProps = {
  f: number;
  forward?: number; // 0 — ровная спина, 1 — голова и плечи ушли к монитору
  zones?: Zones;
  daylight?: number;
  clock?: string;
  game?: GameProps;
  bottle?: number; // 0..1 бутылка на столе
  bottleLevel?: number;
  guides?: {eye?: number; elbow?: number; wrist?: number}; // правильная посадка: зелёные подсказки
  neckLoad?: number; // 0..1 стрелка нагрузки на шею
};

export const SideBody: React.FC<SideProps> = ({f, forward = 0, zones = {}, daylight = 0, clock = '17:00', game, bottle = 0, bottleLevel = 1, guides = {}, neckLoad = 0}) => {
  const hip: [number, number] = [380, 760];
  const shoulder = pt([395, 490], [470, 515], forward);
  const head = pt([420, 385], [560, 440], forward);
  const elbow = pt([470, 650], [540, 660], forward);
  const hand: [number, number] = [700, 706];
  const knee: [number, number] = [600, 768];
  const foot: [number, number] = [610, 1040];
  // спина: при сутулости выгибается дугой
  const backCtrl = pt([360, 620], [300, 600], forward);
  const back = `M${hip[0]} ${hip[1]} Q${backCtrl[0]} ${backCtrl[1]} ${shoulder[0]} ${shoulder[1]}`;
  const eye: [number, number] = [head[0] + 40, head[1] - 6];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sb-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.wall2} />
          <stop offset="1" stopColor={P.wall} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sb-wall)" />
      {daylight > 0 && <rect width={W} height={H} fill="#4a6aa8" opacity={daylight * 0.35} />}
      {/* окно */}
      <g transform="translate(70, 140)">
        <rect width={220} height={260} fill="#0a1430" stroke={P.line} strokeWidth={8} />
        <circle cx={160} cy={60} r={20} fill="#dfe6ff" opacity={0.8} />
        {daylight > 0 && <rect width={220} height={260} fill="#86bdea" opacity={daylight} />}
        {daylight > 0 && <circle cx={70} cy={70} r={28} fill="#ffe08a" opacity={daylight} />}
        <rect x={0} y={170} width={60} height={90} fill="#060b1c" /><rect x={70} y={140} width={50} height={120} fill="#060b1c" /><rect x={140} y={190} width={80} height={70} fill="#060b1c" />
        <line x1={110} y1={0} x2={110} y2={260} stroke={P.line} strokeWidth={6} />
      </g>
      {/* часы */}
      <g transform="translate(800, 255)" opacity={clock ? 1 : 0}>
        <rect width={200} height={92} rx={12} fill="#05070e" stroke={P.line} strokeWidth={5} />
        <text x={100} y={68} textAnchor="middle" fontFamily="Russo One" fontSize={58} fill="#ff3344" style={{filter: 'drop-shadow(0 0 8px #ff3344)'}}>{clock}</text>
      </g>
      {/* пол */}
      <rect x={0} y={1050} width={W} height={130} fill="#0a0e1c" />
      {/* стол и монитор */}
      <rect x={620} y={720} width={460} height={24} fill={P.deskTop} />
      <rect x={1010} y={744} width={30} height={306} fill={P.desk} />
      <rect x={660} y={744} width={30} height={306} fill={P.desk} />
      <rect x={850} y={640} width={26} height={80} fill="#141a2a" />
      <rect x={800} y={712} width={126} height={12} rx={5} fill="#141a2a" />
      <rect x={692} y={432} width={356} height={212} rx={10} fill="#0a0d16" stroke="#2a3350" strokeWidth={4} />
      <svg x={700} y={440} width={340} height={191} viewBox="0 0 1600 900">
        <CSScreen mode="game" game={game ?? {bob: f}} />
      </svg>
      <ellipse cx={710} cy={712} rx={30} ry={10} fill="#0e121c" stroke="#3a4568" strokeWidth={3} />
      {bottle > 0 && (
        <g transform="translate(980, 718)" opacity={Math.min(1, bottle * 2)}>
          <rect x={-22} y={-120} width={44} height={120} rx={12} fill="rgba(160,210,255,0.15)" stroke="#9fd0ff" strokeWidth={4} />
          <rect x={-18} y={-116 + 112 * (1 - bottleLevel)} width={36} height={112 * bottleLevel} rx={9} fill="#4aa8ff" opacity={0.75} />
          <rect x={-12} y={-142} width={24} height={24} rx={5} fill="#2a7de1" />
        </g>
      )}
      {/* кресло */}
      <path d="M250 790 L500 790 L500 818 L250 818 Z" fill={P.chair} />
      <path d={`M232 800 L262 420 L310 420 L292 800 Z`} fill={P.chair} />
      <path d="M268 430 L282 430 L268 790 L254 790 Z" fill={P.chairAcc} />
      <rect x={365} y={818} width={20} height={170} fill={P.chair} />
      <path d="M290 1020 L460 1020" stroke={P.chair} strokeWidth={16} strokeLinecap="round" />
      <circle cx={295} cy={1036} r={14} fill="#0b0d14" /><circle cx={455} cy={1036} r={14} fill="#0b0d14" />
      {/* ноги */}
      <path d={`M${hip[0]} ${hip[1]} L${knee[0]} ${knee[1]} L${foot[0]} ${foot[1]}`} stroke="#1d2233" strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${foot[0] - 20} ${foot[1] + 6} L${foot[0] + 60} ${foot[1] + 6}`} stroke="#0b0d14" strokeWidth={26} strokeLinecap="round" />
      {/* туловище */}
      <path d={back} stroke={P.hood} strokeWidth={130} strokeLinecap="round" fill="none" />
      {/* шея и голова */}
      <path d={`M${shoulder[0] + 10} ${shoulder[1] - 30} L${head[0] - 6} ${head[1] + 50}`} stroke="#c8946f" strokeWidth={44} strokeLinecap="round" />
      <circle cx={head[0]} cy={head[1]} r={66} fill={P.skin} />
      <path d={`M${head[0] - 66} ${head[1] - 4} A66 66 0 0 1 ${head[0] + 58} ${head[1] - 30} Q${head[0] + 20} ${head[1] - 70} ${head[0] - 30} ${head[1] - 64} Q${head[0] - 70} ${head[1] - 40} ${head[0] - 66} ${head[1] - 4} Z`} fill={P.hair} />
      <path d={`M${head[0] - 62} ${head[1]} L${head[0] - 40} ${head[1] + 40}`} stroke={P.hair} strokeWidth={22} strokeLinecap="round" />
      <circle cx={eye[0]} cy={eye[1]} r={7} fill="#2a1a14" />
      <path d={`M${head[0] + 64} ${head[1] + 6} l12 16 l-12 4`} fill={P.skin} />
      {/* наушники */}
      <path d={`M${head[0] - 54} ${head[1] - 30} Q${head[0] - 10} ${head[1] - 92} ${head[0] + 30} ${head[1] - 58}`} stroke="#0b0d14" strokeWidth={14} fill="none" />
      <rect x={head[0] - 30} y={head[1] - 24} width={40} height={60} rx={14} fill="#0b0d14" />
      <rect x={head[0] - 22} y={head[1] - 12} width={6} height={36} rx={3} fill="#44e0ff" />
      {/* рука к мышке */}
      <path d={`M${shoulder[0]} ${shoulder[1] + 10} L${elbow[0]} ${elbow[1]} L${hand[0] - 20} ${hand[1]}`} stroke={P.hoodL} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={hand[0] - 6} cy={hand[1] - 2} r={22} fill={P.skin} />
      {/* зоны */}
      <Hot x={eye[0]} y={eye[1]} r={46} v={zones.eyes ?? 0} f={f} />
      <Hot x={(shoulder[0] + head[0]) / 2} y={(shoulder[1] + head[1]) / 2 + 10} r={60} v={zones.neck ?? 0} f={f} />
      <Hot x={backCtrl[0] + 30} y={backCtrl[1] + 10} r={90} v={zones.back ?? 0} f={f} />
      <Hot x={hand[0] - 30} y={hand[1]} r={44} v={zones.wrist ?? 0} f={f} />
      <Hot x={knee[0] - 10} y={(knee[1] + foot[1]) / 2} r={80} v={zones.legs ?? 0} f={f} />
      {/* нагрузка на шею: стрелка вниз растёт */}
      {neckLoad > 0 && (
        <g transform={`translate(${head[0] - 10}, ${head[1] - 120 - neckLoad * 70})`} opacity={Math.min(1, neckLoad * 3)}>
          <rect x={-14} y={0} width={28} height={40 + neckLoad * 70} fill="#ff3344" />
          <path d={`M-40 ${40 + neckLoad * 70} L40 ${40 + neckLoad * 70} L0 ${90 + neckLoad * 80} Z`} fill="#ff3344" />
        </g>
      )}
      {/* правильная посадка */}
      {(guides.eye ?? 0) > 0 && (
        <g opacity={guides.eye}>
          <line x1={eye[0] + 10} y1={eye[1]} x2={eye[0] + 10 + (690 - eye[0]) * (guides.eye ?? 0)} y2={eye[1] + (450 - eye[1]) * (guides.eye ?? 0)} stroke="#2bd96b" strokeWidth={6} strokeDasharray="14 10" />
        </g>
      )}
      {(guides.elbow ?? 0) > 0 && (
        <g opacity={guides.elbow}>
          <path d={`M${elbow[0]} ${elbow[1] - 60} A60 60 0 0 1 ${elbow[0] + 60} ${elbow[1]}`} stroke="#2bd96b" strokeWidth={8} fill="none" />
          <text x={elbow[0] + 30} y={elbow[1] - 74} fontFamily="Montserrat" fontWeight={900} fontSize={36} fill="#2bd96b">90°</text>
        </g>
      )}
      {(guides.wrist ?? 0) > 0 && (
        <line x1={elbow[0]} y1={elbow[1] + 34} x2={hand[0] + 30} y2={hand[1] + 30} stroke="#2bd96b" strokeWidth={6} opacity={guides.wrist} strokeDasharray="14 10" />
      )}
    </svg>
  );
};

// Большой глаз: моргание и «сухость» (красные сосуды)
export const Eye: React.FC<{blink: number; dry: number; size?: number}> = ({blink, dry, size = 560}) => {
  const lid = 120 * blink;
  return (
    <svg width={size} height={size * 0.5} viewBox="-300 -150 600 300">
      <defs>
        <clipPath id="eye-clip"><path d="M-270 0 Q0 -200 270 0 Q0 200 -270 0 Z" /></clipPath>
      </defs>
      <path d="M-270 0 Q0 -200 270 0 Q0 200 -270 0 Z" fill="#f4f1ea" />
      <g clipPath="url(#eye-clip)">
        {dry > 0 && (
          <g stroke="#e0303c" strokeWidth={4} fill="none" opacity={dry} strokeLinecap="round">
            <path d="M-260 0 C-200 -10 -170 20 -120 10 M-250 30 C-200 40 -160 30 -130 50 M260 -10 C200 0 180 -20 130 -10 M250 30 C210 20 170 40 140 30 M-240 -30 C-190 -40 -160 -20 -130 -30" />
          </g>
        )}
        <circle cx={0} cy={0} r={95} fill="#3d6fb8" />
        <circle cx={0} cy={0} r={95} fill="none" stroke="#1f3f73" strokeWidth={10} />
        <circle cx={0} cy={0} r={42} fill="#0b0d14" />
        <circle cx={-30} cy={-34} r={16} fill="#fff" opacity={0.85} />
        {/* веки */}
        <rect x={-300} y={-160} width={600} height={30 + lid} fill="#e8b48f" />
        <rect x={-300} y={130 - lid} width={600} height={40 + lid} fill="#e8b48f" />
      </g>
      <path d="M-270 0 Q0 -200 270 0 Q0 200 -270 0 Z" fill="none" stroke="#2a1a14" strokeWidth={8} />
      {[-200, -120, -40, 40, 120, 200].map((x, i) => (
        <line key={i} x1={x * 0.95} y1={-(150 - Math.abs(x) * 0.5) * (1 - blink) - 8 * (1 - blink)} x2={x * 1.08} y2={-(178 - Math.abs(x) * 0.5) * (1 - blink) - 20} stroke="#2a1a14" strokeWidth={7} strokeLinecap="round" />
      ))}
    </svg>
  );
};

// Кисть на мышке (вид сверху)
export const HandMouse: React.FC<{click: number; numb: number; wrist: number; f: number}> = ({click, numb, wrist, f}) => (
  <svg width={520} height={340} viewBox="0 0 520 340">
    {/* предплечье */}
    <path d="M0 210 L230 180 L240 270 L0 300 Z" fill="#3d5190" />
    <path d="M220 175 L290 168 L300 262 L232 272 Z" fill="#e8b48f" />
    {/* мышь */}
    <path d="M330 120 C330 60 470 60 470 120 L470 250 C470 320 330 320 330 250 Z" fill="#14182a" stroke="#3a4568" strokeWidth={5} />
    <line x1={400} y1={70} x2={400} y2={150} stroke="#3a4568" strokeWidth={4} />
    <rect x={392} y={95} width={16} height={30} rx={8} fill="#5d6a92" />
    {/* ладонь и пальцы */}
    <path d="M280 165 C300 130 360 120 420 128 L430 260 C380 290 310 280 290 262 Z" fill="#e8b48f" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={360 + i * 34} y={56 + (i === 1 ? -8 : 0) + (i === 0 ? click * 6 : 0)} width={30} height={90} rx={15} fill={numb > 0 ? `rgb(${232}, ${180 - numb * 60}, ${143 - numb * 60})` : '#e8b48f'} />
    ))}
    <rect x={310} y={130} width={26} height={70} rx={13} fill="#e8b48f" transform="rotate(-35 323 165)" />
    {/* покалывание */}
    {numb > 0 && [0, 1, 2, 3, 4].map((k) => {
      const p = ((f + k * 7) % 20) / 20;
      return <circle key={k} cx={360 + (k % 3) * 36 + 14} cy={50 - p * 40} r={5} fill="#ffd23f" opacity={(1 - p) * numb} />;
    })}
    {/* подсветка запястья */}
    {wrist > 0 && <ellipse cx={262} cy={222} rx={50 + 6 * Math.sin(f / 4)} ry={70} fill="#ff3344" opacity={0.35 * wrist} />}
  </svg>
);

// Запястье в разрезе: кости сверху, карпальный канал, сухожилия и нерв
export const WristSection: React.FC<{inflame: number; f: number}> = ({inflame, f}) => {
  const tendons: [number, number][] = [[-90, 40], [-45, 25], [0, 20], [45, 25], [90, 40], [-60, 85], [-15, 75], [30, 80], [75, 90]];
  const swell = 1 + inflame * 0.35;
  const pulse = inflame > 0 ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return (
    <svg width={560} height={560} viewBox="-280 -280 560 560">
      <circle r={265} fill="#e8b48f" stroke="#7d94d8" strokeWidth={8} />
      <circle r={240} fill="#d79d7b" />
      {/* кости запястья дугой */}
      {[-170, -95, -25, 45, 115, 175].map((x, i) => (
        <ellipse key={i} cx={x * 0.95} cy={-120 + Math.abs(x) * 0.35} rx={44} ry={38} fill="#f2e8d2" stroke="#b9a988" strokeWidth={4} />
      ))}
      {/* канал */}
      <path d="M-170 -40 Q0 -110 170 -40 L170 150 L-170 150 Z" fill={`rgba(${120 + inflame * 135}, ${40}, ${50}, ${0.35 + inflame * 0.3 + pulse * 0.15})`} />
      {/* связка-«крыша» канала */}
      <path d="M-185 150 Q0 200 185 150" stroke="#f0f0f0" strokeWidth={22} fill="none" strokeLinecap="round" />
      {tendons.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={20 * swell} fill="#fbfbf6" stroke={inflame > 0.4 ? '#ff6b6b' : '#c9c9c0'} strokeWidth={4} />
      ))}
      {/* нерв — сдавливается */}
      <ellipse cx={0} cy={128} rx={46 * (1 + inflame * 0.25)} ry={30 * (1 - inflame * 0.45)} fill="#ffd23f" stroke={inflame > 0.4 ? '#ff3344' : '#c79a00'} strokeWidth={6} />
    </svg>
  );
};
