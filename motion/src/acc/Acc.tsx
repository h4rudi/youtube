// TikTok-ролик «Дал другу аккаунт на одну катку» (9:16, ≈58,5 с). Герой — Лёха v2.
// Профиль Steam собран заново по скрину пользователя (раскладка и красная строка «1 блокировка VAC»),
// без данных реального аккаунта: аватар, ник и витрина — Лёхины. «Читерское» меню — условное, без названий программ.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFonts} from '../theme';
import {FPS, fr} from '../tilt/script';
import {VO, TOTAL, CUES, v} from './script';
import {Captions, clamp, pop} from '../tilt/UI';
import {ramp} from '../tilt/Tilt';
import {Scene, Cam, Flash} from '../money/Money';
import {Portrait, H, RED} from '../money/Props';
import {LyokhaHead} from '../money/Lyokha';

export const ACC_FRAMES = fr(TOTAL);

const S = {
  hook: 0, ask: v(18) - 4, login: v(30) - 4, matches: v(35) - 4, cheat: v(42) - 4, week: v(53) - 4, vac: v(55) - 4, friend: v(70) - 4,
  loss: v(76) - 4, rule: v(87) - 4, fresh: v(98) - 4, last: v(104) - 4, end: fr(55.2),
};
const GOLD = '#ffd23f', GREEN = '#2bd96b', VACRED = '#c94a4a', STEAM = '#1b2838', TG = '#2aabee';

const Bg: React.FC<{glow?: string}> = ({glow = '#3a4a8a'}) => (
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

// аватарка-квадрат с лицом Лёхи (или серая «новая»)
export const Avatar: React.FC<{size: number; fresh?: boolean; mood?: 'neutral' | 'shocked' | 'happy' | 'worried' | 'tired'}> = ({size, fresh, mood = 'happy'}) => (
  <div style={{width: size, height: size, border: '4px solid #5c7e10', background: fresh ? '#3d4450' : 'linear-gradient(#2a3045, #12141c)', overflow: 'hidden', flexShrink: 0}}>
    {fresh
      ? <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size * 0.6, color: '#8f98a0'}}>?</div>
      : <svg width={size} height={size} viewBox="-200 -230 400 400"><LyokhaHead mood={mood} /></svg>}
  </div>
);

