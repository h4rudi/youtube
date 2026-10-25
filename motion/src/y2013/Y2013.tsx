// TikTok-ролик «Проснулся в 2013 году» (9:16, ровно 60 с). Герой — Лёха v2.
// Факты: скины появились в CS:GO в августе 2013, наклейки Катовице — весной 2014, перчатки — позже. Ножи 2013 года — керамбит и др. (без бабочки).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';
import {Karambit, Skin, CRT, OldMenu, PlateIcon, CarIcon, ShawarmaIcon, Sticker, WallCalendar, Messenger, Window2013} from './Retro';

export const Y2013_FRAMES = fr(TOTAL);

const S = {
  hook: 0, wake: v(20) - 4, crt: v(23) - 4, cal: v(25) - 4, skins: v(29) - 4, market: v(35) - 4, knives: v(56) - 4, stickers: v(64) - 4,
  friends: v(74) - 4, smile: v(83) - 4, realize: v(90) - 4, years: v(103) - 4, window: v(109) - 4, end: v(117) - 4,
};
const GOLD = '#ffd23f';

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px', backgroundColor: '#0b0c12'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Tag: React.FC<{x: number; y: number; s: number; bg: string; color?: string; children: React.ReactNode; size?: number}> = ({x, y, s, bg, color = '#fff', children, size = 40}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 28px', borderRadius: 50, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);

