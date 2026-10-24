// TikTok-ролик «Миллион за катку» (9:16, ~88 с). Герой — Лёха v2. Сюжет по разбору ролика «миллион в минуту», переделанный под CS2:
// каждая победа = миллион, но снаружи проходит год. Озвучка ElevenLabs пользователя, субтитры по словам.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing, continueRender, delayRender} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Basement, Portrait, Phone, Note, DoorClose, CaseRoulette, Courtyard, AptDoor, Mom, MoneyRain, money, W, H, RED} from './Props';
import {VictoryView, MonitorInsert, Menu} from './Screens';

export const MONEY_FRAMES = fr(TOTAL);

let caveat = false;
const loadCaveat = () => {
  if (caveat || typeof document === 'undefined') return;
  caveat = true;
  const h = delayRender('caveat');
  Promise.all([
    new FontFace('Caveat', `url(${staticFile('fonts/Caveat-cyr-700.woff2')})`, {weight: '700', unicodeRange: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'}).load(),
    new FontFace('Caveat', `url(${staticFile('fonts/Caveat-lat-700.woff2')})`, {weight: '700', unicodeRange: 'U+0000-00FF, U+2000-206F, U+20BD'}).load(),
  ]).then((ls) => { ls.forEach((l) => document.fonts.add(l)); continueRender(h); });
};

// ---- монтажные точки (кадры)
const S = {
  hook: 0,
  story: v(14) - 4,
  ad: v(27) - 4,
  one: v(35) - 4,
  base: v(39) - 4,
  note: v(47) - 6,
  m1: v(58) - 4,
  m1b: v(61) - 3,
  m23: v(64) - 3,
  door: v(66) - 4,
  m5: v(74) - 4,
  cs3: v(76) - 4,
  sig: v(82) - 4,
  slide: v(96) - 4,
  momNote: v(99) - 2,
  year: v(106) - 4,
  exit: v(110) - 4,
  back: v(113) - 4,
  forMom: v(117) - 4,
  more: v(122) - 4,
  moreB: v(124) - 4,
  silence: v(126) - 4,
  fear: v(134) - 4,
  ninth: v(139) - 4,
  stop: v(141) - 3,
  grab: v(142) - 3,
  yard: v(147) - 4,
  y2035: v(154) - 4,
  apt: v(159) - 4,
  mom: v(163) - 4,
  hi: v(164) - 4,
  guest: v(166) - 4,
  find: v(173) - 4,
  end: v(175) - 4,
};

// сцена: плавный вход поверх предыдущей; kind='cut' — жёсткая склейка с толчком
const Scene: React.FC<{from: number; to: number; children: React.ReactNode; zoom?: number; cut?: boolean}> = ({from, to, children, zoom = 0.06, cut = false}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to + (cut ? 0 : 8)) return null;
  const t = cut ? 1 : ramp(f, from, from + 8);
  const kick = cut ? Math.max(0, 1 - (f - from) / 6) * 0.04 : (1 - t) * zoom;
  return <AbsoluteFill style={{height: H, overflow: 'hidden', opacity: t, transform: `scale(${1 + kick})`}}>{children}</AbsoluteFill>;
};

const Cam: React.FC<{s: number; x?: number; y?: number; shake?: number; children: React.ReactNode}> = ({s, x = W / 2, y = H / 2, shake = 0, children}) => {
  const f = useCurrentFrame();
  const dx = shake ? Math.sin(f * 1.7) * shake * 12 : 0;
  const dy = shake ? Math.cos(f * 2.3) * shake * 10 : 0;
  return <AbsoluteFill style={{transformOrigin: `${x}px ${y}px`, transform: `translate(${dx}px, ${dy}px) scale(${s})`}}>{children}</AbsoluteFill>;
};

const Flash: React.FC<{at: number; len?: number; color?: string}> = ({at, len = 12, color = 'rgba(255,40,55,0.5)'}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  return <AbsoluteFill style={{height: H, background: color, opacity: 1 - (f - at) / len}} />;
};

// счётчик табло: сколько каток выиграно к кадру
const wins = (f: number) => {
  const steps: [number, number][] = [[v(61), 1], [v(64), 2], [v(65), 3], [v(74), 5], [v(117), 6], [v(126), 7], [v(130), 8], [v(139), 9]];
  let n = 0;
  for (const [at, k] of steps) if (f >= at) n = k;
  return n;
};
const tabloOf = (f: number) => ({tablo: money(wins(f)), sub: `КАТОК: ${wins(f)}`});

// ---------------------------------------------------------------- 0. хук
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.min(9, Math.floor(f / 11) + 1);
  return (
    <>
      <Cam s={interpolate(f, [0, S.story], [1.0, 1.12], clamp)} y={560}>
        <Basement f={f} tablo={money(n)} sub={`КАТОК: ${n}`} lyokha={{mood: f < v(10) ? 'shocked' : 'happy', look: Math.sin(f / 12) * 0.5}} pile={Math.min(1, f / 110)} />
      </Cam>
      <MoneyRain f={f} from={0} n={46} seed="hook" />
    </>
  );
};