// профиль Steam (раскладка как на скрине пользователя)
export const SteamProfile: React.FC<{vac: number; fresh?: boolean; f: number; items?: number; level?: number; name?: string; mood?: 'neutral' | 'shocked' | 'happy' | 'worried' | 'tired'}> = ({vac, fresh, f, items = 708, level = 32, name = 'Лёха', mood}) => {
  const pulse = vac > 0 ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return (
    <div style={{position: 'absolute', left: 30, top: 150, width: 1020, height: 860, background: `linear-gradient(160deg, #2a3446, ${STEAM} 40%, #141a24)`, borderRadius: 16, overflow: 'hidden',
      fontFamily: 'Montserrat', boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
      <div style={{display: 'flex', gap: 30, padding: 34}}>
        <Avatar size={200} fresh={fresh} mood={mood} />
        <div style={{flex: 1, paddingTop: 10}}>
          <div style={{fontSize: 54, color: '#fff', fontWeight: 600}}>{name} ▾</div>
          <div style={{fontSize: 26, color: '#8f98a0', marginTop: 10}}>{fresh ? 'Информация отсутствует.' : 'Играю в CS с 2015 · 10 lvl FACEIT скоро'}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, height: 60, paddingTop: 10}}>
          <span style={{fontSize: 34, color: '#fff', fontWeight: 600}}>Уровень</span>
          <span style={{width: 56, height: 56, borderRadius: 28, border: `4px solid ${level > 1 ? '#c94a4a' : '#9b9b9b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff'}}>{level}</span>
        </div>
      </div>
      <div style={{display: 'flex', gap: 24, padding: '0 34px'}}>
        <div style={{flex: 1.6}}>
          <div style={{background: 'rgba(0,0,0,0.35)', padding: '16px 22px', fontSize: 28, color: '#fff', fontWeight: 600}}>Витрина предметов</div>
          <div style={{background: 'rgba(0,0,0,0.2)', padding: 22, minHeight: 300}}>
            {fresh ? (
              <div style={{fontSize: 30, color: '#8f98a0', paddingTop: 20}}>Пусто</div>
            ) : (
              <>
                <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                  {['y2013/k_fade.png', 'y2013/k_doppler.png', 'y2013/bf_emerald.png', 'y2013/k_tiger.png'].map((p) => (
                    <div key={p} style={{width: 140, height: 104, background: 'linear-gradient(#3a2e14, #1d1a12)', borderBottom: '6px solid #e4ae39', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Img src={staticFile(p)} style={{width: 124}} />
                    </div>
                  ))}
                  <div style={{width: 140, height: 104, background: 'linear-gradient(#14303a, #12191d)', borderBottom: '6px solid #d32ce6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Img src={staticFile('y2013/sticker_titan.png')} style={{height: 90}} />
                  </div>
                </div>
                <div style={{fontSize: 56, color: '#fff', marginTop: 20}}>{items}</div>
                <div style={{fontSize: 26, color: '#8f98a0'}}>Предметов</div>
              </>
            )}
          </div>
          <div style={{background: 'rgba(0,0,0,0.35)', padding: '16px 22px', fontSize: 28, color: '#fff', fontWeight: 600, marginTop: 20, display: 'flex', justifyContent: 'space-between'}}>
            <span>Counter-Strike 2</span><span style={{color: '#8f98a0', fontWeight: 600}}>{fresh ? '0 ч.' : '3 000 ч. в игре'}</span>
          </div>
        </div>
        <div style={{flex: 1, background: 'rgba(0,0,0,0.25)', padding: 22}}>
          <div style={{fontSize: 34, color: '#8f98a0'}}>Не в сети</div>
          {vac > 0 && (
            <div style={{marginTop: 30, padding: 10, border: `3px solid rgba(201,74,74,${pulse})`, borderRadius: 8, opacity: Math.min(1, vac * 2)}}>
              <div style={{fontSize: 26, color: VACRED}}>1 блокировка VAC <span style={{color: '#fff'}}>| Подробнее</span></div>
              <div style={{fontSize: 24, color: VACRED, marginTop: 6}}>Дней с последней блокировки: 0</div>
            </div>
          )}
          <div style={{fontSize: 30, color: '#fff', marginTop: 30}}>Значки <span style={{color: '#8f98a0'}}>{fresh ? 0 : 6}</span></div>
          {!fresh && <div style={{display: 'flex', gap: 10, marginTop: 12}}>{['#c94a4a', '#8f98a0', '#5c7e10', '#e4ae39'].map((c) => <div key={c} style={{width: 54, height: 54, borderRadius: 27, background: c, border: '3px solid #0b0c12'}} />)}</div>}
          <div style={{fontSize: 30, color: '#fff', marginTop: 30}}>Инвентарь</div>
        </div>
      </div>
    </div>
  );
};

// чат Telegram
type Msg = {me?: boolean; text: string; at: number};
const Chat: React.FC<{f: number; msgs: Msg[]; y?: number; title?: string}> = ({f, msgs, y = 200, title = 'Санёк'}) => (
  <div style={{position: 'absolute', left: 60, top: y, width: 960, background: '#17212b', borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', fontFamily: 'Montserrat'}}>
    <div style={{height: 90, background: '#232e3c', display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px'}}>
      <div style={{width: 58, height: 58, borderRadius: 29, background: '#f0a24a', color: '#fff', fontWeight: 900, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>С</div>
      <div><div style={{fontSize: 32, color: '#fff', fontWeight: 900}}>{title}</div><div style={{fontSize: 22, color: '#6c7883'}}>в сети</div></div>
      <svg width={40} height={36} viewBox="0 0 50 44" style={{marginLeft: 'auto'}}><path d="M2 20 L46 2 L38 42 L24 32 L18 40 L18 28 L40 8 L14 26 Z" fill={TG} /></svg>
    </div>
    <div style={{padding: 24, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 200}}>
      {msgs.map((m, i) => {
        const a = Math.min(1, (f - m.at) / 6);
        if (a <= 0) return null;
        return (
          <div key={i} style={{alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: 720, background: m.me ? '#2b5278' : '#182533', color: '#fff', fontSize: 38, fontWeight: 600,
            padding: '16px 24px', borderRadius: 22, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>{m.text}</div>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------- сцены
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shield = pop(f, v(11), fps);
  return (
    <>
      <Bg />
      <Cam s={interpolate(f, [0, S.ask], [1.0, 1.04], clamp)}>
        <SteamProfile vac={0} f={f} />
      </Cam>
      {shield > 0 && f < v(17) && (
        <div style={{position: 'absolute', left: 540, top: 1080, transform: `translate(-50%, -50%) scale(${shield})`}}><Chip x={0} y={0} s={1} bg={GREEN} size={44}>🛡 В БЕЗОПАСНОСТИ</Chip></div>
      )}
      {f >= v(17) && <div style={{position: 'absolute', left: 540, top: 1080, transform: `translate(-50%, -50%) scale(${pop(f, v(17), fps, 300, 9)})`}}><Chip x={0} y={0} s={1} bg={RED} size={44}>ОДНА ОШИБКА</Chip></div>}
    </>
  );
};

const Ask: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a4a6a" />
      <Chip x={540} y={150} s={pop(f, v(19), fps)} bg="#1c2030" size={40}>🧳 ЛЁХА УЕЗЖАЕТ НА ВЫХОДНЫЕ</Chip>
      <Chat f={f} y={260} msgs={[{text: 'бро, дай поиграть на твоём акке', at: v(23)}, {text: 'у меня ранг плохой 😩', at: v(26)}]} />
      <div style={{position: 'absolute', left: 0, top: 640, width: 1080, height: 540, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood="neutral" look={0.4} scale={1.0} y={330} />
      </div>
    </>
  );
};

const Login: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const user = 'lyokha_cs'.slice(0, Math.ceil(ramp(f, v(30), v(30) + 14) * 9));
  const pass = Math.ceil(ramp(f, v(31), v(31) + 14) * 10);
  return (
    <>
      <Bg glow="#1a3a6a" />
      <div style={{position: 'absolute', left: 90, top: 200, width: 900, background: '#181a21', borderRadius: 14, padding: 46, boxSizing: 'border-box', fontFamily: 'Montserrat', boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
        <div style={{fontSize: 40, color: '#fff', fontWeight: 900, letterSpacing: 6}}>STEAM</div>
        <div style={{fontSize: 24, color: '#1999ff', fontWeight: 900, marginTop: 30}}>ВОЙТИ, ИСПОЛЬЗУЯ ИМЯ АККАУНТА</div>
        <div style={{height: 76, background: '#32353c', borderRadius: 6, marginTop: 12, display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 36, color: '#fff'}}>{user}<span style={{opacity: f % 30 < 15 && pass === 0 ? 1 : 0}}>|</span></div>
        <div style={{fontSize: 24, color: '#afafaf', fontWeight: 900, marginTop: 26}}>ПАРОЛЬ</div>
        <div style={{height: 76, background: '#32353c', borderRadius: 6, marginTop: 12, display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 40, color: '#fff', letterSpacing: 6}}>{'•'.repeat(pass)}</div>
        <div style={{marginTop: 34, height: 76, borderRadius: 6, background: 'linear-gradient(90deg, #06bfff, #2d73ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: '#fff', fontWeight: 900}}>Войти</div>
      </div>
      <div style={{position: 'absolute', right: 70, top: 900, background: '#2b5278', color: '#fff', fontFamily: 'Montserrat', fontWeight: 600, fontSize: 40, padding: '18px 28px', borderRadius: 22,
        transform: `scale(${pop(f, v(32), fps)})`, transformOrigin: 'right'}}>только не косячь</div>
    </>
  );
};

const Matches: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const row = (at: number, win: boolean, score: string, i: number) => {
    const s = pop(f, at, fps);
    return (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(20,24,34,0.95)', border: `4px solid ${win ? GREEN : RED}`, borderRadius: 18, padding: '20px 30px', opacity: Math.min(1, s * 2),
        transform: `translateX(${(1 - Math.min(1, s)) * 80}px)`, fontFamily: 'Montserrat', fontWeight: 900}}>
        <div style={{width: 80, height: 80, borderRadius: 14, background: win ? GREEN : '#d9283a', color: '#fff', fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{win ? 'W' : 'L'}</div>
        <div style={{fontSize: 46, color: '#fff'}}>{score}</div>
        <div style={{marginLeft: 'auto', fontSize: 36, color: win ? GREEN : RED}}>{win ? 'НОРМАЛЬНО' : 'ПРОИГРЫШ'}</div>
      </div>
    );
  };
  return (
    <>
      <Bg />
      <Chip x={540} y={150} s={1} bg="#1c2030" size={40}>ДРУГ ИГРАЕТ ЗА ЛЁХУ</Chip>
      <div style={{position: 'absolute', left: 80, top: 300, width: 920, display: 'flex', flexDirection: 'column', gap: 24}}>
        {row(v(36), true, 'КАТКА 1 · 13 : 9', 0)}
        {row(v(39), false, 'КАТКА 2 · 10 : 13', 1)}
        {f >= v(42) && row(v(42), false, 'КАТКА 3 · ?', 2)}
      </div>
    </>
  );
};

const Cheat: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const on = ramp(f, v(47), v(47) + 10);
  const boxes: [number, number, number, number][] = [[560, 300, 70, 150], [740, 280, 60, 130], [880, 320, 70, 150]];
  return (
    <>
      <Bg glow="#5a1a22" />
      <div style={{position: 'absolute', left: 0, top: 230, width: 1080, height: 607, overflow: 'hidden', borderRadius: 18}}>
        <Img src={staticFile('clutch/game.png')} style={{width: 1080, height: 607}} />
        {/* условные «квадратики через стены» */}
        <svg width={1080} height={607} style={{position: 'absolute', inset: 0, opacity: on}}>
          {boxes.map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="none" stroke="#ff3b47" strokeWidth={4} />
              <rect x={x - 10} y={y} width={5} height={h} fill="#2bd96b" />
            </g>
          ))}
        </svg>
        <div style={{position: 'absolute', left: 20, top: 20, background: 'rgba(0,0,0,0.75)', border: '2px solid #ff3b47', padding: '10px 16px', fontFamily: 'monospace', fontSize: 24, color: '#ff8a8a', opacity: on}}>
          ☑ WALLHACK <span style={{color: '#9aa4c0'}}>· «чуть-чуть»</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 540, top: 950, transform: `translate(-50%, -50%) scale(${pop(f, v(50), fps)})`, background: '#fff', color: '#11131a', borderRadius: 34, padding: '20px 34px',
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, whiteSpace: 'nowrap'}}>«НИКТО НЕ ЗАМЕТИТ»</div>
    </>
  );
};

const Week: React.FC = () => {
  const f = useCurrentFrame();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const d = Math.min(6, Math.floor((f - S.week) / 4));
  return (
    <>
      <Bg />
      <Big x={540} y={260} s={1} size={70} color="#9aa4c0">НЕДЕЛЯ ТИШИНЫ</Big>
      <div style={{position: 'absolute', left: 540, top: 600, transform: 'translate(-50%, -50%)', width: 420, height: 460, background: '#f1ead8', border: '6px solid #15131a', borderRadius: 14, overflow: 'hidden', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900}}>
        <div style={{height: 110, background: '#c4232d', color: '#fff', fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{days[d]}</div>
        <div style={{fontSize: 220, color: '#23262f'}}>{14 + d}</div>
      </div>
    </>
  );
};

const Vac: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const vac = ramp(f, v(60), v(60) + 8);
  const zoom = interpolate(ramp(f, v(60), v(63) + 10), [0, 1], [1, 1.35]);
  const stamp = pop(f, v(64), fps, 300, 9);
  return (
    <>
      <Bg glow="#5a1a22" />
      <Cam s={zoom} x={830} y={420}>
        <SteamProfile vac={vac} f={f} mood={f >= v(60) ? 'shocked' : 'happy'} />
      </Cam>
      {stamp > 0 && (
        <div style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%, -50%) rotate(-8deg) scale(${stamp})`, border: `10px solid ${RED}`, color: RED, background: 'rgba(10,11,16,0.85)',
          fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, padding: '6px 40px', borderRadius: 16, textAlign: 'center', lineHeight: 1.1}}>
          БЛОКИРОВКА VAC
          {f >= v(66) && <div style={{fontSize: 56, color: '#fff'}}>НАВСЕГДА</div>}
        </div>
      )}
    </>
  );
};

