// Ролик «Жизнь ксера, у которого нет будущего» (9:16, ~58 с). Грустный формат, без музыки (её добавит пользователь).
// Цветокор: всё изображение обесцвечено, холодный серо-синий тон, зерно и виньетка; движения медленные, без вспышек.
// Исходники пользователя: турнирная сетка FACEIT (public/sad/bracket.png), чат CS2 (chat_c.png — чужие сообщения стёрты).
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {Scene} from '../money/Money';
import {H, Portrait, Mom} from '../money/Props';

export const SAD_FRAMES = fr(TOTAL);

const S = {intro: 0, a15: v(8) - 4, a16: v(17) - 4, a17: v(27) - 4, a18: v(43) - 4, a20: v(53) - 4, a22: v(69) - 4, a25: v(80) - 4, chat: v(103) - 4, end: v(116) - 4};
const MUTED = '#9aa3b2', COLD = '#5a6a8a', DIMRED = '#a8474c';

// мягкое появление без «пружины»
const fade = (f: number, at: number, len = 14) => interpolate(f, [at, at + len], [0, 1], clamp);
const Text: React.FC<{x: number; y: number; at: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, at, size, color = '#e6e8ec', children}) => {
  const f = useCurrentFrame();
  const a = fade(f, at, 18);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, ${-50 + (1 - a) * 12}%)`, opacity: a, fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 4px 12px rgba(0,0,0,0.7)'}}>{children}</div>;
};
const Quote: React.FC<{x: number; y: number; at: number; children: React.ReactNode; size?: number}> = ({x, y, at, children, size = 36}) => {
  const f = useCurrentFrame();
  const a = fade(f, at, 12);
  return <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: a, background: 'rgba(230,232,236,0.92)', color: '#222', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, padding: '14px 26px', borderRadius: 24, whiteSpace: 'nowrap'}}>{children}</div>;
};
// портрет Лёхи в его комнате; медленный наезд
const Room: React.FC<{f: number; from: number; to: number; mood?: 'neutral' | 'worried' | 'happy' | 'tired' | 'shocked'; stubble?: number; look?: number; y?: number}> = ({f, from, to, mood = 'neutral', stubble = 0, look = 0, y = 0}) => (
  <div style={{position: 'absolute', left: 0, top: 360 + y, width: 1080, height: 820, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${interpolate(f, [from, to], [1.0, 1.06], clamp)})`, transformOrigin: '50% 60%'}}>
      <Portrait f={f} bg="dorm" mood={mood} scale={1.15} y={520} stubble={stubble} look={look} light="#5a8acb" lightAmt={0.2} />
    </div>
  </div>
);

// ---------------------------------------------------------------- шапка: возраст · эло (застыло) · часы
const AGES: [number, string, number][] = [[S.a15, '15 ЛЕТ', 500], [S.a16, '16 ЛЕТ', 1800], [S.a17, '17 ЛЕТ', 3200], [S.a18, '18 ЛЕТ', 4700], [S.a20, '20 ЛЕТ', 7600], [S.a22, '22 ГОДА', 10200], [S.a25, '25 ЛЕТ', 14800]];
const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < S.a15) return null;
  const [, age, hours] = [...AGES].reverse().find(([a]) => f >= a)!;
  const elo = 2000 + Math.round(Math.sin(f / 23) * 12);
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: 24, display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(10,11,14,0.75)', borderRadius: 14, padding: '10px 20px', fontFamily: 'Montserrat'}}>
      <span style={{fontFamily: 'Russo One', fontSize: 34, color: '#e6e8ec'}}>{age}</span>
      <div style={{marginLeft: 'auto', textAlign: 'center'}}><div style={{fontSize: 14, color: MUTED, fontWeight: 900}}>ЭЛО</div><div style={{fontFamily: 'Russo One', fontSize: 28, color: '#e6e8ec'}}>{elo.toLocaleString('ru-RU')}</div></div>
      <div style={{textAlign: 'center'}}><div style={{fontSize: 14, color: MUTED, fontWeight: 900}}>ЧАСОВ В CS2</div><div style={{fontFamily: 'Russo One', fontSize: 28, color: '#e6e8ec'}}>{hours.toLocaleString('ru-RU')}</div></div>
    </div>
  );
};