// ---------------------------------------------------------------- 1. Лёха, кейсы, мама
const Story: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const roll = interpolate(f, [v(17), v(21) + 4], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const rollShow = pop(f, v(16) - 4, fps) * (1 - ramp(f, v(23) - 6, v(23)));
  const mom = pop(f, v(23), fps);
  return (
    <>
      <Portrait f={f} bg="dorm" mood={f >= v(19) ? 'worried' : 'neutral'} sweat={f >= v(20)} look={f >= v(23) ? 0.7 : -0.2} scale={1.35} y={900} light="#6a8cff" lightAmt={0.12} />
      {rollShow > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: rollShow, transform: `translateY(${(1 - rollShow) * -40}px)`}}>
          <CaseRoulette p={roll} result={roll >= 1 ? 1 : 0} />
          {roll >= 1 && (
            <div style={{position: 'absolute', left: 540, top: 575, transform: 'translateX(-50%)', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: '#fff', whiteSpace: 'nowrap',
              background: 'rgba(10,11,16,0.92)', padding: '10px 26px', borderRadius: 20}}>
              ШИРПОТРЕБ · 3 ₽ <span style={{color: RED, marginLeft: 16}}>БАЛАНС: 0 ₽</span>
            </div>
          )}
        </div>
      )}
      {mom > 0 && (
        <div style={{position: 'absolute', left: 540, top: 300, width: 860, transform: `translate(-50%, ${(1 - mom) * -200}px)`, opacity: mom, background: 'rgba(235,240,250,0.96)',
          borderRadius: 34, padding: '24px 28px', display: 'flex', gap: 22, alignItems: 'center', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
          <div style={{width: 90, height: 90, borderRadius: 22, background: '#ff8a3d', color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>М</div>
          <div>
            <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34, color: '#111'}}>Мама</div>
            <div style={{fontFamily: 'Montserrat', fontWeight: 600, fontSize: 34, color: '#222'}}>Как учёба, сынок? Горжусь тобой</div>
          </div>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 2. реклама
const Ad: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, #1c2140, #07080c 70%)'}} />
      <Cam s={interpolate(f, [S.ad, S.one], [1, 1.1], clamp)}>
        <Phone time="23:47" date="среда, 21 октября" signal={1} s={0.98}
          notifs={[{app: '₽', title: 'Банк', text: 'Баланс карты: 0 ₽', color: '#2a7de1'}]}
          ad={pop(f, v(29), fps)} adHl={f >= v(33) ? 0.6 + 0.4 * Math.sin((f - v(33)) / 4) : 0} />
      </Cam>
    </>
  );
};

// ---------------------------------------------------------------- 3. «одна катка — и домой»
const One: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.one, S.base], [1, 1.08], clamp)} y={700}>
      <Portrait f={f} bg="dorm" mood="neutral" look={0} blink={((f - S.one) % 70) < 4 ? 1 : 0} light="#6a8cff" lightAmt={0.15} />
    </Cam>
  );
};