const Friend: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg glow="#1a3a5a" />
      <Chat f={f} y={180} msgs={[{me: true, text: 'это чё такое??', at: S.friend + 4}, {text: 'я тут ни при чём 🤷', at: v(71)}]} />
      <div style={{position: 'absolute', left: 0, top: 640, width: 1080, height: 540, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood={f >= v(71) ? 'tired' : 'shocked'} sweat scale={1.0} y={330} redness={0.4} light={RED} lightAmt={0.1} />
      </div>
    </>
  );
};

const Loss: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bar = ramp(f, v(84), v(86) + 8);
  const card = (at: number, label: string, child: React.ReactNode, i: number) => {
    const s = pop(f, at, fps);
    return (
      <div key={i} style={{width: 300, height: 340, borderRadius: 26, background: 'rgba(14,16,26,0.95)', border: '4px solid #2c3350', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16, transform: `scale(${s})`, opacity: Math.min(1, s * 2), filter: `grayscale(${bar})`}}>
        {child}
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: '#fff'}}>{label}</div>
      </div>
    );
  };
  return (
    <>
      <Bg glow="#5a1a22" />
      <div style={{position: 'absolute', left: 540, top: 560, transform: 'translate(-50%, -50%)', display: 'flex', gap: 30}}>
        {card(v(76), '3 000 Ч', <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: GOLD}}>⏱</div>, 0)}
        {card(v(78), 'РАНГ', <Img src={staticFile('brain10/lvl6.png')} style={{width: 150}} />, 1)}
        {card(v(79), 'СКИНЫ', <Img src={staticFile('y2013/k_fade.png')} style={{width: 240}} />, 2)}
      </div>
      {bar > 0 && (
        <div style={{position: 'absolute', left: 540, top: 560, transform: `translate(-50%, -50%) rotate(-12deg) scaleX(${bar})`, width: 1180, height: 120, background: RED, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: 6, boxShadow: `0 0 60px ${RED}`}}>VAC · VAC · VAC</div>
      )}
    </>
  );
};

