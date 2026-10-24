// Экран CS2 в плоской графике (viewBox 1600×900): игра от первого лица, главное меню, поражение.
// Худ держится в «безопасной» зоне x 240–1360, чтобы его не срезало, когда экран кадрируется на весь кадр.
import React from 'react';

export const CS = {
  ct: '#5d9cec', t: '#e8b23a', hud: '#f2f2f2', green: '#4cff6a', red: '#ff3b3b', menuBg: '#0d1117', accept: '#3fbf4a',
  sand: '#d4b07a', sandD: '#b08a55', sandDD: '#8f6c3e', sky1: '#8fb8dc', sky2: '#f0dcb4', wood: '#7a5230',
};
const FONT = 'Montserrat';

export type ChatLine = {name: string; text: string; team?: boolean; color?: string; typed?: number};

export type GameProps = {
  peek?: number; // 0..1 стрейф вправо из-за угла
  enemy?: number; // 0..1 видимость врага
  muzzle?: number; // 0..1 вспышка выстрела врага
  dead?: number; // 0..1 смерть (серый экран)
  killfeed?: boolean;
  chat?: ChatLine[];
  bob?: number; // покачивание оружия, кадры
  hp?: number;
  score?: [number, number];
  timer?: string;
};

const T: React.FC<{x: number; y: number; s: number; c?: string; w?: number; a?: 'start' | 'middle' | 'end'; children: React.ReactNode; o?: number; ls?: number}> = ({x, y, s, c = CS.hud, w = 900, a = 'start', children, o = 1, ls = 0}) => (
  <text x={x} y={y} fontSize={s} fill={c} fontFamily={FONT} fontWeight={w} textAnchor={a} opacity={o} letterSpacing={ls}
    style={{paintOrder: 'stroke'}} stroke="rgba(0,0,0,0.55)" strokeWidth={s * 0.08}>{children}</text>
);