// ---------------------------------------------------------------- 4. подвал: комп, табло, записка
const Base: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lamp = ramp(f, v(39) - 2, v(39) + 6);
  const tablo = f >= v(42) ? 1 : 0;
  const s = interpolate(f, [S.base, S.note], [1.0, 1.18], clamp);
  return (
    <>
      <Cam s={s} y={f >= v(45) ? 900 : 560}>
        <Basement f={f} tablo="0 ₽" sub="КАТОК: 0" tabloGlow={tablo} lamp={lamp} lyokha={null} />
        {/* записка на клавиатуре */}
        {f >= v(45) && (
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <g transform={`translate(540, 880) rotate(-6) scale(${pop(f, v(45), fps)})`}>
              <rect x={-90} y={-30} width={180} height={60} fill="#f1ead8" stroke="#8a8270" strokeWidth={3} />
              <path d="M-60 -8 h110 M-60 10 h80" stroke="#23285a" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
            </g>
          </svg>
        )}
      </Cam>
      {tablo === 0 && <AbsoluteFill style={{height: H, background: '#000', opacity: (1 - lamp) * 0.8}} />}
    </>
  );
};

// ---------------------------------------------------------------- 5. правила
const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const line = (from: number, len = 18) => ramp(f, from, from + len);
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 45%, #2a2c34, #0b0c10 75%)'}} />
      <Cam s={interpolate(f, [S.note, S.m1], [1, 1.06], clamp)}>
        <Note title="ПРАВИЛА" h={840} lines={[
          {text: '1. Играй', p: line(S.note + 4, 10)},
          {text: '2. Каждая победа —', p: line(S.note + 14, 12)},
          {text: '1 000 000 ₽', p: line(S.note + 26, 10), color: '#c4232d', indent: 40},
          {text: '3. Выйти можно', p: line(v(47))},
          {text: 'после любой катки', p: line(v(49)), indent: 40},
          {text: '4. Дверь открывается', p: line(v(52))},
          {text: 'только изнутри', p: line(v(54), 14), color: '#c4232d', indent: 40},
          {text: '5. Деньги твои', p: line(v(56), 14)},
        ]} />
      </Cam>
    </>
  );
};

// ---------------------------------------------------------------- 6. первая катка
const Match1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const victory = f >= v(60) - 2;
  return (
    <Cam s={interpolate(f, [S.m1, S.m1b], [1, 1.08], clamp)}>
      <MonitorInsert glow={victory ? '#4cff6a' : '#ffb070'}>
        {victory
          ? <VictoryView appear={pop(f, v(60) - 2, fps)} pay={pop(f, v(61) - 8, fps)} n={1} />
          : <Menu searching={(f - S.m1) / fps + 1} hover={1} />}
      </MonitorInsert>
    </Cam>
  );
};

const Payout: React.FC<{from: number; to: number; seed: string; mood?: 'happy' | 'shocked' | 'neutral' | 'tired' | 'worried'}> = ({from, to, seed, mood = 'happy'}) => {
  const f = useCurrentFrame();
  return (
    <>
      <Cam s={interpolate(f, [from, to], [1.04, 1.12], clamp)} y={520}>
        <Basement f={f} {...tabloOf(f)} lyokha={{mood, look: Math.sin(f / 10) * 0.6}} pile={Math.min(1, wins(f) / 9)} tabloGlow={1 + (f - from < 10 ? 1 : 0)} />
      </Cam>
      <MoneyRain f={f} from={from} until={to} n={34} seed={seed} />
    </>
  );
};

// ---------------------------------------------------------------- 8. свет под дверью
const DoorBlink: React.FC = () => {
  const f = useCurrentFrame();
  const marks = [v(70), v(71), v(72), v(73)];
  let light = 0.5;
  marks.forEach((m, i) => { if (f >= m) light = i % 2 === 0 ? 1 : 0.05; });
  const fast = f >= v(69) && f < v(70) ? (Math.floor(f / 3) % 2 ? 1 : 0.1) : light;
  return (
    <Cam s={interpolate(f, [S.door, S.m5], [1, 1.1], clamp)} y={900}>
      <DoorClose light={fast} f={f} />
    </Cam>
  );
};