const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg glow="#1a4a2a" />
      <div style={{position: 'absolute', left: 540, top: 330, transform: `translate(-50%, -50%) scale(${pop(f, v(87), fps)})`}}>
        <svg width={220} height={260} viewBox="0 0 100 120"><path d="M25 50 V32 A25 25 0 0 1 75 32 V50" fill="none" stroke="#fff" strokeWidth={10} /><rect x={12} y={50} width={76} height={62} rx={10} fill={GOLD} /><circle cx={50} cy={78} r={9} fill="#15131a" /></svg>
      </div>
      <Big x={540} y={600} s={pop(f, v(88), fps)} size={64}>АККАУНТ <span style={{color: RED}}>НЕ ПЕРЕДАЁТСЯ</span></Big>
      <Big x={540} y={730} s={pop(f, v(91), fps)} size={50} color={GOLD}>даже лучшему другу</Big>
      <Big x={540} y={830} s={pop(f, v(94), fps)} size={50} color={GOLD}>даже на одну катку</Big>
    </>
  );
};

const Fresh: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Bg />
      <SteamProfile vac={0} fresh f={f} items={0} level={1} name="Лёха_2" />
      <div style={{position: 'absolute', left: 900, top: 230, transform: `translate(-50%, -50%) scale(${pop(f, v(102), fps, 300, 9)})`}}>
        <svg width={170} height={170} viewBox="0 0 100 100"><circle cx={50} cy={50} r={46} fill="none" stroke={GOLD} strokeWidth={6} /></svg>
      </div>
    </>
  );
};