// ---------------------------------------------------------------- хук: перемотка 2026 → 2013
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rew = interpolate(f, [0, v(6) + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const year = Math.round(2026 - rew * 13);
  const items: [number, React.ReactNode][] = [
    [v(12), <Karambit key="k" id="hk1" skin="fade" w={200} glow={GOLD} />],
    [v(13), <Sticker key="s" hue={300} f={f} s={0.8} />],
    [v(15), <Karambit key="k2" id="hk2" skin="doppler" w={200} glow="#c13cff" />],
  ];
  return (
    <>
      <Cam s={interpolate(f, [0, S.wake], [1.0, 1.08], clamp)} y={1000}>
        <Portrait f={f} bg="dorm" mood={f < v(16) ? 'shocked' : 'happy'} scale={1.15} y={1010} look={f >= v(12) ? -0.5 : 0} />
      </Cam>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 25%, rgba(58,42,106,0.65), transparent 60%)'}} />
      <svg width={1080} height={H} style={{position: 'absolute', inset: 0}}>
        {[460, 360, 260].map((r, i) => (
          <circle key={i} cx={540} cy={300} r={r} fill="none" stroke={i === 1 ? GOLD : '#6a7ad8'} strokeWidth={i === 1 ? 6 : 3} strokeDasharray={i === 0 ? '6 18' : i === 1 ? '40 24' : '2 14'}
            opacity={0.45} transform={`rotate(${-f * (6 - i * 1.5) * (1 - rew * 0.8)} 540 300)`} />
        ))}
      </svg>
      <Big x={540} y={300} s={1} size={230} color={rew >= 1 ? GOLD : '#fff'}>{year}</Big>
      {rew < 1 && <Big x={540} y={440} s={1} size={44} color="#8e9ab8">◀◀ ПЕРЕМОТКА</Big>}
      {items.map(([at, el], i) => {
        const s = pop(f, at, fps);
        return (
          <div key={i} style={{position: 'absolute', left: 200 + i * 340, top: 560, transform: `translate(-50%, -50%) scale(${s}) rotate(${(i - 1) * 6}deg)`, opacity: Math.min(1, s * 2),
            width: 270, height: 270, background: 'rgba(14,16,26,0.94)', border: `4px solid ${GOLD}`, borderRadius: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            {el}
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: GOLD}}>₽ ???</div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- пробуждение, старый монитор, календарь
const Wake: React.FC = () => {
  const f = useCurrentFrame();
  const open = ramp(f, v(21), v(22) + 6);
  return (
    <Cam s={interpolate(f, [S.wake, S.crt], [1.15, 1.05], clamp)} y={700}>
      <Portrait f={f} bg="dorm" mood={open < 1 ? 'tired' : 'shocked'} blink={1 - open} scale={1.5} light="#ffb36b" lightAmt={0.1} />
      <AbsoluteFill style={{height: H, background: '#000', opacity: (1 - open) * 0.6}} />
    </Cam>
  );
};

const Crt: React.FC = () => {
  const f = useCurrentFrame();
  const on = ramp(f, S.crt + 2, S.crt + 10);
  return (
    <>
      <Bg glow="#2a3a5a" />
      <Cam s={interpolate(f, [S.crt, S.cal], [0.95, 1.05], clamp)}>
        <CRT flicker={on * (0.92 + 0.08 * Math.sin(f * 1.3))}>
          <g transform={`translate(0, ${240 * (1 - (0.05 + 0.95 * on))}) scale(1, ${0.05 + 0.95 * on})`}><OldMenu banner={0} f={f} /></g>
        </CRT>
      </Cam>
      <Tag x={540} y={1030} s={pop(f, v(23), 30)} bg="#3a3d4a">ЭЛТ · 2013</Tag>
    </>
  );
};

const Cal: React.FC = () => {
  const f = useCurrentFrame();
  const flip = ramp(f, S.cal + 2, S.cal + 16);
  const circle = pop(f, v(27), 30);
  return (
    <>
      <Bg />
      <Cam s={interpolate(f, [S.cal, S.skins], [1, 1.08], clamp)}>
        <WallCalendar month="АВГУСТ" year="2013" flip={flip} circle={circle} />
      </Cam>
    </>
  );
};

const Skins: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg glow="#5a4a2a" />
      <Cam s={interpolate(f, [S.skins, S.market], [1, 1.12], clamp)}>
        <CRT><OldMenu banner={pop(f, v(33), 30, 200, 14)} f={f} /></CRT>
      </Cam>
    </>
  );
};

// ---------------------------------------------------------------- торговая площадка 2013
const ROWS: [string, Skin][] = [['Керамбит | Градиент', 'fade'], ['Керамбит | Тигровый зуб', 'tiger'], ['Керамбит | Мраморный градиент', 'marble'], ['Керамбит | Кровавая паутина', 'crimson']];
const Market: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dinner = pop(f, v(40), fps);
  const future = pop(f, v(47), fps);
  const car = pop(f, v(51), fps, 280, 10);
  const cheap = pop(f, v(54), fps, 300, 9);
  return (
    <>
      <Bg glow="#2a4a3a" />
      <div style={{position: 'absolute', left: 540, top: 470, width: 960, transform: 'translate(-50%, -50%)', background: '#1b2838', borderRadius: 20, border: '4px solid #2a475e', overflow: 'hidden', fontFamily: 'Montserrat'}}>
        <div style={{height: 76, background: '#171d25', display: 'flex', alignItems: 'center', padding: '0 28px', color: '#c7d5e0', fontWeight: 900, fontSize: 32, gap: 16}}>
          ТОРГОВАЯ ПЛОЩАДКА <span style={{marginLeft: 'auto', color: '#66c0f4', fontSize: 26}}>август 2013</span>
        </div>
        {ROWS.map(([name, skin], i) => {
          const a = pop(f, S.market + 4 + i * 4, fps);
          return (
            <div key={name} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '16px 26px', borderTop: '2px solid #2a475e', opacity: Math.min(1, a * 2),
              transform: `translateX(${(1 - a) * 60}px)`, background: i === 0 && dinner > 0 ? 'rgba(255,210,63,0.12)' : 'transparent'}}>
              <div style={{width: 170, height: 100, borderRadius: 12, background: '#0f1923', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Karambit id={`m${i}`} skin={skin} w={150} /></div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 28, fontWeight: 900, color: '#e4ae39'}}>★ {name}</div>
                <div style={{fontSize: 22, fontWeight: 600, color: '#8f98a0'}}>Нож · Тайное</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* сравнение цен */}
      <Tag x={290} y={880} s={dinner} bg="#2a475e"><PlateIcon s={0.7} /> = УЖИН</Tag>
      {future > 0 && <Big x={540} y={880} s={future} size={60} color="#9aa4c0">→</Big>}
      {future > 0 && <Big x={540} y={820} s={future} size={28} color="#9aa4c0">ЧЕРЕЗ 10 ЛЕТ</Big>}
      <Tag x={800} y={880} s={car} bg={RED}><CarIcon s={0.6} /> = МАШИНА</Tag>
      {cheap > 0 && (
        <div style={{position: 'absolute', left: 540, top: 1010, transform: `translate(-50%, -50%) rotate(-6deg) scale(${cheap})`, border: `8px solid ${GOLD}`, color: GOLD, fontFamily: 'Montserrat',
          fontWeight: 900, fontSize: 64, padding: '6px 30px', borderRadius: 14, opacity: Math.min(1, cheap * 2)}}>ЗА КОПЕЙКИ</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- скупает ножи, ждёт перчатки
const Knives: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const skins: Skin[] = ['fade', 'doppler', 'tiger', 'marble', 'crimson', 'slaughter', 'fade', 'doppler', 'tiger', 'marble', 'slaughter'];
  const n = Math.round(ramp(f, v(57), v(59) + 6) * skins.length);
  const glove = pop(f, v(60), fps);
  return (
    <>
      <Bg glow="#5a2a6a" />
      <Tag x={540} y={170} s={1} bg="#1c2030" size={38}>ИНВЕНТАРЬ ЛЁХИ</Tag>
      <div style={{position: 'absolute', left: 540, top: 600, transform: 'translate(-50%, -50%)', display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 18}}>
        {Array.from({length: 12}).map((_, i) => {
          const isGlove = i === 11;
          const has = i < n;
          const s = isGlove ? glove : has ? Math.min(1, (f - (v(57) + (i / skins.length) * (v(59) + 6 - v(57)))) / 6 + 0.2) : 0;
          return (
            <div key={i} style={{height: 170, borderRadius: 18, background: '#141827', border: `4px ${isGlove ? 'dashed' : 'solid'} ${isGlove ? GOLD : has ? '#e4ae39' : '#2a2f42'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
              {has && !isGlove && <div style={{transform: `scale(${Math.max(0, Math.min(1, s))})`}}><Karambit id={`kn${i}`} skin={skins[i]} w={210} /></div>}
              {isGlove && glove > 0 && (
                <div style={{opacity: glove, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: GOLD}}>
                  <svg width={80} height={80} viewBox="0 0 80 80" style={{opacity: 0.6}}><path d="M20 76 L18 34 Q18 26 24 26 L24 44 M24 26 Q24 16 32 16 L32 42 M32 18 Q34 8 42 10 L42 42 M42 16 Q48 10 54 16 L54 46 Q62 36 68 40 Q66 56 56 66 L52 76 Z" fill="none" stroke={GOLD} strokeWidth={5} strokeLinejoin="round" /></svg>
                  <div style={{fontSize: 26}}>ПЕРЧАТКИ: СКОРО</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Stickers: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hues = [0, 60, 130, 200, 260, 320];
  const tag = pop(f, v(70), fps);
  const hundred = pop(f, v(72), fps, 300, 9);
  return (
    <>
      <Bg glow="#2a5a6a" />
      <Tag x={540} y={170} s={pop(f, v(64), fps)} bg="#1c2030" size={38}>ЧЕРЕЗ ПОЛГОДА · 2014</Tag>
      <div style={{position: 'absolute', left: 540, top: 520, transform: 'translate(-50%, -50%)', display: 'grid', gridTemplateColumns: 'repeat(3, 230px)', gap: 26}}>
        {hues.map((h, i) => {
          const s = pop(f, v(66) + i * 4, fps);
          return <div key={i} style={{display: 'flex', justifyContent: 'center', transform: `scale(${s}) rotate(${(i % 3 - 1) * 8}deg)`, opacity: Math.min(1, s * 2)}}><Sticker hue={h} f={f} s={1.15} /></div>;
        })}
      </div>
      <Tag x={540} y={900} s={tag} bg="#c98a2a"><ShawarmaIcon s={0.55} /> = ШАУРМА</Tag>
      {hundred > 0 && <Big x={820} y={250} s={hundred} size={120} color={GOLD}>×100</Big>}
    </>
  );
};

// ---------------------------------------------------------------- друзья ржут, Лёха знает
const Friends: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg glow="#2a6aa8" />
      <Messenger msgs={[
        {name: 'Санёк', text: 'ахахахахах', color: '#e07a1d', p: ramp(f, v(74) + 2, v(74) + 10)},
        {name: 'Димон', text: 'ты чё, все деньги на картинки слил?', color: '#2a7de1', p: ramp(f, v(76), v(76) + 8)},
        {name: 'Санёк', text: 'лучше бы шаурмы купил', color: '#e07a1d', p: ramp(f, v(81), v(81) + 8)},
      ]} />
    </>
  );
};

const Smile: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = ramp(f, v(86), v(89) + 14);
  const pts: string[] = [];
  for (let i = 0; i <= Math.round(line * 30); i++) {
    const t = i / 30;
    pts.push(`${60 + t * 960},${760 - Math.pow(t, 2.2) * 560 + Math.sin(i * 1.9) * 14}`);
  }
  return (
    <>
      <Cam s={interpolate(f, [S.smile, S.realize], [1.05, 1.12], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood="happy" look={0.6} scale={1.35} y={1010} light="#ffd23f" lightAmt={0.08} />
      </Cam>
      <svg width={1080} height={H} style={{position: 'absolute', inset: 0}}>
        {pts.length > 1 && <polyline points={pts.join(' ')} fill="none" stroke={GOLD} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} style={{filter: `drop-shadow(0 0 10px ${GOLD})`}} />}
      </svg>
      <Big x={540} y={220} s={pop(f, v(87), fps, 300, 10)} size={80} color={GOLD}>ОН ЗНАЕТ</Big>
    </>
  );
};

// ---------------------------------------------------------------- а потом доходит: 13 лет заново
const Realize: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = pop(f, v(95), fps);
  const flag = pop(f, v(101), fps, 300, 10);
  return (
    <>
      <Cam s={interpolate(f, [S.realize, S.years], [1.05, 1.25], clamp)} y={760}>
        <Portrait f={f} bg="dorm" mood={f >= v(93) ? 'shocked' : 'happy'} sweat={f >= v(95)} scale={1.4} y={1020} />
      </Cam>
      <div style={{position: 'absolute', left: 90, top: 260, width: 900, opacity: bar, transform: `translateY(${(1 - bar) * -30}px)`}}>
        <div style={{position: 'relative', height: 26, borderRadius: 13, background: '#1c2030', border: '3px solid #2c3350'}}>
          <div style={{position: 'absolute', left: 0, top: -14, width: 50, height: 50, borderRadius: 25, background: GOLD, boxShadow: `0 0 20px ${GOLD}`}} />
          <div style={{position: 'absolute', right: -6, top: -70, transform: `scale(${flag})`, transformOrigin: 'bottom', fontSize: 0}}>
            <svg width={70} height={90} viewBox="0 0 70 90"><path d="M8 88 V6" stroke="#fff" strokeWidth={6} /><path d="M10 8 H64 L52 24 L64 40 H10 Z" fill={RED} /></svg>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#fff', marginTop: 18, textShadow: '0 3px 0 #000'}}>
          <span style={{color: GOLD}}>2013</span><span style={{color: RED}}>2026 · ПРОДАТЬ</span>
        </div>
      </div>
    </>
  );
};

const Years: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const days = f >= v(106) ? Math.min(4700, Math.round(Math.pow(ramp(f, v(106), S.window), 2) * 4700) + 1) : 1;
  const pages = f >= v(105) ? Math.floor((f - v(105)) / 2) : 0;
  return (
    <>
      <Bg glow="#6a1a22" />
      <Big x={540} y={230} s={pop(f, v(103), fps, 300, 9)} size={150} color={RED}>13 ЛЕТ</Big>
      {/* листки календаря летят */}
      {f >= v(105) && Array.from({length: 8}).map((_, i) => {
        const k = pages - i;
        if (k < 0) return null;
        const t = ((f - v(105)) % 16) / 16;
        return (
          <div key={i} style={{position: 'absolute', left: 540 + (i % 2 ? 1 : -1) * (40 + i * 30) * t, top: 560 - i * 6 + t * 200 * (i / 8), width: 300, height: 340,
            transform: `translate(-50%, -50%) rotate(${(i % 2 ? 1 : -1) * (i * 7 + t * 30)}deg)`, background: '#f1ead8', border: '5px solid #15131a', borderRadius: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', opacity: 1 - i * 0.1}}>
            <div style={{width: '100%', height: 80, background: '#c4232d', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'][(k + i) % 7]}
            </div>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, color: '#23262f'}}>{((k * 3 + i) % 28) + 1}</div>
          </div>
        );
      })}
      {f >= v(106) && (
        <div style={{position: 'absolute', left: 540, top: 950, transform: 'translate(-50%, -50%)', background: 'rgba(10,11,16,0.92)', border: `4px solid ${RED}`, borderRadius: 24,
          padding: '14px 34px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52, color: '#fff', whiteSpace: 'nowrap'}}>
          ДЕНЬ <span style={{color: RED}}>{days.toLocaleString('ru-RU')}</span> ИЗ ~4 700
        </div>
      )}
    </>
  );
};

const WindowScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Cam s={interpolate(f, [S.window, S.end], [1.0, 1.08], clamp)} y={500}>
      <Window2013 f={f} year={pop(f, v(115), fps)} />
    </Cam>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 12, fps, 300, 10), c = pop(f, S.end + 30, fps);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#8e9ab8', opacity: a}}>2013 → 2026</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, color: '#fff', lineHeight: 1.05, marginTop: 20, opacity: Math.min(1, b * 2), transform: `scale(${0.7 + 0.3 * b})`}}>
        А ТЫ БЫ<br /><span style={{color: GOLD, textShadow: `0 0 40px ${GOLD}88`}}>ЧТО КУПИЛ?</span>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50,
        opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'y2013/rewind.wav', 0.6], ...Array.from({length: 13}).map((_, i): Fx => [Math.round(Math.pow(i / 13, 1.6) * (v(6) + 6)), 'sfx2/tick.wav', 0.5]), [v(6) + 6, 'money/boom.wav', 0.5],
  [v(12), 'sfx2/pop.wav', 0.4], [v(13), 'sfx2/pop.wav', 0.4], [v(15), 'sfx2/pop.wav', 0.4],
  [S.wake, 'sfx2/whoosh.wav', 0.3], [v(22), 'sfx2/shimmer.wav', 0.3], [S.crt + 2, 'y2013/crt.wav', 0.7],
  [S.cal, 'money/paper.wav', 0.5], [v(27), 'sfx2/stamp.wav', 0.45],
  [S.skins, 'sfx2/whip.wav', 0.3], [v(33), 'money/win.wav', 0.45],
  [S.market, 'sfx2/whoosh.wav', 0.35], ...[0, 1, 2, 3].map((i): Fx => [S.market + 4 + i * 4, 'sfx2/blip.wav', 0.3]), [v(40), 'sfx2/ding.wav', 0.35], [v(47), 'sfx2/whoosh.wav', 0.3],
  [v(51), 'money/boom.wav', 0.45], [v(54), 'sfx2/stamp.wav', 0.55],
  [S.knives, 'sfx2/whip.wav', 0.3], ...Array.from({length: 11}).map((_, i): Fx => [Math.round(v(57) + (i / 11) * (v(59) + 6 - v(57))), 'money/cash.wav', 0.12]), [v(60), 'sfx2/tick.wav', 0.6], [v(60) + 15, 'sfx2/tick.wav', 0.6],
  [S.stickers, 'sfx2/whoosh.wav', 0.3], ...Array.from({length: 6}).map((_, i): Fx => [v(66) + i * 4, 'sfx2/pop.wav', 0.35]), [v(70), 'sfx2/ding.wav', 0.35], [v(72), 'sfx2/stamp.wav', 0.55],
  [v(74) + 2, 'tilt/notif.wav', 0.45], [v(76), 'tilt/notif.wav', 0.45], [v(81), 'tilt/notif.wav', 0.45],
  [S.smile, 'sfx2/shimmer.wav', 0.3], [v(86), 'sfx2/riser.wav', 0.3], [v(87), 'sfx2/stamp.wav', 0.4],
  [v(93), 'money/boom.wav', 0.45], [v(95), 'tilt/heart.wav', 0.45], [v(101), 'sfx2/error.wav', 0.35],
  [v(103), 'money/boom.wav', 0.55], [v(105), 'y2013/pages.wav', 0.6], [v(106), 'sfx2/tick.wav', 0.5], [v(108), 'sfx2/impact.wav', 0.5],
  [S.window, 'sfx2/whoosh.wav', 0.3], [v(115), 'sfx2/shimmer.wav', 0.35],
  [S.end, 'money/boom.wav', 0.45], [S.end + 12, 'sfx2/stamp.wav', 0.45], [S.end + 30, 'sfx2/pop.wav', 0.4],
];
const GAIN = 0.55;

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {Array.from({length: Math.ceil(TOTAL / 11.5)}).map((_, i) => (
      <Sequence key={i} from={Math.round(i * 11.5 * FPS)} durationInFrames={12 * FPS}>
        <Audio src={staticFile('tilt/pad.wav')} volume={0.1} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * GAIN} />
      </Sequence>
    ))}
  </>
);

export const Y2013: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.wake, Hook], [S.wake, S.crt, Wake], [S.crt, S.cal, Crt, true], [S.cal, S.skins, Cal], [S.skins, S.market, Skins, true],
    [S.market, S.knives, Market], [S.knives, S.stickers, Knives, true], [S.stickers, S.friends, Stickers, true], [S.friends, S.smile, Friends],
    [S.smile, S.realize, Smile], [S.realize, S.years, Realize], [S.years, S.window, Years, true], [S.window, S.end, WindowScene],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(6) + 6} len={12} color="rgba(255,210,63,0.45)" />
      <Flash at={v(51)} len={12} />
      <Flash at={v(93)} len={12} />
      <Flash at={v(108)} len={14} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