// ---------------------------------------------------------------- сцены
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#08090c'}} />
      <div style={{position: 'absolute', left: 540, top: 760, width: 700, height: 420, transform: 'translate(-50%,-50%)', background: '#0e1016', border: '10px solid #1a1d24', borderRadius: 12, boxShadow: `0 0 ${140 + 20 * Math.sin(f / 15)}px rgba(90,120,180,0.35)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(90,120,180,0.35), rgba(30,40,60,0.2))'}} />
      </div>
      <Text x={540} y={280} at={4} size={52}>КАК ПРОХОДИТ ЖИЗНЬ КСЕРА,</Text>
      <Text x={540} y={370} at={v(4)} size={52} color={MUTED}>У КОТОРОГО НЕТ БУДУЩЕГО?</Text>
    </>
  );
};

const A15: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <div style={{position: 'absolute', left: 560, top: 110, width: 470, height: 260, transform: 'rotate(3deg)', opacity: fade(f, v(12)), background: '#1c2230', border: '5px solid #2c3446', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Russo One', fontSize: 58, color: '#c9d2e3'}}>КИБЕРСПОРТ</div>
      <Room f={f} from={S.a15} to={S.a16} mood="happy" />
      <Text x={290} y={240} at={v(13)} size={52}>«стану про»</Text>
    </>
  );
};

const A16: React.FC = () => {
  const f = useCurrentFrame();
  const air = interpolate(f, [v(18), v(21)], [1, 0.55], clamp);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <Room f={f} from={S.a16} to={S.a17} mood="neutral" />
      <svg width={390} height={330} viewBox="0 0 260 220" style={{position: 'absolute', left: 40, top: 110, opacity: fade(f, S.a16)}}>
        <ellipse cx={130} cy={200 - 90 * air} rx={90} ry={90 * air} fill="#d8dbe0" stroke="#555" strokeWidth={5} />
        <path d={`M100 ${200 - 120 * air} l30 ${-20 * air} l30 ${20 * air} l-10 ${35 * air} h-40 z`} fill="#333" opacity={air} />
      </svg>
      <Quote x={680} y={300} at={v(21)} size={32}>«нужно больше времени на тренировки»</Quote>
    </>
  );
};

const A17: React.FC = () => {
  const f = useCurrentFrame();
  const out = f >= v(38);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <div style={{position: 'absolute', left: 40, top: 140, width: 440, opacity: fade(f, S.a17), textAlign: 'center', fontFamily: 'Montserrat'}}>
        <div style={{fontSize: 190}}>📚</div>
        <div style={{fontWeight: 900, fontSize: 32, color: MUTED}}>друзья — экзамены</div>
      </div>
      <div style={{position: 'absolute', left: 500, top: 150, width: 526 * 1.0, height: 380, opacity: fade(f, v(32)), filter: out ? 'grayscale(1) brightness(0.6)' : 'none'}}>
        <Img src={staticFile('sad/bracket.png')} style={{width: 526, height: 380}} />
        {out && <svg width={526} height={380} viewBox="0 0 526 380" style={{position: 'absolute', inset: 0}}><line x1={30} y1={190} x2={180} y2={230} stroke={DIMRED} strokeWidth={8} strokeLinecap="round" /><line x1={30} y1={230} x2={180} y2={190} stroke={DIMRED} strokeWidth={8} strokeLinecap="round" /></svg>}
      </div>
      <Text x={760} y={580} at={v(32)} size={32} color={MUTED}>Лёха — турнир</Text>
      {out && <Text x={540} y={760} at={v(38)} size={56} color={DIMRED}>ВЫЛЕТ В ПЕРВОМ РАУНДЕ</Text>}
    </>
  );
};

const A18: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <div style={{position: 'absolute', left: 540, top: 420, width: 760, transform: 'translate(-50%,-50%) rotate(-2deg)', opacity: fade(f, v(44)), background: '#e9e6dd', padding: '34px 40px', boxSizing: 'border-box', fontFamily: 'Montserrat', color: '#2a2a2a', boxShadow: '0 20px 40px rgba(0,0,0,0.6)'}}>
        <div style={{fontWeight: 900, fontSize: 24, color: '#666'}}>ПРИЁМНАЯ КОМИССИЯ</div>
        <div style={{fontWeight: 900, fontSize: 42, marginTop: 14}}>Вы не прошли по конкурсу</div>
      </div>
      <div style={{position: 'absolute', left: 540, top: 780, transform: 'translate(-50%,-50%)', opacity: fade(f, v(47)), display: 'flex', alignItems: 'center', gap: 20}}>
        <Img src={staticFile('x2/lvl9.png')} style={{width: 120}} />
        <span style={{fontFamily: 'Russo One', fontSize: 90, color: '#e6e8ec'}}>2 000 ELO</span>
      </div>
      <Text x={540} y={920} at={v(47)} size={34} color={MUTED}>«зато…»</Text>
    </>
  );
};

const A20: React.FC = () => {
  const f = useCurrentFrame();
  const room = f >= v(59);
  const msg = (t: string, at: number) => {
    const a = fade(f, at, 10);
    return <div style={{alignSelf: 'flex-start', maxWidth: 520, background: '#1d2430', color: '#e6e8ec', fontSize: 32, fontWeight: 600, padding: '14px 22px', borderRadius: 20, opacity: a}}>{t}</div>;
  };
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      {!room ? (
        <div style={{position: 'absolute', left: 540, top: 600, width: 600, height: 860, transform: 'translate(-50%,-50%)', borderRadius: 56, background: '#0b0c10', border: '10px solid #22262e', overflow: 'hidden', fontFamily: 'Montserrat'}}>
          <div style={{height: 110, background: '#1a1f28', display: 'flex', alignItems: 'flex-end', padding: '0 28px 18px', fontSize: 30, color: '#e6e8ec', fontWeight: 900}}>Пацаны</div>
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
            {msg('всё, я уехал в Питер', v(55))}
            {msg('я теперь в Москве', v(57))}
            {msg('увидимся летом?', v(58))}
          </div>
        </div>
      ) : (
        <>
          <Room f={f} from={v(59)} to={S.a22} mood="tired" />
          <Text x={540} y={240} at={v(62)} size={40} color={MUTED}>та же комната. тот же монитор.</Text>
        </>
      )}
    </>
  );
};

const A22: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <Room f={f} from={S.a22} to={S.a25} mood="tired" stubble={0.4} look={0.6} />
      <div style={{position: 'absolute', left: 10, top: 110, width: 1080, height: H, transform: 'scale(0.5)', transformOrigin: '0 0', opacity: fade(f, v(71))}}><Mom tears={0} f={f} /></div>
      <Quote x={300} y={170} at={v(72)} size={30}>помоги с ремонтом?</Quote>
      <Quote x={760} y={500} at={v(76)} size={34}>«мам, у меня катка»</Quote>
    </>
  );
};

const A25: React.FC = () => {
  const f = useCurrentFrame();
  const phone = f < v(87);
  const cross = (at: number, y: number, t: string) => (
    <div style={{position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', opacity: fade(f, at, 10), fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, color: '#c9ccd2'}}>
      <span style={{textDecoration: 'line-through', textDecorationColor: DIMRED, textDecorationThickness: 6}}>{t}</span>
    </div>
  );
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      {phone ? (
        <div style={{position: 'absolute', left: 540, top: 600, width: 600, height: 860, transform: 'translate(-50%,-50%)', borderRadius: 56, background: '#0b0c10', border: '10px solid #22262e', overflow: 'hidden', fontFamily: 'Montserrat', padding: 30, boxSizing: 'border-box'}}>
          {[0, 1].map((i) => (
            <div key={i} style={{marginTop: i ? 24 : 70, background: '#151922', borderRadius: 18, padding: 20, opacity: fade(f, v(83) + i * 12)}}>
              <div style={{height: 260, borderRadius: 12, background: 'linear-gradient(#cfd4dc, #9aa3b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110}}>💍</div>
              <div style={{color: '#e6e8ec', fontWeight: 900, fontSize: 26, marginTop: 12}}>{i ? 'Дэн и Катя 🤍' : 'Макс и Лена 🤍'}</div>
              <div style={{color: MUTED, fontSize: 22, marginTop: 4}}>♡ {i ? 214 : 187}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Room f={f} from={v(87)} to={S.chat} mood="tired" stubble={0.8} />
          <div style={{position: 'absolute', left: 540, top: 200, transform: 'translate(-50%,-50%)', opacity: fade(f, v(93)), display: 'flex', alignItems: 'center', gap: 16}}>
            <Img src={staticFile('x2/lvl9.png')} style={{width: 90}} /><span style={{fontFamily: 'Russo One', fontSize: 70, color: '#e6e8ec'}}>2 000</span>
          </div>
          {cross(v(96), 330, 'команда')}
          {cross(v(98), 410, 'профессия')}
          {cross(v(100), 490, 'люди вокруг')}
        </>
      )}
    </>
  );
};

const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const text = 'кто со мной катку?';
  const typed = text.slice(0, Math.floor(interpolate(f, [v(108), v(111) + 10], [0, text.length], clamp)));
  const sent = f >= v(112);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%,-50%) scale(1.5)'}}>
        <div style={{position: 'relative', width: 622, height: 481}}>
          <Img src={staticFile('sad/chat_c.png')} style={{width: 622, height: 481}} />
          {sent && <div style={{position: 'absolute', left: 20, top: 305, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 19, color: '#fff'}}>[ALL] <span style={{color: '#e8c24a'}}>Лёха:</span> {text}</div>}
          <div style={{position: 'absolute', left: 30, top: 363, width: 420, height: 30, background: '#1b1716'}} />
          <div style={{position: 'absolute', left: 32, top: 364, fontFamily: 'Montserrat', fontWeight: 600, fontSize: 19, color: '#ddd'}}>{sent ? '' : typed}<span style={{opacity: f % 30 < 15 ? 1 : 0}}>|</span></div>
        </div>
      </div>
      {f >= v(112) && <Text x={540} y={1000} at={v(113)} size={36} color={MUTED}>…</Text>}
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const dark = interpolate(f, [v(123), fr(TOTAL)], [0, 1], clamp);
  return (
    <>
      <AbsoluteFill style={{height: H, background: '#0d0f13'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: H, transform: `scale(${interpolate(f, [S.end, fr(TOTAL)], [1.15, 0.85], clamp)})`, transformOrigin: '50% 70%'}}>
        <Room f={f} from={S.end} to={fr(TOTAL)} mood="tired" stubble={1} />
      </div>
      <AbsoluteFill style={{height: H, background: '#000', opacity: dark}} />
    </>
  );
};

// цветокор поверх сцен: обесцвечивание + холодный тон + зерно + виньетка
const Grade: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{height: H, overflow: 'hidden'}}>
      <AbsoluteFill style={{height: H, filter: 'saturate(0.25) contrast(0.95) brightness(1.12)'}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{height: H, background: COLD, opacity: 0.18, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{height: H, opacity: 0.08, backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: `${(f * 37) % 50}px ${(f * 53) % 50}px`}} />
      <AbsoluteFill style={{height: H, background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6))'}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук: только голос (+ пара очень тихих деталей); музыку добавит автор
type Fx = [number, string, number];
const SFX: Fx[] = [[v(18), 'sfx2/deflate.wav', 0.15], [v(55), 'tilt/notif.wav', 0.12], [v(83), 'tilt/notif.wav', 0.12], ...Array.from({length: 6}).map((_, i): Fx => [v(108) + i * 9, 'sfx2/key1.wav', 0.12])];

const Sound: React.FC = () => (
  <>
    {VO.map((o) => (
      <Sequence key={o.src} from={fr(o.at)} durationInFrames={fr(o.dur) + 6}>
        <Audio src={staticFile(o.src)} volume={1} />
      </Sequence>
    ))}
    {SFX.map(([at, src, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={FPS * 2}>
        <Audio src={staticFile(src)} volume={vol} />
      </Sequence>
    ))}
  </>
);

export const Sad: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC][] = [
    [S.intro, S.a15, Intro], [S.a15, S.a16, A15], [S.a16, S.a17, A16], [S.a17, S.a18, A17], [S.a18, S.a20, A18],
    [S.a20, S.a22, A20], [S.a22, S.a25, A22], [S.a25, S.chat, A25], [S.chat, S.end, Chat], [S.end, fr(TOTAL), End],
  ];
  return (
    <AbsoluteFill style={{background: '#08090c'}}>
      <Grade>
        {order.map(([from, to, C], i) => <Scene key={i} from={from} to={to} zoom={0.02}><C /></Scene>)}
        <TopBar />
      </Grade>
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(8,9,12,0), #08090c)'}} />
      <Captions cues={CUES} />
      <Sound />
    </AbsoluteFill>
  );
};