const Last: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Bg glow="#1a3a5a" />
      <Chat f={f} y={180} msgs={[{text: 'дай теперь новый погонять 😅', at: v(107)}]} />
      <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 620, overflow: 'hidden'}}>
        <Portrait f={f} bg="dorm" mood={f >= v(108) ? 'shocked' : 'tired'} scale={1.1} y={380} />
      </div>
    </>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < S.end) return null;
  const a = pop(f, S.end + 2, fps), b = pop(f, S.end + 16, fps), c = pop(f, S.end + 34, fps);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', paddingBottom: 280, textAlign: 'center'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: VACRED, opacity: a}}>1 блокировка VAC</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, color: '#fff', lineHeight: 1.05, marginTop: 30, opacity: Math.min(1, b * 2), transform: `scale(${0.7 + 0.3 * b})`}}>
        А ТЫ ДАЛ БЫ<br /><span style={{color: GOLD, textShadow: `0 0 40px ${GOLD}88`}}>АККАУНТ ДРУГУ?</span>
      </div>
      <div style={{marginTop: 40, background: RED, color: '#fff', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, padding: '14px 36px', borderRadius: 50, opacity: c, transform: `scale(${0.6 + 0.4 * c})`}}>ПИШИ В КОММЕНТАРИЯХ</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- звук (эффекты тише голоса)
