// TikTok-ролик «Мамина карта и кейсы» (9:16, ≈59,8 с). Герой — Лёха v2, формат «одна ошибка».
// Исходники пользователя: экран открытия кейса (public/momcard/roll.png, unlock.png) и история покупок Steam
// (hist_head.png — только шапка; строки и суммы перерисованы, ник убран). Банк и карта — выдуманные, без логотипов.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED, Mom} from '../money/Props';
import {Roulette, Grid100, Rar, SORTED, CaseIcon, KnifeIcon} from '../cases/Rig';

export const MOM_FRAMES = fr(TOTAL);

const S = {
  hook: 0, card: v(18) - 4, first: v(35) - 4, spin: v(46) - 4, rage: v(50) - 4, minus: v(57) - 3, sms: v(65) - 4, support: v(77) - 4,
  no: v(83) - 4, tips: v(93) - 4, t1: v(96) - 4, t2: v(103) - 4, t3: v(111) - 4, mom: v(125) - 4, end: fr(57.6),
};
const GREEN = '#2bd96b', GOLD = '#ffd23f', STEAM = '#1b2838';

const Bg: React.FC<{glow?: string}> = ({glow = '#2a4a8a'}) => (
  <AbsoluteFill style={{height: H, backgroundColor: '#0b0c12', backgroundImage: `radial-gradient(ellipse at 50% 35%, ${glow}55, #0b0c12 70%), radial-gradient(rgba(120,150,230,0.1) 2px, transparent 2px)`, backgroundSize: 'auto, 44px 44px'}} />
);
const Big: React.FC<{x: number; y: number; s: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, s, size, color = '#fff', children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), fontFamily: 'Montserrat', fontWeight: 900, fontSize: size,
    color, whiteSpace: 'nowrap', textAlign: 'center', lineHeight: 1.05, textShadow: color === '#fff' ? '0 4px 0 rgba(0,0,0,0.6)' : `0 0 34px ${color}88, 0 4px 0 rgba(0,0,0,0.6)`}}>{children}</div>
);
const Chip: React.FC<{x: number; y: number; s: number; bg: string; color?: string; size?: number; children: React.ReactNode}> = ({x, y, s, bg, color = '#fff', size = 40, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: Math.min(1, s * 2), background: bg, color, fontFamily: 'Montserrat', fontWeight: 900,
    fontSize: size, padding: '12px 30px', borderRadius: 50, whiteSpace: 'nowrap', boxShadow: `0 0 30px ${bg}88`}}>{children}</div>
);