// АК-47 от первого лица: ствол к центру экрана, деревянное цевьё и приклад, изогнутый магазин
const AK: React.FC<{bob: number; recoil?: number}> = ({bob, recoil = 0}) => (
  <g transform={`translate(${1010 + Math.sin(bob / 9) * 6 + recoil * 20}, ${585 + Math.abs(Math.cos(bob / 9)) * 8 + recoil * 30}) rotate(24) scale(0.95)`}>
    {/* ствол и газовая трубка */}
    <rect x={0} y={-7} width={330} height={14} rx={4} fill="#2a2a2e" />
    <rect x={8} y={-24} width={14} height={20} fill="#2a2a2e" />
    <rect x={150} y={-20} width={190} height={12} rx={5} fill="#34343a" />
    {/* цевьё */}
    <path d="M300 -22 L520 -26 L530 26 L300 22 Z" fill={CS.wood} />
    <path d="M300 -22 L520 -26 L522 -12 L300 -10 Z" fill="#94683f" />
    {/* ствольная коробка */}
    <path d="M520 -34 L800 -34 L812 32 L520 30 Z" fill="#26262b" />
    <rect x={540} y={-44} width={200} height={14} rx={6} fill="#1d1d22" />
    {/* магазин — изогнутый вперёд */}
    <path d="M585 28 C590 120 560 190 520 250 L590 280 C640 210 665 120 660 28 Z" fill="#6e4022" />
    <path d="M600 30 C604 115 580 180 548 238 L560 244 C595 185 618 118 616 30 Z" fill="#8a5530" />
    {/* рукоятка */}
    <path d="M760 30 L815 30 L840 150 L790 158 Z" fill="#5c3b20" />
    {/* приклад */}
    <path d="M810 -30 L1180 -10 L1200 110 L1100 120 L815 30 Z" fill={CS.wood} />
    <path d="M810 -30 L1180 -10 L1184 14 L812 -8 Z" fill="#94683f" />
    {/* перчатка на цевье */}
    <path d="M360 -40 C420 -60 470 -40 480 0 C485 40 440 70 380 60 C340 50 330 -20 360 -40 Z" fill="#1c2026" />
    <path d="M370 -30 C410 -44 450 -32 458 -6" stroke="#3a414c" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

const World: React.FC<{peek: number; enemy: number; muzzle: number}> = ({peek, enemy, muzzle}) => {
  const vx = 800 - peek * 260; // точка схода сдвигается при стрейфе
  const near = -peek * 900; // ближний угол уезжает быстрее (параллакс)
  return (
    <g>
      <defs>
        <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={CS.sky1} />
          <stop offset="1" stopColor={CS.sky2} />
        </linearGradient>
        <linearGradient id="cs-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7a26e" />
          <stop offset="1" stopColor="#a8834f" />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#cs-sky)" />
      {/* пол */}
      <path d={`M-200 900 L${vx - 120} 470 L${vx + 120} 470 L1800 900 Z`} fill="url(#cs-floor)" />
      {[0.2, 0.4, 0.6, 0.8].map((k) => (
        <line key={k} x1={-200 + (vx - 120 + 200) * k} y1={900 - 430 * k} x2={1800 - (1800 - vx - 120) * k} y2={900 - 430 * k} stroke="#9c7a48" strokeWidth={3} opacity={0.5} />
      ))}
      {/* дальняя стена с аркой (лонг) */}
      <rect x={vx - 260} y={250} width={520} height={225} fill={CS.sandD} />
      <path d={`M${vx - 70} 475 L${vx - 70} 340 Q${vx} 280 ${vx + 70} 340 L${vx + 70} 475 Z`} fill="#5b4428" />
      {/* враг в арке */}
      <g opacity={enemy} transform={`translate(${vx + 10}, 470)`}>
        <rect x={-16} y={-92} width={32} height={60} rx={10} fill="#3b4a2f" />
        <circle cx={0} cy={-104} r={13} fill="#2c2a26" />
        <rect x={-14} y={-34} width={11} height={34} fill="#2b3323" />
        <rect x={3} y={-34} width={11} height={34} fill="#2b3323" />
        <rect x={-34} y={-78} width={40} height={8} fill="#1b1b1b" />
        {muzzle > 0 && <circle cx={-40} cy={-74} r={10 + muzzle * 12} fill="#ffe28a" opacity={muzzle} />}
      </g>
      {/* левая стена */}
      <path d={`M-200 0 L${vx - 260} 250 L${vx - 260} 475 L-200 960 Z`} fill={CS.sand} />
      <path d={`M-200 0 L${vx - 260} 250 L${vx - 260} 290 L-200 120 Z`} fill={CS.sandD} opacity={0.6} />
      {/* правая стена */}
      <path d={`M1800 0 L${vx + 260} 250 L${vx + 260} 475 L1800 960 Z`} fill={CS.sandD} />
      {/* ящик */}
      <g transform={`translate(${vx + 300 - peek * 120}, 560)`}>
        <rect x={0} y={0} width={190} height={170} fill="#9a7442" />
        <rect x={0} y={0} width={190} height={170} fill="none" stroke="#6b4e2a" strokeWidth={12} />
        <path d="M0 0 L190 170 M190 0 L0 170" stroke="#6b4e2a" strokeWidth={12} />
      </g>
      {/* ближний угол, из-за которого выглядываем */}
      <g transform={`translate(${near}, 0)`}>
        <path d="M1150 -20 L1700 -20 L1700 920 L1150 920 Z" fill="#c09659" />
        <path d="M1150 -20 L1210 -20 L1210 920 L1150 920 Z" fill="#e0bf88" />
      </g>
    </g>
  );
};

const Hud: React.FC<{hp: number; score: [number, number]; timer: string; killfeed: boolean; chat: ChatLine[]}> = ({hp, score, timer, killfeed, chat}) => (
  <g>
    {/* счёт и таймер раунда */}
    <g transform="translate(800, 60)">
      <rect x={-200} y={-38} width={400} height={64} rx={8} fill="rgba(10,12,16,0.72)" />
      <rect x={-200} y={-38} width={110} height={64} rx={8} fill={CS.ct} opacity={0.9} />
      <rect x={90} y={-38} width={110} height={64} rx={8} fill={CS.t} opacity={0.9} />
      <T x={-145} y={8} s={40} a="middle" c="#fff">{score[0]}</T>
      <T x={0} y={10} s={42} a="middle">{timer}</T>
      <T x={145} y={8} s={40} a="middle" c="#1a1a1a">{score[1]}</T>
    </g>
    {/* радар */}
    <g transform="translate(250, 40)">
      <rect width={190} height={190} rx={10} fill="rgba(10,12,16,0.7)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      <path d="M30 160 L30 60 L90 60 L90 30 L160 30 L160 120 L110 120 L110 160 Z" fill="none" stroke="#c9b48a" strokeWidth={10} strokeLinejoin="round" opacity={0.8} />
      <circle cx={70} cy={130} r={8} fill={CS.ct} stroke="#fff" strokeWidth={2} />
      <circle cx={45} cy={150} r={6} fill={CS.ct} opacity={0.8} />
      <path d="M70 130 L58 104 L82 104 Z" fill="#fff" opacity={0.35} />
    </g>
    {/* килфид */}
    {killfeed && (
      <g transform="translate(1360, 120)">
        <rect x={-470} y={-34} width={470} height={52} rx={6} fill="rgba(20,8,8,0.8)" stroke={CS.red} strokeWidth={3} />
        <T x={-450} y={2} s={28} c={CS.t}>Enemy</T>
        <path d="M-320 -14 L-230 -14 L-230 -4 L-260 -4 L-268 10 L-282 10 L-276 -4 L-320 -4 Z" fill="#fff" />
        <circle cx={-198} cy={-8} r={12} fill="none" stroke="#fff" strokeWidth={4} />
        <circle cx={-198} cy={-8} r={3} fill="#fff" />
        <T x={-20} y={2} s={28} c={CS.ct} a="end">Андрей</T>
      </g>
    )}
    {/* чат */}
    <g transform="translate(250, 610)">
      {chat.map((l, i) => {
        const shown = l.typed === undefined ? l.text : l.text.slice(0, Math.floor(l.typed * l.text.length));
        return (
          <g key={i} transform={`translate(0, ${i * 46})`}>
            <rect x={-10} y={-32} width={720} height={42} rx={6} fill="rgba(0,0,0,0.45)" />
            <text x={0} y={0} fontSize={27} fontFamily={FONT} fontWeight={900}>
              <tspan fill="#9fb3c8">{l.team !== false ? '(Команда) ' : ''}</tspan>
              <tspan fill={l.color ?? CS.ct}>{l.name}: </tspan>
              <tspan fill="#fff">{shown}</tspan>
            </text>
          </g>
        );
      })}
    </g>
    {/* здоровье и броня */}
    <g transform="translate(250, 850)">
      <rect x={-10} y={-56} width={300} height={70} rx={8} fill="rgba(10,12,16,0.6)" />
      <path d="M12 -32 h14 v-14 h12 v14 h14 v12 h-14 v14 h-12 v-14 h-14 Z" fill={hp > 30 ? CS.hud : CS.red} />
      <T x={66} y={0} s={48} c={hp > 30 ? CS.hud : CS.red}>{hp}</T>
      <path d="M170 -46 L200 -38 L200 -16 Q200 2 185 8 Q170 2 170 -16 Z" fill={CS.hud} opacity={0.9} transform="translate(0,4)" />
      <T x={210} y={0} s={40}>100</T>
    </g>
    {/* патроны */}
    <g transform="translate(1360, 850)">
      <rect x={-250} y={-56} width={250} height={70} rx={8} fill="rgba(10,12,16,0.6)" />
      <T x={-110} y={0} s={52} a="end">30</T>
      <T x={-20} y={-2} s={32} a="end" o={0.75}>/ 90</T>
    </g>
  </g>
);

const Crosshair = () => (
  <g stroke={CS.green} strokeWidth={4} strokeLinecap="square">
    <line x1={800} y1={430} x2={800} y2={444} /><line x1={800} y1={456} x2={800} y2={470} />
    <line x1={780} y1={450} x2={794} y2={450} /><line x1={806} y1={450} x2={820} y2={450} />
  </g>
);

export const GameView: React.FC<GameProps> = ({peek = 0, enemy = 0, muzzle = 0, dead = 0, killfeed = false, chat = [], bob = 0, hp = 100, score = [3, 7], timer = '1:42'}) => (
  <g>
    <World peek={peek} enemy={enemy} muzzle={muzzle} />
    {dead < 0.5 && <AK bob={bob} />}
    {dead < 0.5 && <Crosshair />}
    {dead > 0 && <rect width={1600} height={900} fill="#808080" opacity={dead} style={{mixBlendMode: 'saturation'}} />}
    {dead > 0 && <rect width={1600} height={900} fill="#000" opacity={dead * 0.35} />}
    {dead > 0 && (
      <g opacity={dead}>
        <rect width={1600} height={900} fill="url(#cs-dead)" />
        <defs>
          <radialGradient id="cs-dead" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#ff0000" stopOpacity={0} />
            <stop offset="1" stopColor="#ff0000" stopOpacity={0.55} />
          </radialGradient>
        </defs>
        <T x={800} y={330} s={64} a="middle" c="#fff" ls={4}>ВЫ УБИТЫ</T>
      </g>
    )}
    <Hud hp={dead > 0.5 ? 0 : hp} score={score} timer={timer} killfeed={killfeed} chat={chat} />
  </g>
);

export type MenuProps = {
  searching?: number; // секунды поиска; <0 — не ищем
  hover?: number; // 0..1 подсветка кнопки
  found?: number; // 0..1 окно «Игра найдена»
  accepted?: number; // 0..1 нажата «Принять»
  cursor?: [number, number];
  click?: number; // 0..1 импульс клика
};

export const MenuView: React.FC<MenuProps> = ({searching = -1, hover = 0, found = 0, accepted = 0, cursor, click = 0}) => (
  <g>
    <defs>
      <radialGradient id="cs-menu" cx="0.7" cy="0.35" r="0.9">
        <stop offset="0" stopColor="#3a2a1a" />
        <stop offset="0.5" stopColor="#151a22" />
        <stop offset="1" stopColor={CS.menuBg} />
      </radialGradient>
    </defs>
    <rect width={1600} height={900} fill="url(#cs-menu)" />
    {/* верхняя панель */}
    <rect width={1600} height={110} fill="rgba(0,0,0,0.45)" />
    <T x={250} y={72} s={46} ls={2}>COUNTER-STRIKE</T>
    <T x={735} y={72} s={58} c={CS.t}>2</T>
    {['ИГРАТЬ', 'ИНВЕНТАРЬ', 'МАГАЗИН'].map((s, i) => (
      <T key={s} x={850 + i * 180} y={68} s={26} c={i === 0 ? '#fff' : '#8a94a6'} w={900}>{s}</T>
    ))}
    <rect x={850} y={84} width={110} height={5} fill={CS.t} />
    {/* силуэты оперативников */}
    {[[520, 1], [690, 0.75]].map(([x, o], i) => (
      <g key={i} transform={`translate(${x}, 820)`} opacity={o}>
        <path d="M-70 0 L-60 -230 Q-55 -280 0 -290 Q55 -280 60 -230 L70 0 Z" fill="#202733" />
        <circle cx={0} cy={-330} r={42} fill="#202733" />
        <rect x={-70} y={-200} width={160} height={22} rx={4} fill="#11151c" transform="rotate(-12)" />
      </g>
    ))}
    {/* карточка режима */}
    <g transform="translate(900, 180)">
      <rect width={460} height={250} rx={14} fill="rgba(20,26,36,0.92)" stroke={CS.t} strokeWidth={4} />
      <T x={30} y={60} s={34} c={CS.t}>PREMIER</T>
      <T x={30} y={110} s={24} c="#9aa4b6" w={600}>Рейтинговый режим</T>
      <rect x={30} y={150} width={400} height={64} rx={10} fill="rgba(255,255,255,0.06)" />
      <T x={50} y={195} s={34}>ELO 1 800</T>
      <T x={410} y={195} s={30} c={CS.red} a="end">▼ 75</T>
    </g>
    {/* кнопка поиска */}
    <g transform="translate(900, 640)">
      <rect width={460} height={120} rx={14} fill={searching >= 0 ? '#2a6b33' : CS.accept}
        stroke="#fff" strokeOpacity={hover * 0.9} strokeWidth={6} />
      <T x={230} y={78} s={44} a="middle">{searching >= 0 ? `ПОИСК 0:${String(Math.floor(searching)).padStart(2, '0')}` : 'НАЙТИ ИГРУ'}</T>
    </g>
    {/* окно «Игра найдена» */}
    {found > 0 && (
      <g opacity={found}>
        <rect width={1600} height={900} fill="rgba(0,0,0,0.6)" />
        <g transform={`translate(800, 450) scale(${0.85 + 0.15 * found})`}>
          <rect x={-420} y={-210} width={840} height={420} rx={18} fill="#141a22" stroke={CS.accept} strokeWidth={6} />
          <T x={0} y={-110} s={56} a="middle">ИГРА НАЙДЕНА</T>
          <rect x={-260} y={-30} width={520} height={150} rx={16} fill={accepted > 0 ? '#2a6b33' : CS.accept} />
          <T x={0} y={70} s={64} a="middle">{accepted > 0 ? 'ПРИНЯТО' : 'ПРИНЯТЬ'}</T>
        </g>
      </g>
    )}
    {cursor && (
      <g transform={`translate(${cursor[0]}, ${cursor[1]}) scale(${1 - click * 0.15})`}>
        {click > 0 && <circle r={30 + click * 40} fill="none" stroke="#fff" strokeWidth={5} opacity={1 - click} />}
        <path d="M0 0 L0 56 L14 42 L26 68 L36 63 L24 38 L44 38 Z" fill="#fff" stroke="#000" strokeWidth={3} strokeLinejoin="round" />
      </g>
    )}
  </g>
);

export const DefeatView: React.FC<{appear?: number; score?: [number, number]; elo?: number}> = ({appear = 1, score = [9, 13], elo = -25}) => (
  <g>
    <rect width={1600} height={900} fill="#120d0f" />
    <g opacity={appear} transform={`translate(800, 330) scale(${0.9 + appear * 0.1})`}>
      <T x={0} y={0} s={120} a="middle" c={CS.red} ls={6}>ПОРАЖЕНИЕ</T>
      <T x={-90} y={150} s={96} a="end" c={CS.ct}>{score[0]}</T>
      <T x={0} y={140} s={80} a="middle" c="#777">:</T>
      <T x={90} y={150} s={96} a="start" c={CS.t}>{score[1]}</T>
      <rect x={-200} y={210} width={400} height={84} rx={12} fill="rgba(255,59,59,0.15)" stroke={CS.red} strokeWidth={4} />
      <T x={0} y={268} s={52} a="middle" c={CS.red}>ELO {elo}</T>
    </g>
  </g>
);

export type ScreenMode = 'game' | 'menu' | 'defeat' | 'off';

export const CSScreen: React.FC<{mode: ScreenMode; game?: GameProps; menu?: MenuProps; defeat?: {appear?: number; score?: [number, number]; elo?: number}; tint?: number; power?: number}> = ({mode, game, menu, defeat, tint = 0, power = 1}) => (
  <g>
    <rect width={1600} height={900} fill="#000" />
    <g opacity={power}>
      {mode === 'game' && <GameView {...game} />}
      {mode === 'menu' && <MenuView {...menu} />}
      {mode === 'defeat' && <DefeatView {...defeat} />}
    </g>
    {tint > 0 && <rect width={1600} height={900} fill="#ff1a1a" opacity={tint * 0.35} style={{mixBlendMode: 'multiply'}} />}
  </g>
);