type Fx = [number, string, number];
const SFX: Fx[] = [
  [2, 'sfx2/whoosh.wav', 0.3], [v(11), 'sfx2/ding.wav', 0.35], [v(17), 'money/boom.wav', 0.5],
  [v(19), 'sfx2/pop.wav', 0.35], [v(23), 'tilt/notif.wav', 0.45], [v(26), 'tilt/notif.wav', 0.45],
  ...Array.from({length: 9}).map((_, i): Fx => [v(30) + Math.round(i * 14 / 9), `sfx2/key${i % 3}.wav`, 0.4]), ...Array.from({length: 10}).map((_, i): Fx => [v(31) + Math.round(i * 14 / 10), `sfx2/key${i % 3}.wav`, 0.4]),
  [v(32), 'tilt/notif.wav', 0.4], [v(36), 'sfx2/ding.wav', 0.35], [v(39), 'sfx2/error.wav', 0.4],
  [v(47), 'sfx2/glitch.wav', 0.45], [v(50), 'sfx2/pop.wav', 0.35],
  ...Array.from({length: 7}).map((_, i): Fx => [S.week + i * 4, 'sfx2/tick.wav', 0.5]),
  [v(57), 'sfx2/whoosh.wav', 0.3], [v(60), 'money/boom.wav', 0.5], [v(64), 'sfx2/stamp.wav', 0.6], [v(66), 'sfx2/impact.wav', 0.5],
  [S.friend + 4, 'tilt/notif.wav', 0.4], [v(71), 'tilt/notif.wav', 0.45],
  [v(76), 'sfx2/pop.wav', 0.35], [v(78), 'sfx2/pop.wav', 0.35], [v(79), 'sfx2/pop.wav', 0.35], [v(84), 'sfx2/stamp.wav', 0.55],
  [v(87), 'sfx2/stamp.wav', 0.45], [v(88), 'sfx2/blip.wav', 0.35], [v(91), 'sfx2/blip.wav', 0.3], [v(94), 'sfx2/blip.wav', 0.3],
  [S.fresh, 'sfx2/whoosh.wav', 0.3], [v(102), 'sfx2/deflate.wav', 0.4], [v(107), 'tilt/notif.wav', 0.5],
  [S.end, 'money/boom.wav', 0.45], [S.end + 16, 'sfx2/stamp.wav', 0.45], [S.end + 34, 'sfx2/pop.wav', 0.4],
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

export const Acc: React.FC = () => {
  loadFonts();
  const order: [number, number, React.FC, boolean?][] = [
    [S.hook, S.ask, Hook], [S.ask, S.login, Ask], [S.login, S.matches, Login, true], [S.matches, S.cheat, Matches], [S.cheat, S.week, Cheat, true],
    [S.week, S.vac, Week, true], [S.vac, S.friend, Vac], [S.friend, S.loss, Friend], [S.loss, S.rule, Loss, true], [S.rule, S.fresh, Rule],
    [S.fresh, S.last, Fresh], [S.last, S.end, Last],
  ];
  return (
    <AbsoluteFill style={{background: '#07090f'}}>
      {order.map(([from, to, C, cut], i) => <Scene key={i} from={from} to={to} cut={cut}><C /></Scene>)}
      <Flash at={v(17)} len={12} />
      <Flash at={v(60)} len={14} />
      <Flash at={v(84)} len={12} />
      <AbsoluteFill style={{top: H - 220, height: 220, background: 'linear-gradient(rgba(7,9,15,0), #07090f)'}} />
      <Captions cues={CUES} />
      <End />
      <Sound />
    </AbsoluteFill>
  );
};