// банковская карта (выдуманная, без логотипов)
const BankCard: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 520, height: 320, transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`, borderRadius: 28,
    background: 'linear-gradient(135deg, #3a4a7a, #1a2340 60%, #2a1a3a)', boxShadow: '0 24px 50px rgba(0,0,0,0.6)', fontFamily: 'Montserrat', color: '#fff', padding: 36, boxSizing: 'border-box'}}>
    <div style={{width: 72, height: 54, borderRadius: 10, background: 'linear-gradient(135deg, #e8c66a, #b2873a)', marginTop: 10}} />
    <div style={{fontSize: 40, letterSpacing: 6, marginTop: 36, fontWeight: 600}}>•••• •••• •••• 4471</div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 28, opacity: 0.9}}><span>МАМА</span><span>09/29</span></div>
  </div>
);

// телефон мамы с СМС от банка (банк выдуманный)
const PhoneSms: React.FC<{f: number; count: number}> = ({f, count}) => {
  const smss = [
    {sum: '−1 290 ₽', bal: '18 410 ₽'},
    {sum: '−2 580 ₽', bal: '15 830 ₽'},
    {sum: '−5 160 ₽', bal: '10 670 ₽'},
    {sum: '−9 030 ₽', bal: '1 640 ₽'},
  ];
  return (
    <div style={{position: 'absolute', left: 540, top: 600, width: 520, height: 940, transform: 'translate(-50%, -50%)', borderRadius: 60, background: '#0b0c11', border: '9px solid #2c2f38', overflow: 'hidden', fontFamily: 'Montserrat', boxShadow: '0 30px 70px rgba(0,0,0,0.7)'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#141826, #0a0b10)'}} />
      <div style={{position: 'absolute', left: '50%', top: 16, width: 150, height: 38, borderRadius: 22, background: '#000', transform: 'translateX(-50%)'}} />
      <div style={{position: 'absolute', top: 70, width: '100%', textAlign: 'center', color: '#c9cede', fontSize: 26, fontWeight: 600}}>Банк · сейчас</div>
      <div style={{position: 'absolute', top: 120, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 16}}>
        {smss.slice(0, count).map((m, i) => (
          <div key={i} style={{background: 'rgba(255,255,255,0.12)', borderRadius: 24, padding: '18px 22px', border: i === count - 1 ? `3px solid ${RED}` : '3px solid transparent',
            transform: `scale(${i === count - 1 ? 0.9 + 0.1 * Math.min(1, (f - S.sms) / 6) : 1})`}}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <div style={{width: 50, height: 50, borderRadius: 12, background: '#2a7a4a', color: '#fff', fontWeight: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Б</div>
              <div style={{fontSize: 24, fontWeight: 900, color: '#fff'}}>Списание</div>
              <div style={{marginLeft: 'auto', fontSize: 30, fontWeight: 900, color: RED}}>{m.sum}</div>
            </div>
            <div style={{fontSize: 24, color: '#c9cede', marginTop: 8, fontWeight: 600}}>Покупка Steam. Баланс: {m.bal}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a3a6a" />
      <div style={{position: 'absolute', left: 0, top: 520, width: 1080, height: 660, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood={f > v(10) ? 'happy' : 'neutral'} look={0.3} scale={1.05} y={420} />
      </div>
      <div style={{position: 'absolute', left: 540, top: 300, transform: 'translate(-50%,-50%)'}}><CaseIcon w={340} /></div>
      {f >= v(8) && f < v(14) && <Chip x={540} y={980} s={pop(f, v(8), fps)} bg={GREEN} size={46}>🛡 ТВОИ ДЕНЬГИ — ТВОЁ ДЕЛО</Chip>}
      {f >= v(14) && <Chip x={540} y={980} s={pop(f, v(14), fps, 320, 9)} bg={RED} size={50}>ОДНА ОШИБКА</Chip>}
    </>
  );
};

const Card: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const give = interpolate(f, [v(18), v(22)], [0, 1], clamp);
  const saved = f >= v(31);
  const checkRed = f >= S.first - 10;
  return (
    <>
      <Bg glow="#1a4a6a" />
      <Chip x={540} y={140} s={pop(f, v(18), fps)} bg="#1c2030" size={38}>👩 МАМА ОДИН РАЗ ДАЛА КАРТУ</Chip>
      <BankCard x={interpolate(give, [0, 1], [320, 540])} y={interpolate(give, [0, 1], [430, 460])} s={interpolate(give, [0, 1], [0.7, 1.05], clamp)} rot={interpolate(give, [0, 1], [-14, -4])} />
      {saved && (
        <div style={{position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) scale(${pop(f, v(31), fps)})`, display: 'flex', alignItems: 'center', gap: 18, background: '#121722',
          border: `4px solid ${checkRed ? RED : '#2a3244'}`, borderRadius: 18, padding: '20px 32px', fontFamily: 'Montserrat'}}>
          <div style={{width: 48, height: 48, borderRadius: 10, background: checkRed ? RED : GREEN, color: '#fff', fontSize: 34, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
          <div style={{fontSize: 36, fontWeight: 900, color: '#fff'}}>Сохранить карту в Steam</div>
        </div>
      )}
      {f >= S.first - 8 && <Big x={540} y={1050} s={pop(f, S.first - 8, fps, 320, 10)} size={62} color={RED}>ОШИБКА</Big>}
    </>
  );
};

const RouletteScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // первый кейс: медленная прокрутка, результат синий
  const prog = 1 - Math.pow(1 - interpolate(f, [S.first, v(41)], [0, 1], clamp), 3);
  return (
    <>
      <Bg />
      <Img src={staticFile('momcard/roll.png')} style={{position: 'absolute', left: 0, top: 150, width: 1080, height: 606, objectFit: 'cover', opacity: 0.25}} />
      <Chip x={540} y={120} s={pop(f, S.first, fps)} bg="#1c2030" size={40}>«ДА ОДИН, ПРОСТО ПОСМОТРЕТЬ»</Chip>
      <Roulette p={prog} result="blue" seed="c1" y={360} done={f >= v(41)} />
      {f >= v(41) && f < v(42) && <Big x={540} y={720} s={pop(f, v(41), fps)} size={56} color="#4b69ff">СИНЬКА</Big>}
      {f >= v(42) && <Big x={540} y={720} s={pop(f, v(42), fps)} size={56} color="#8847ff">ПОЧТИ ПОВЕЗЛО</Big>}
      <Chip x={540} y={900} s={pop(f, v(46), fps)} bg="#1c2030" size={40}>ЕЩЁ 5… ЕЩЁ 10…</Chip>
    </>
  );
};