// ---------------------------------------------------------------- 9. пятая катка + CS3
const Match5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={1.08} y={260}>
      <Basement f={f} {...tabloOf(f)} lyokha={{mood: 'tired', look: 0}} pile={0.55} tabloGlow={2} />
    </Cam>
  );
};

const CS3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, v(78), fps, 200, 14);
  return (
    <Cam s={interpolate(f, [v(80), S.sig], [1, 1.18], {...clamp, easing: Easing.out(Easing.cubic)})}>
      <MonitorInsert glow="#ff8a1f">
        <Menu cs3={p} pulse={Math.sin(f / 4)} />
      </MonitorInsert>
    </Cam>
  );
};

// ---------------------------------------------------------------- 10. сеть на секунду: 2029
const Signal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sig = f >= v(84);
  const lost = f >= v(95) + 14;
  const n = (at: number) => (f - at) / 8;
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, #1c2140, #07080c 70%)'}} />
      <Cam s={interpolate(f, [S.sig, S.slide], [1, 1.08], clamp)}>
        <Phone time="16:40" date={f >= v(87) ? 'понедельник, 1 января 2029' : 'понедельник, 1 января'} dateRed={f >= v(87)}
          noSignal={!sig || lost} signal={sig ? Math.min(1, (f - v(84)) / 10) : 0} glow={sig ? 1.4 : 0.6}
          notifs={sig ? [
            {app: 'Д', title: 'Деканат', text: 'Приказ об отчислении', color: '#6b7280', at: n(v(84) + 4)},
            {app: 'С', title: 'Санёк', text: 'бро, уже второй Новый год без тебя', color: '#2a7de1', at: n(v(84) + 10)},
            {app: 'М', title: 'Мама', text: 'С Новым годом, сынок. Возвращайся', color: '#ff8a3d', at: n(v(90) - 4), hl: f >= v(90)},
          ] : []} />
      </Cam>
      {f >= v(87) && (
        <div style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%, -50%) scale(${pop(f, v(87), fps, 300, 10)})`, fontFamily: 'Montserrat', fontWeight: 900,
          fontSize: 150, color: RED, textShadow: `0 0 40px ${RED}`, opacity: f < v(90) ? 1 : Math.max(0, 1 - (f - v(90)) / 10)}}>2029</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 11. записка мамы
const Slide: React.FC = () => {
  const f = useCurrentFrame();
  return <DoorClose light={0.6} note={ramp(f, v(96), v(98) + 6)} f={f} />;
};

const MomNote: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 45%, #2a2c34, #0b0c10 75%)'}} />
      <Cam s={interpolate(f, [S.momNote, S.year], [1, 1.1], clamp)}>
        <Note w={760} h={520} rot={3} lines={[
          {text: 'Лёша, выйди.', p: ramp(f, v(101), v(102) + 8), size: 80},
          {text: 'Прошло 5 лет.', p: ramp(f, v(103), v(105) + 6), size: 80, color: '#c4232d'},
        ]} sign={{text: 'Мама', p: ramp(f, v(105), v(105) + 14)}} />
      </Cam>
    </>
  );
};

// ---------------------------------------------------------------- 12. «одна катка — это год»
const Year: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Cam s={interpolate(f, [S.year, S.exit], [1, 1.15], clamp)} y={700}>
        <Portrait f={f} bg="basement" mood="shocked" redness={0.6} light={RED} lightAmt={0.15} />
      </Cam>
      {f >= v(108) && (
        <div style={{position: 'absolute', left: 540, top: 240, transform: `translate(-50%, -50%) scale(${pop(f, v(108), fps, 300, 10)})`, background: RED, color: '#fff',
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, padding: '14px 40px', borderRadius: 60, whiteSpace: 'nowrap', boxShadow: `0 0 50px ${RED}`}}>1 КАТКА = 1 ГОД</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 13. выйти — и что?
const Exit: React.FC = () => {
  const f = useCurrentFrame();
  const h = ramp(f, v(110), v(110) + 8) * (1 - ramp(f, v(112), v(112) + 10));
  return (
    <Cam s={1.25} x={300} y={420}>
      <DoorClose light={0.5} handle={h} f={f} />
    </Cam>
  );
};

const NotBack: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.back, S.forMom], [1.05, 1.15], clamp)} y={700}>
      <Portrait f={f} bg="basement" mood="worried" look={-0.6} tears={ramp(f, v(114), v(116) + 10) * 0.6} redness={0.4} />
    </Cam>
  );
};

const ForMom: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Cam s={interpolate(f, [S.forMom, S.more], [1.0, 1.1], clamp)} y={560}>
        <Basement f={f} {...tabloOf(f)} lyokha={{mood: 'neutral', look: 0.2}} pile={0.75} tabloGlow={2} />
      </Cam>
      <MoneyRain f={f} from={v(117)} until={S.more} n={22} seed="mom" />
    </>
  );
};

const More: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clickAt = v(122) + 8;
  const mv = ramp(f, S.more, clickAt - 2);
  const click = f >= clickAt && f < clickAt + 10 ? (f - clickAt) / 10 : 0;
  return (
    <Cam s={interpolate(f, [S.more, S.moreB], [1, 1.12], clamp)}>
      <MonitorInsert glow="#ffb070">
        <Menu cursor={[interpolate(mv, [0, 1], [600, 1120]), interpolate(mv, [0, 1], [400, 700])]} click={click} hover={mv > 0.9 ? 1 : 0}
          searching={f >= clickAt ? (f - clickAt) / fps + 1 : -1} />
      </MonitorInsert>
    </Cam>
  );
};

const MoreB: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.moreB, S.silence], [1.1, 1.2], clamp)} y={700}>
      <Portrait f={f} bg="basement" mood="tired" sweat redness={0.7} light={RED} lightAmt={0.2} />
    </Cam>
  );
};

// ---------------------------------------------------------------- 14. тишина и страх
const Silence: React.FC = () => {
  const f = useCurrentFrame();
  const light = 0.7 * (1 - ramp(f, v(130), v(133) + 16));
  return (
    <Cam s={interpolate(f, [S.silence, S.fear], [1, 1.12], clamp)} y={900}>
      <DoorClose light={light} f={f} />
    </Cam>
  );
};

const Fear: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Cam s={interpolate(f, [S.fear, S.ninth], [1.1, 1.3], clamp)} y={680}>
        <Portrait f={f} bg="basement" mood="worried" look={0.8} tears={ramp(f, v(136), v(138) + 10)} redness={0.3} />
      </Cam>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.75))'}} />
    </>
  );
};

// ---------------------------------------------------------------- 15. девятая — хватит — бегство
const Ninth: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={1.12} y={260}>
      <Basement f={f} {...tabloOf(f)} lyokha={{mood: 'tired', sweat: true}} pile={1} tabloGlow={f % 10 < 5 ? 2.5 : 1} redness={0.8} />
    </Cam>
  );
};

const Stop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={1.25} y={700} shake={Math.max(0, 1 - (f - S.stop) / 14)}>
      <Portrait f={f} bg="basement" mood="shocked" sweat redness={1} light={RED} lightAmt={0.25} />
    </Cam>
  );
};

const Grab: React.FC = () => {
  const f = useCurrentFrame();
  const open = ramp(f, v(145), v(146) + 4);
  const white = ramp(f, v(146), v(146) + 14);
  return (
    <>
      <Cam s={interpolate(f, [S.grab, S.yard], [1, 1.35], {...clamp, easing: Easing.in(Easing.cubic)})} x={952} y={720}>
        <Basement f={f} {...tabloOf(f)} lyokha={f < v(145) ? {mood: 'shocked'} : null} pile={f < v(145) ? 1 - ramp(f, S.grab, v(145)) * 0.8 : 0.2} doorOpen={open} doorLight={1} />
      </Cam>
      <MoneyRain f={f} from={S.grab} until={v(145) + 6} n={30} seed="grab" up speed={14} />
      <AbsoluteFill style={{height: H, background: '#fff8e6', opacity: white}} />
    </>
  );
};

// ---------------------------------------------------------------- 16. двор и 2035
const Yard: React.FC = () => {
  const f = useCurrentFrame();
  const white = 1 - ramp(f, S.yard, S.yard + 16);
  return (
    <>
      <Cam s={interpolate(f, [S.yard, S.y2035], [1.15, 1.0], clamp)} y={700}>
        <Courtyard f={f} grow={ramp(f, v(150), v(153) + 10)} tilt={ramp(f, v(150), v(153) + 10) * 0.3} />
      </Cam>
      <AbsoluteFill style={{height: H, background: '#fff8e6', opacity: white}} />
    </>
  );
};

const Y2035: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, #1c2140, #07080c 70%)'}} />
      <Phone time="06:12" date="понедельник, 22 октября 2035" dateRed signal={1} s={0.98} notifs={[]} />
      {f >= v(156) && (
        <div style={{position: 'absolute', left: 540, top: 720, transform: `translate(-50%, -50%) scale(${pop(f, v(156), fps, 280, 10)})`, fontFamily: 'Montserrat', fontWeight: 900,
          fontSize: 210, color: RED, textShadow: `0 0 50px ${RED}`}}>2035</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 17. домой: мама
const Apt: React.FC = () => {
  const f = useCurrentFrame();
  const ring = f >= v(160) && f < v(160) + 30 ? 1 : 0;
  return (
    <Cam s={interpolate(f, [S.apt, S.mom], [1, 1.1], clamp)} y={700}>
      <AptDoor open={ramp(f, v(162) + 6, v(162) + 22)} ring={ring} />
    </Cam>
  );
};

const MomScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.mom, S.hi], [1, 1.08], clamp)} y={600}>
      <Mom f={f} tears={ramp(f, S.mom, S.mom + 20)} />
    </Cam>
  );
};

const Hi: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.hi, S.guest], [1, 1.08], clamp)} y={700}>
      <Portrait f={f} bg="home" mood="happy" tears={ramp(f, S.hi, S.hi + 16) * 0.8} stubble={1} light="#f0a860" lightAmt={0.12} />
    </Cam>
  );
};

// ---------------------------------------------------------------- 18. новый игрок
const Guest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam s={interpolate(f, [S.guest, S.find], [1.0, 1.1], clamp)} y={600}>
      <Basement f={f} tablo="0 ₽" sub="КАТОК: 0" lyokha={null} pile={0.15} doorOpen={ramp(f, S.guest, S.guest + 20)} doorLight={1} guest={ramp(f, v(169), v(170) + 6)} />
    </Cam>
  );
};

const Find: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clickAt = v(173) + 4;
  const mv = ramp(f, S.find, clickAt - 2);
  const click = f >= clickAt && f < clickAt + 10 ? (f - clickAt) / 10 : 0;
  return (
    <Cam s={interpolate(f, [S.find, S.end], [1, 1.1], clamp)}>
      <MonitorInsert glow="#ffb070">
        <Menu cursor={[interpolate(mv, [0, 1], [500, 1120]), interpolate(mv, [0, 1], [380, 700])]} click={click} hover={mv > 0.9 ? 1 : 0}
          searching={f >= clickAt ? (f - clickAt) / fps + 1 : -1} />
      </MonitorInsert>
    </Cam>
  );
};

// ---------------------------------------------------------------- 19. финальная карточка
const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 10, fps, 300, 10), c = pop(f, S.end + 18, fps);
  const q = pop(f, v(176), fps), btn = pop(f, v(181) + 4, fps);
  const line = (txt: string, s: number, color: string, size = 110) => (
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, opacity: Math.min(1, s * 2), transform: `scale(${0.7 + 0.3 * s})`, lineHeight: 1.08,
      textShadow: color === RED ? `0 0 40px ${RED}88` : 'none'}}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      {line('9 КАТОК', a, '#fff')}
      {line('9 МИЛЛИОНОВ', b, RED)}
      {line('9 ЛЕТ', c, '#fff')}
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#fff', marginTop: 60, opacity: q, transform: `translateY(${(1 - q) * 20}px)`, lineHeight: 1.2}}>
        А НА КАКОЙ КАТКЕ<br />ВЫШЕЛ БЫ ТЫ?
      </div>
      <div style={{marginTop: 34, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50,
        opacity: btn, transform: `scale(${0.6 + 0.4 * btn})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук
type Fx = [number, string, number];
const flips = (at: number): Fx[] => [[at, 'money/flip.wav', 0.5], [at + 3, 'money/flip.wav', 0.4], [at + 6, 'money/flip.wav', 0.35]];
const SFX: Fx[] = [
  [0, 'money/rustle.wav', 0.5], [0, 'money/cash.wav', 0.5], ...Array.from({length: 9}).map((_, i): Fx => [i * 11, 'money/flip.wav', 0.35]), [44, 'money/rustle.wav', 0.4], [88, 'money/cash.wav', 0.4],
  [S.story, 'sfx2/whoosh.wav', 0.35], [v(17), 'sfx2/riser.wav', 0.25], ...Array.from({length: 14}).map((_, i): Fx => [v(17) + Math.round(Math.pow(i / 14, 2) * 50), 'sfx2/tick.wav', 0.45]),
  [v(21) + 4, 'sfx2/error.wav', 0.4], [v(23), 'tilt/notif.wav', 0.5],
  [S.ad, 'sfx2/whip.wav', 0.3], [v(29), 'tilt/vibrate.wav', 0.5], [v(29) + 2, 'tilt/notif.wav', 0.45], [v(33), 'sfx2/shimmer.wav', 0.3],
  [S.base, 'money/creak.wav', 0.5], [v(39), 'tilt/switch.wav', 0.5], [v(42), 'money/flip.wav', 0.5], [v(42) + 2, 'sfx2/blip_low.wav', 0.35], [v(45), 'money/paper.wav', 0.5],
  [v(47), 'money/paper.wav', 0.3], [v(52), 'money/paper.wav', 0.3], [v(56), 'money/boom.wav', 0.35],
  [S.m1, 'sfx2/whip.wav', 0.35], [S.m1 + 6, 'tilt/accept.wav', 0.4], [v(60) - 2, 'money/win.wav', 0.55], [v(61) - 8, 'money/cash.wav', 0.6],
  [S.m1b, 'money/rustle.wav', 0.5], ...flips(v(61)), [v(62), 'sfx2/shimmer.wav', 0.25],
  ...flips(v(64)), [v(64), 'money/cash.wav', 0.45], ...flips(v(65)), [v(65), 'money/cash.wav', 0.45], [v(64), 'money/rustle.wav', 0.4],
  [S.door, 'sfx2/whoosh.wav', 0.3], [v(70), 'sfx2/tick.wav', 0.6], [v(71), 'sfx2/tick.wav', 0.6], [v(72), 'sfx2/tick.wav', 0.6], [v(73), 'sfx2/tick.wav', 0.6],
  ...flips(v(74)), [v(74), 'money/cash.wav', 0.4],
  [S.cs3, 'sfx2/whip.wav', 0.35], [v(78), 'money/boom.wav', 0.55], [v(80), 'sfx2/riser.wav', 0.3],
  [v(84), 'tilt/vibrate.wav', 0.6], [v(84) + 6, 'tilt/notif.wav', 0.45], [v(87), 'money/boom.wav', 0.5], [v(90) - 4, 'tilt/notif.wav', 0.5], [v(95) + 14, 'sfx2/error.wav', 0.3],
  [v(96), 'money/paper.wav', 0.6], [S.momNote, 'sfx2/whoosh.wav', 0.3], [v(103), 'tilt/heart.wav', 0.5], [v(103) + 10, 'tilt/heart.wav', 0.5],
  [v(108), 'money/boom.wav', 0.55], [v(110), 'money/creak.wav', 0.35], [v(114), 'tilt/heart.wav', 0.35],
  ...flips(v(117)), [v(117), 'money/cash.wav', 0.4], [v(122) + 8, 'sfx2/click.wav', 0.8], [v(122) + 10, 'tilt/accept.wav', 0.4],
  ...flips(v(126)), ...flips(v(130)), [v(130), 'sfx2/deflate.wav', 0.35], [v(134), 'tilt/heart.wav', 0.5], [v(136), 'tilt/heart.wav', 0.5], [v(138), 'tilt/heart.wav', 0.55],
  ...flips(v(139)), [v(139), 'money/boom.wav', 0.5], [S.stop, 'sfx2/impact.wav', 0.6], [S.grab, 'money/rustle.wav', 0.6], [v(145), 'money/creak.wav', 0.5], [v(146), 'sfx2/whoosh.wav', 0.5],
  [S.yard, 'sfx2/shimmer.wav', 0.35], [v(150), 'sfx2/riser.wav', 0.25], [v(156), 'money/boom.wav', 0.55],
  [v(160), 'money/doorbell.wav', 0.6], [v(162) + 6, 'money/creak.wav', 0.4], [S.mom, 'tilt/heart.wav', 0.35],
  [S.guest, 'money/creak.wav', 0.45], [v(173) + 4, 'sfx2/click.wav', 0.8], [v(173) + 6, 'tilt/accept.wav', 0.45],
  [S.end, 'money/boom.wav', 0.5], [S.end + 2, 'sfx2/stamp.wav', 0.4], [S.end + 10, 'sfx2/stamp.wav', 0.45], [S.end + 18, 'sfx2/stamp.wav', 0.4], [v(181) + 4, 'sfx2/pop.wav', 0.4],
];

// все эффекты тише голоса; деньги (шелест, касса, щелчки табло) — заметно тише остальных
const sfxGain = (src: string) => (/money\/(rustle|cash|flip)/.test(src) ? 0.25 : 0.55);

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {Array.from({length: Math.ceil(TOTAL / 11.5)}).map((_, i) => (
      <Sequence key={i} from={Math.round(i * 11.5 * FPS)} durationInFrames={12 * FPS}>
        <Audio src={staticFile('tilt/pad.wav')} volume={(x) => {
          const g = i * 11.5 * FPS + x;
          return g >= S.yard && g < S.guest ? 0.05 : 0.1;
        }} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol * sfxGain(src)} />
      </Sequence>
    ))}
  </>
);

export const Money: React.FC = () => {
  loadFonts();
  loadCaveat();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.story, Hook], [S.story, S.ad, Story], [S.ad, S.one, Ad], [S.one, S.base, One], [S.base, S.note, Base], [S.note, S.m1, Rules],
    [S.m1, S.m1b, Match1, true], [S.m1b, S.m23, () => <Payout from={S.m1b} to={S.m23} seed="m1" />, true], [S.m23, S.door, () => <Payout from={S.m23} to={S.door} seed="m23" />, true],
    [S.door, S.m5, DoorBlink], [S.m5, S.cs3, Match5, true], [S.cs3, S.sig, CS3, true], [S.sig, S.slide, Signal], [S.slide, S.momNote, Slide], [S.momNote, S.year, MomNote],
    [S.year, S.exit, Year, true], [S.exit, S.back, Exit], [S.back, S.forMom, NotBack], [S.forMom, S.more, ForMom], [S.more, S.moreB, More, true], [S.moreB, S.silence, MoreB, true],
    [S.silence, S.fear, Silence], [S.fear, S.ninth, Fear], [S.ninth, S.stop, Ninth, true], [S.stop, S.grab, Stop, true], [S.grab, S.yard, Grab, true],
    [S.yard, S.y2035, Yard, true], [S.y2035, S.apt, Y2035], [S.apt, S.mom, Apt], [S.mom, S.hi, MomScene], [S.hi, S.guest, Hi, true], [S.guest, S.find, Guest], [S.find, S.end, Find, true],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(21) + 4} len={10} />
      <Flash at={v(78)} len={14} color="rgba(255,140,30,0.5)" />
      <Flash at={v(87)} len={14} />
      <Flash at={v(108)} len={14} />
      <Flash at={S.stop} len={14} />
      <Flash at={v(156)} len={14} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};