const Rage: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const spin = ((f - S.rage) * 0.09) % 1;
  const n = Math.min(100, Math.floor((f - S.rage) / 1.4));
  const cells = SORTED.slice(0, n);
  return (
    <>
      <Bg glow="#3a1016" />
      <AbsoluteFill style={{height: H, background: `rgba(255,43,54,${0.12 + 0.06 * Math.sin(f / 4)})`}} />
      <Roulette p={spin} result="blue" seed={`r${Math.floor((f - S.rage) / 8)}`} y={230} />
      <Chip x={540} y={150} s={1} bg={RED} size={42}>ОН УЖЕ НЕ ОТКРЫВАЕТ — ОТЫГРЫВАЕТСЯ</Chip>
      <Grid100 cells={cells as Rar[]} x={300} y={560} size={46} gap={6} />
      <div style={{position: 'absolute', right: 70, top: 600, transform: 'translateY(-50%)'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#fff'}}>ОТКРЫТО</div>
        <div style={{fontFamily: 'Russo One', fontSize: 120, color: RED, textShadow: `0 0 30px ${RED}`}}>{n}</div>
      </div>
    </>
  );
};

const Minus: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grid = SORTED.slice(0, 100);
  return (
    <>
      <Bg glow="#3a1016" />
      <Big x={540} y={240} s={pop(f, S.minus, fps, 300, 9)} size={70} color="#fff">К ВЕЧЕРУ</Big>
      <Big x={540} y={420} s={pop(f, S.minus + 6, fps, 320, 9)} size={160} color={RED}>−18 000 ₽</Big>
      <Grid100 cells={grid as Rar[]} x={300} y={760} size={46} gap={6} />
      {f >= v(62) && <Chip x={540} y={1070} s={pop(f, v(62), fps, 320, 9)} bg="#1c2030" color={RED} size={48}>НИ ОДНОГО НОЖА</Chip>}
    </>
  );
};

const Sms: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = f < v(68) ? 1 : f < v(72) ? 2 : f < v(75) ? 3 : 4;
  return (
    <>
      <Bg glow="#2a1a1a" />
      <Chip x={540} y={120} s={pop(f, S.sms, fps)} bg="#1c2030" size={40}>☀️ А УТРОМ — ТЕЛЕФОН МАМЫ</Chip>
      <PhoneSms f={f} count={count} />
    </>
  );
};

const Support: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const denied = f >= S.no;
  return (
    <>
      <Bg glow="#1a3a5a" />
      <Chip x={540} y={140} s={pop(f, v(77), fps)} bg="#1c2030" size={38}>«ВЕРНУ ЧЕРЕЗ ПОДДЕРЖКУ»</Chip>
      <div style={{position: 'absolute', left: 90, top: 320, width: 900, background: '#171a24', borderRadius: 20, padding: 40, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize: 34, color: '#8f98a0', fontWeight: 600}}>Поддержка Steam</div>
        <div style={{fontSize: 40, color: '#fff', fontWeight: 900, marginTop: 20}}>Запрос на возврат средств</div>
        <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 18}}>
          <CaseIcon w={120} />
          <div style={{fontSize: 32, color: '#c9cede', fontWeight: 600}}>Ключ от кейса × 23<br /><span style={{color: '#8f98a0', fontSize: 26}}>использованы</span></div>
        </div>
        {denied && (
          <div style={{marginTop: 30, padding: '22px 26px', borderRadius: 14, background: 'rgba(235,75,75,0.15)', border: `3px solid ${RED}`, transform: `scale(${pop(f, S.no, fps)})`, transformOrigin: 'left'}}>
            <div style={{fontSize: 36, color: RED, fontWeight: 900}}>✕ Отклонено</div>
            <div style={{fontSize: 28, color: '#ffb3b8', marginTop: 8}}>Предмет использован. Возврат невозможен.</div>
          </div>
        )}
      </div>
      {f >= v(90) && <Big x={540} y={980} s={pop(f, v(90), fps, 320, 9)} size={58} color={RED}>КЛЮЧ ИСПОЛЬЗОВАН — ВСЁ</Big>}
    </>
  );
};

const Tips: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tip = (at: number, y: number, n: string, t: string, icon: React.ReactNode) => {
    const s = pop(f, at, fps);
    return (
      <div style={{position: 'absolute', left: 540, top: y, width: 940, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2), display: 'flex', alignItems: 'center', gap: 26,
        background: '#121722', border: '3px solid #2a3244', borderRadius: 24, padding: '26px 32px', fontFamily: 'Montserrat'}}>
        <div style={{width: 92, height: 92, borderRadius: 18, background: '#0a0d14', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
        <div><div style={{fontSize: 28, fontWeight: 900, color: GOLD}}>{n}</div><div style={{fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginTop: 6}}>{t}</div></div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#1a4a3a" />
      <Big x={540} y={150} s={pop(f, S.tips, fps)} size={60} color="#fff">ЧТО ДЕЛАТЬ?</Big>
      {tip(S.t1, 400, 'ПЕРВОЕ', 'Не сохраняй чужую карту в Steam', <svg width={56} height={40} viewBox="0 0 56 40"><rect width={56} height={40} rx={6} fill="#3a4a7a" /><rect y={10} width={56} height={9} fill="#101522" /><line x1={6} y1={34} x2={50} y2={6} stroke={RED} strokeWidth={5} /></svg>)}
      {tip(S.t2, 620, 'ВТОРОЕ', 'Ставь лимит до того, как начал', <span style={{color: GOLD, fontWeight: 900, fontSize: 40}}>⏱</span>)}
      {tip(S.t3, 840, 'ТРЕТЬЕ', 'Кейс — лотерея. В плюсе тот, кто продаёт', <CaseIcon w={74} />)}
    </>
  );
};

const MomScene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#2a1a2a" />
      <div style={{position: 'absolute', left: 0, top: 120, width: 1080, height: 1060, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: -180, width: 1080, height: 1180}}><Mom tears={0} f={f} /></div>
      </div>
      <div style={{position: 'absolute', left: 820, top: 360, transform: `translate(-50%,-50%) rotate(8deg) scale(${pop(f, S.mom + 6, fps)})`}}><CaseIcon w={190} /></div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const m = pop(f, S.end, fps, 320, 9), p = pop(f, S.end + 8, fps);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a1a3a, #0b0c12 70%)', alignItems: 'center', justifyContent: 'center', paddingBottom: 240, textAlign: 'center'}}>
      <div style={{transform: `scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 2)}}><CaseIcon w={220} /></div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: '#fff', background: RED, padding: '6px 18px', borderRadius: 8, opacity: p, letterSpacing: 3, marginTop: 30}}>ЧАСТЬ 2</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', marginTop: 16, opacity: p, lineHeight: 1.05}}>ПАПА<br />УЗНАЛ?</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса; деньги тихо)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [0, 'money/boom.wav', 0.4], [v(8), 'sfx2/pop.wav', 0.3], [v(14), 'sfx2/impact.wav', 0.45],
  [v(22), 'money/flip.wav', 0.3], [v(31), 'sfx2/click.wav', 0.4], [S.first - 8, 'sfx2/stamp.wav', 0.4],
  [S.first, 'sfx2/whoosh.wav', 0.3], [v(41), 'sfx2/ding.wav', 0.3], [v(42), 'sfx2/ding.wav', 0.3],
  ...Array.from({length: 10}).map((_, i): Fx => [S.rage + i * 8, 'sfx2/tick.wav', 0.3]),
  [S.minus, 'sfx2/deflate.wav', 0.4], [S.minus + 6, 'money/boom.wav', 0.4],
  ...Array.from({length: 4}).map((_, i): Fx => [v(65) + i * 90, 'tilt/notif.wav', 0.3]),
  [S.no, 'sfx2/error.wav', 0.35], [S.tips, 'sfx2/whoosh.wav', 0.3],
  [S.t1, 'sfx2/blip.wav', 0.3], [S.t2, 'sfx2/blip.wav', 0.3], [S.t3, 'sfx2/blip.wav', 0.3],
  [S.mom, 'money/creak.wav', 0.3], [S.end, 'money/boom.wav', 0.5],
];
const GAIN = 0.5;

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

export const Momcard: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.card, Hook], [S.card, S.first, Card, true], [S.first, S.rage, RouletteScene, true], [S.rage, S.minus, Rage, true], [S.minus, S.sms, Minus, true],
    [S.sms, S.support, Sms, true], [S.support, S.tips, Support, true], [S.tips, S.mom, Tips, true], [S.mom, S.end, MomScene, true],
  ];
  return (
    <AbsoluteFill style={{background: '#0b0c12'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={S.first - 8} len={10} />
      <Flash at={S.minus + 6} len={12} />
      <Flash at={S.no} len={10} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(11,12,18,0), #0b0c12)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
