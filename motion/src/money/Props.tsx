// Декорации и реквизит ролика «Миллион за катку» в контурном мультяшном стиле (как у Лёхи v2).
// Все сцены рисуются в области картинки 1080×1180 над субтитрами.
import React from 'react';
import {random} from 'remotion';
import {LyokhaBust, Mood, L} from './Lyokha';

export const INK = '#15131a';
export const RED = '#ff2b36';
export const W = 1080, H = 1180;

// ---------------------------------------------------------------- купюра 5000 ₽
export const Bill: React.FC<{x?: number; y?: number; r?: number; s?: number; o?: number}> = ({x = 0, y = 0, r = 0, s = 1, o = 1}) => (
  <g transform={`translate(${x}, ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <rect x={-80} y={-38} width={160} height={76} rx={6} fill="#e0704a" stroke="#7a2e1c" strokeWidth={3} />
    <rect x={-72} y={-30} width={144} height={60} rx={4} fill="none" stroke="#f4a37f" strokeWidth={2} />
    <ellipse cx={-36} cy={0} rx={20} ry={22} fill="#f2a585" stroke="#a8462d" strokeWidth={2} />
    <text x={52} y={-10} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={20} fill="#7a2e1c">5000</text>
    <path d="M10 14 h60" stroke="#a8462d" strokeWidth={3} />
    <path d="M10 22 h44" stroke="#a8462d" strokeWidth={2} />
  </g>
);

// Дождь из купюр: детерминированный (кадр → позиции)
export const MoneyRain: React.FC<{f: number; from: number; until?: number; n?: number; speed?: number; seed?: string; up?: boolean}> = ({f, from, until = 1e9, n = 40, speed = 11, seed = 'r', up = false}) => {
  if (f < from) return null;
  const t = f - from;
  const fade = until < 1e9 ? Math.max(0, Math.min(1, (until + 20 - f) / 20)) : 1;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const r1 = random(`${seed}x${i}`), r2 = random(`${seed}y${i}`), r3 = random(`${seed}s${i}`);
        const delay = r2 * 40;
        const tt = t - delay;
        if (tt < 0) return null;
        const sp = speed * (0.7 + r3 * 0.6);
        const y = up ? 1100 - tt * sp * 1.4 : -100 + tt * sp;
        if (y > H + 100 || y < -150) return null;
        const x = r1 * (W + 100) - 50 + Math.sin((tt + i * 9) / 14) * 40;
        const rot = Math.sin((tt + i * 5) / 9) * 50 + r3 * 180;
        return <Bill key={i} x={x} y={y} r={rot} s={0.55 + r3 * 0.6} o={fade} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- красное LED-табло
export const Tablo: React.FC<{text: string; sub?: string; glow?: number; x?: number; y?: number; w?: number; h?: number; dim?: number}> = ({text, sub, glow = 1, x = 240, y = 80, w = 600, h = 180, dim = 0}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={14} fill="#050507" stroke="#2a2d36" strokeWidth={8} />
    <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx={8} fill="#0b0607" />
    <text x={x + w / 2} y={y + h * 0.58} textAnchor="middle" fontFamily="Russo One" fontSize={h * 0.46} fill={RED} letterSpacing={4}
      opacity={1 - dim * 0.7} style={{filter: `drop-shadow(0 0 ${10 * glow}px ${RED})`}}>{text}</text>
    {sub && <text x={x + w / 2} y={y + h * 0.86} textAnchor="middle" fontFamily="Russo One" fontSize={h * 0.15} fill={RED} opacity={0.6 * (1 - dim * 0.7)} letterSpacing={3}>{sub}</text>}
  </g>
);

export const money = (n: number) => `${n === 0 ? '0' : `${n} 000 000`} ₽`;

// ---------------------------------------------------------------- подвал: общий план
export type BasementProps = {
  f: number;
  tablo: string;
  sub?: string;
  tabloGlow?: number;
  lamp?: number;
  doorLight?: number; // свет из-под двери: 1 — день, 0 — ночь
  doorOpen?: number; // 0..1
  guest?: number; // силуэт нового игрока в двери
  lyokha?: {mood?: Mood; look?: number; blink?: number; sweat?: boolean; tears?: number} | null;
  pile?: number; // 0..1 сколько купюр на полу
  screenGlow?: string;
  redness?: number; // красный свет табло на лице/стене
};

export const Basement: React.FC<BasementProps> = ({f, tablo, sub, tabloGlow = 1, lamp = 1, doorLight = 0.6, doorOpen = 0, guest = 0, lyokha = {}, pile = 0, screenGlow = '#7fb2ff', redness = 0}) => {
  const flick = lamp * (0.94 + 0.06 * Math.sin(f / 5) * Math.sin(f / 11));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="bs-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity={0.32 * flick} />
          <stop offset="1" stopColor="#fff6dc" stopOpacity={0.02} />
        </linearGradient>
        <radialGradient id="bs-red" cx="0.5" cy="0.1" r="0.7">
          <stop offset="0" stopColor={RED} stopOpacity={0.22 * tabloGlow + redness * 0.25} />
          <stop offset="1" stopColor={RED} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="bs-scr" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={screenGlow} stopOpacity={0.35} />
          <stop offset="1" stopColor={screenGlow} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="bs-door" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe9b0" stopOpacity={0.55 * doorLight} />
          <stop offset="1" stopColor="#ffe9b0" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* стена с кирпичной кладкой */}
      <rect width={W} height={H} fill="#1a1c23" />
      {Array.from({length: 22}).map((_, r) => (
        <g key={r} opacity={0.12}>
          <line x1={0} y1={r * 46} x2={W} y2={r * 46} stroke="#000" strokeWidth={3} />
          {Array.from({length: 10}).map((__, c) => <line key={c} x1={c * 120 + (r % 2) * 60} y1={r * 46} x2={c * 120 + (r % 2) * 60} y2={r * 46 + 46} stroke="#000" strokeWidth={3} />)}
        </g>
      ))}
      <rect width={W} height={H} fill="url(#bs-red)" />
      {/* трубы под потолком */}
      <rect x={0} y={20} width={W} height={22} fill="#262932" stroke={INK} strokeWidth={4} />
      <rect x={0} y={52} width={W} height={12} fill="#22252d" stroke={INK} strokeWidth={3} />
      <Tablo text={tablo} sub={sub} glow={tabloGlow} />
      {/* лампа */}
      <rect x={536} y={260} width={8} height={56} fill="#2a2d36" />
      <path d="M496 350 Q540 300 584 350 Z" fill="#2c2f38" stroke={INK} strokeWidth={5} />
      <ellipse cx={540} cy={352} rx={18} ry={9} fill="#fff6dc" opacity={flick} />
      <polygon points="500,352 580,352 900,1000 180,1000" fill="url(#bs-cone)" />
      {/* дверь */}
      <g>
        <rect x={858} y={440} width={190} height={560} fill="#0c0d10" stroke={INK} strokeWidth={6} />
        {doorOpen > 0 && <rect x={864} y={446} width={178} height={548} fill="#f6e2b0" opacity={doorOpen} />}
        {guest > 0 && (
          <g opacity={guest} transform="translate(952, 1000)">
            <circle cx={0} cy={-470} r={42} fill="#0b0b0e" />
            <path d="M-62 0 L-56 -330 Q-50 -410 0 -414 Q50 -410 56 -330 L62 0 Z" fill="#0b0b0e" />
          </g>
        )}
        <g transform={`translate(1048, 0) scale(${1 - doorOpen * 0.82}, 1) translate(-1048, 0)`}>
          <rect x={858} y={440} width={190} height={560} fill="#272a33" stroke={INK} strokeWidth={6} />
          <rect x={880} y={470} width={146} height={220} fill="none" stroke="#1d2027" strokeWidth={6} />
          <rect x={880} y={720} width={146} height={240} fill="none" stroke="#1d2027" strokeWidth={6} />
          <rect x={874} y={690} width={34} height={12} rx={5} fill="#8d8f98" stroke={INK} strokeWidth={3} />
        </g>
        {/* полоска света под дверью */}
        <rect x={860} y={994} width={186} height={6} fill="#ffe9b0" opacity={doorLight} />
        <polygon points="840,1000 1066,1000 1080,1090 810,1090" fill="url(#bs-door)" />
      </g>
      {/* пол */}
      <rect x={0} y={1000} width={W} height={180} fill="#111217" />
      <line x1={0} y1={1000} x2={W} y2={1000} stroke={INK} strokeWidth={6} />
      {/* кресло за Лёхой */}
      <path d="M392 900 L400 520 Q404 470 460 466 L620 466 Q676 470 680 520 L688 900 Z" fill="#17181e" stroke={INK} strokeWidth={6} />
      <path d="M440 480 L436 900 M640 480 L644 900" stroke="#b8262f" strokeWidth={14} />
      {/* Лёха */}
      {lyokha && (
        <g transform="translate(540, 600) scale(0.7)">
          <LyokhaBust {...lyokha} light={redness > 0 ? RED : undefined} lightAmt={redness * 0.25} />
        </g>
      )}
      {/* свечение экрана */}
      <ellipse cx={540} cy={740} rx={260} ry={140} fill="url(#bs-scr)" />
      {/* монитор (задней стороной к нам) */}
      <rect x={380} y={716} width={320} height={186} rx={14} fill="#1c1e25" stroke={INK} strokeWidth={6} />
      <rect x={510} y={760} width={60} height={70} rx={8} fill="#15161b" stroke={INK} strokeWidth={4} />
      {/* стол */}
      <rect x={270} y={900} width={540} height={26} rx={4} fill="#2e313b" stroke={INK} strokeWidth={6} />
      <rect x={290} y={926} width={500} height={74} fill="#22252d" stroke={INK} strokeWidth={6} />
      {/* купюры на полу */}
      {Array.from({length: Math.round(pile * 46)}).map((_, i) => {
        const rx = random(`p${i}`), ry = random(`q${i}`), rr = random(`z${i}`);
        const x = 120 + rx * 840;
        const y = 1020 + ry * 130;
        return <Bill key={i} x={x} y={y} r={rr * 360} s={0.55 + ry * 0.35} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------- крупный план Лёхи
export const Portrait: React.FC<{bg: 'dorm' | 'basement' | 'home'; mood?: Mood; look?: number; blink?: number; sweat?: boolean; tears?: number; light?: string; lightAmt?: number; scale?: number; y?: number; stubble?: number; f: number; redness?: number}> = ({bg, scale = 1.55, y = 800, f, redness = 0, ...p}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <radialGradient id="pt-vig" cx="0.5" cy="0.45" r="0.7">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.6} />
      </radialGradient>
    </defs>
    {bg === 'dorm' && (
      <g>
        <rect width={W} height={H} fill="#141826" />
        <g transform="translate(90, 120)">
          <rect width={420} height={380} fill="#0c1430" stroke={INK} strokeWidth={8} />
          {[[0, 240, 80], [90, 190, 70], [170, 260, 90], [270, 210, 80], [350, 250, 70]].map(([x, y, w], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={380 - y} fill="#070b1a" />
              {[0, 1, 2].map((k) => ((i + k + Math.floor(f / 40)) % 3 === 0 ? <rect key={k} x={x + 14} y={y + 20 + k * 30} width={10} height={12} fill="#f3c86a" opacity={0.8} /> : null))}
            </g>
          ))}
          <line x1={210} y1={0} x2={210} y2={380} stroke={INK} strokeWidth={8} />
        </g>
      </g>
    )}
    {bg === 'basement' && (
      <g>
        <rect width={W} height={H} fill="#191b22" />
        <rect width={W} height={H} fill={RED} opacity={0.08 + redness * 0.25} />
        <polygon points="420,0 660,0 980,1180 100,1180" fill="#fff6dc" opacity={0.06} />
      </g>
    )}
    {bg === 'home' && (
      <g>
        <rect width={W} height={H} fill="#3a2a1e" />
        <rect width={W} height={H} fill="#f0a860" opacity={0.25} />
      </g>
    )}
    <g transform={`translate(540, ${y}) scale(${scale})`}>
      <LyokhaBust {...p} />
      {(p.stubble ?? 0) > 0 && (
        <g transform="translate(0, -30)" opacity={p.stubble}>
          <path d="M-110 90 C-100 160 -50 186 0 188 C50 186 100 160 110 90 Q60 140 0 140 Q-60 140 -110 90 Z" fill="#3a2a22" opacity={0.28} />
        </g>
      )}
    </g>
    <rect width={W} height={H} fill="url(#pt-vig)" />
  </svg>
);

// ---------------------------------------------------------------- телефон
export type Notif = {app: string; title: string; text: string; color: string; at?: number; hl?: boolean};

export const Phone: React.FC<{time: string; date: string; dateRed?: boolean; noSignal?: boolean; signal?: number; notifs?: Notif[]; ad?: number; adHl?: number; glow?: number; s?: number}> = ({time, date, dateRed, noSignal, signal = 0, notifs = [], ad = 0, adHl = 0, glow = 1, s = 1}) => (
  <div style={{position: 'absolute', left: 540, top: 600, width: 600, height: 1080, transform: `translate(-50%, -50%) scale(${s})`, borderRadius: 80, background: '#0b0c11',
    border: '10px solid #2c2f38', boxShadow: `0 0 ${120 * glow}px rgba(120,160,255,${0.25 * glow}), 0 30px 80px rgba(0,0,0,0.7)`, overflow: 'hidden', fontFamily: 'Montserrat'}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#1c2033, #0a0b10 70%)'}} />
    <div style={{position: 'absolute', left: '50%', top: 18, width: 160, height: 42, borderRadius: 24, background: '#000', transform: 'translateX(-50%)'}} />
    <div style={{position: 'absolute', left: 50, top: 26, fontSize: 24, fontWeight: 600, color: '#fff'}}>{time}</div>
    <div style={{position: 'absolute', right: 46, top: 26, fontSize: 22, fontWeight: 900, color: noSignal ? '#ff5a5a' : '#fff'}}>
      {noSignal ? 'Нет сети' : (
        <span style={{display: 'inline-flex', gap: 4, alignItems: 'flex-end'}}>
          {[10, 14, 18, 22].map((h, i) => <span key={i} style={{width: 6, height: h, background: i < Math.round(signal * 4) ? '#fff' : '#555', borderRadius: 2}} />)}
        </span>
      )}
    </div>
    <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontSize: 28, fontWeight: 600, color: dateRed ? '#ff4b55' : '#c9cede'}}>{date}</div>
    <div style={{position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontSize: 150, fontWeight: 600, color: '#fff', letterSpacing: -4}}>{time}</div>
    <div style={{position: 'absolute', top: 360, left: 30, right: 30, display: 'flex', flexDirection: 'column', gap: 14}}>
      {notifs.map((n, i) => {
        const a = n.at === undefined ? 1 : Math.max(0, Math.min(1, n.at));
        return (
          <div key={i} style={{display: 'flex', gap: 16, padding: '18px 20px', borderRadius: 30, background: n.hl ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.11)',
            border: n.hl ? '3px solid #ffd23f' : '3px solid transparent', opacity: a, transform: `translateY(${(1 - a) * -30}px) scale(${0.95 + 0.05 * a})`}}>
            <div style={{width: 64, height: 64, borderRadius: 16, background: n.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, color: '#fff'}}>{n.app}</div>
            <div style={{minWidth: 0}}>
              <div style={{fontSize: 26, fontWeight: 900, color: '#fff'}}>{n.title}</div>
              <div style={{fontSize: 26, fontWeight: 600, color: '#e3e6ef', lineHeight: 1.25}}>{n.text}</div>
            </div>
          </div>
        );
      })}
      {ad > 0 && (
        <div style={{padding: '26px 24px', borderRadius: 30, background: 'rgba(30,6,8,0.95)', border: `4px solid ${RED}`, opacity: Math.min(1, ad * 2),
          transform: `scale(${0.85 + 0.15 * ad})`, boxShadow: `0 0 ${50 * adHl}px ${RED}`}}>
          <div style={{fontSize: 22, fontWeight: 600, color: '#ffb3b8', marginBottom: 8}}>РЕКЛАМА</div>
          <div style={{fontSize: 56, fontWeight: 900, color: RED, lineHeight: 1.05}}>МИЛЛИОН<br />ЗА КАТКУ</div>
          <div style={{fontSize: 28, fontWeight: 900, color: '#fff', marginTop: 14, transform: `scale(${1 + adHl * 0.06})`, transformOrigin: 'left'}}>Без подвоха. Просто играй.</div>
          <div style={{fontSize: 24, fontWeight: 600, color: '#b8bccb', marginTop: 10}}>ул. Заводская, 13 · подвал</div>
        </div>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------- записка (рукописный текст появляется построчно)
export const Note: React.FC<{lines: {text: string; p: number; color?: string; size?: number; indent?: number}[]; title?: string; w?: number; h?: number; rot?: number; s?: number; sign?: {text: string; p: number}}> = ({lines, title, w = 820, h = 760, rot = -2, s = 1, sign}) => (
  <div style={{position: 'absolute', left: 540, top: 560, width: w, height: h, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, background: '#f1ead8',
    boxShadow: '0 30px 60px rgba(0,0,0,0.6)', borderRadius: 6, padding: '50px 60px', boxSizing: 'border-box',
    backgroundImage: 'repeating-linear-gradient(transparent 0 70px, rgba(80,110,180,0.25) 70px 72px)', backgroundPosition: '0 36px'}}>
    <div style={{position: 'absolute', left: 52, top: 0, bottom: 0, width: 3, background: 'rgba(220,70,70,0.35)'}} />
    {title && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: '#1d1f2e', marginBottom: 10, letterSpacing: 2}}>{title}</div>}
    {lines.map((l, i) => (
      <div key={i} style={{fontFamily: 'Caveat', fontWeight: 700, fontSize: l.size ?? 56, lineHeight: '72px', color: l.color ?? '#23285a', marginLeft: l.indent ?? 0,
        clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, l.p)) * 100}% 0 0)`, whiteSpace: 'nowrap'}}>{l.text}</div>
    ))}
    {sign && <div style={{position: 'absolute', right: 70, bottom: 60, fontFamily: 'Caveat', fontWeight: 700, fontSize: 60, color: '#23285a',
      clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, sign.p)) * 100}% 0 0)`}}>{sign.text}</div>}
  </div>
);

// ---------------------------------------------------------------- дверь крупно (низ двери, свет, записка)
export const DoorClose: React.FC<{light: number; note?: number; handle?: number; f: number}> = ({light, note = 0, handle = 0, f}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="dc-spill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe9b0" stopOpacity={0.7 * light} />
        <stop offset="1" stopColor="#ffe9b0" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="#16181e" />
    <rect x={140} y={0} width={800} height={900} fill="#272a33" stroke={INK} strokeWidth={8} />
    <rect x={200} y={60} width={680} height={340} fill="none" stroke="#1d2027" strokeWidth={10} />
    <rect x={200} y={460} width={680} height={380} fill="none" stroke="#1d2027" strokeWidth={10} />
    {/* ручка */}
    <g transform={`translate(230, 420) rotate(${handle * 14})`}>
      <rect x={-24} y={-60} width={48} height={120} rx={12} fill="#55585f" stroke={INK} strokeWidth={5} />
      <rect x={-10} y={-14} width={170} height={28} rx={14} fill="#9a9ca4" stroke={INK} strokeWidth={5} />
    </g>
    <rect x={140} y={892} width={800} height={14} fill="#ffe9b0" opacity={light} style={{filter: `drop-shadow(0 0 ${18 * light}px #ffe9b0)`}} />
    <rect x={0} y={906} width={W} height={274} fill="#101116" />
    <polygon points="120,906 960,906 1080,1180 0,1180" fill="url(#dc-spill)" />
    {note > 0 && (
      <g transform={`translate(540, ${900 + note * 150}) rotate(${-4 + note * 6}) scale(${0.7 + note * 0.5}, ${0.3 + note * 0.5})`}>
        <rect x={-150} y={-60} width={300} height={130} fill="#f1ead8" stroke="#b8ad90" strokeWidth={3} />
        <path d="M-110 -20 h170 M-110 10 h120 M-110 40 h150" stroke="#23285a" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      </g>
    )}
  </svg>
);

// ---------------------------------------------------------------- рулетка кейса
export const CaseRoulette: React.FC<{p: number; result: number}> = ({p, result}) => {
  const items = ['#4b69ff', '#8847ff', '#4b69ff', '#d32ce6', '#4b69ff', '#8847ff', '#4b69ff', '#eb4b4b', '#4b69ff', '#8847ff', '#4b69ff', '#d32ce6', '#4b69ff', '#8847ff', '#b0c3d9', '#4b69ff', '#8847ff', '#4b69ff'];
  const iw = 210;
  const target = 14 * iw - 450 + iw / 2;
  const off = target * p;
  return (
    <div style={{position: 'absolute', left: 40, top: 230, width: 1000, height: 300, background: 'rgba(10,11,16,0.95)', border: '4px solid #2c2f38', borderRadius: 24, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 40, left: -off, display: 'flex', gap: 10}}>
        {items.map((c, i) => (
          <div key={i} style={{width: iw - 10, height: 200, background: 'linear-gradient(#262a35, #171a22)', borderRadius: 12, borderBottom: `14px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            outline: result > 0 && i === 14 ? `5px solid #ffd23f` : 'none'}}>
            <svg width={140} height={60} viewBox="0 0 140 60"><path d="M4 20 H110 L120 14 H136 V28 H114 L106 40 H70 L62 56 H44 L50 40 H30 L20 30 H4 Z" fill={c} opacity={0.9} /></svg>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 498, top: 0, width: 4, height: 300, background: '#ffd23f', boxShadow: '0 0 20px #ffd23f'}} />
    </div>
  );
};

// ---------------------------------------------------------------- двор через 9 лет
export const Courtyard: React.FC<{f: number; grow: number; tilt?: number}> = ({f, grow, tilt = 0}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="cy-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2140" />
        <stop offset="0.7" stopColor="#5a5a7a" />
        <stop offset="1" stopColor="#d79a6a" />
      </linearGradient>
    </defs>
    <g transform={`translate(0, ${tilt * 120})`}>
      <rect width={W} height={H} fill="url(#cy-sky)" />
      {/* панельки */}
      {[[-40, 160, 420], [400, 90, 360], [740, 200, 380]].map(([x, y, w], b) => (
        <g key={b}>
          <rect x={x} y={y} width={w} height={900 - y} fill={['#3a3d4e', '#33364a', '#3d4052'][b]} stroke={INK} strokeWidth={6} />
          {Array.from({length: Math.floor((860 - y) / 70)}).map((_, r) => Array.from({length: Math.floor(w / 70)}).map((__, c) => {
            const lit = random(`w${b}-${r}-${c}`) > 0.62;
            return <rect key={`${r}-${c}`} x={x + 22 + c * 70} y={y + 30 + r * 70} width={34} height={42} fill={lit ? '#f3c86a' : '#22253a'} stroke={INK} strokeWidth={3} />;
          }))}
        </g>
      ))}
      {/* асфальт */}
      <rect x={0} y={880} width={W} height={300} fill="#24252c" stroke={INK} strokeWidth={6} />
      <ellipse cx={300} cy={1010} rx={120} ry={18} fill="#3a4258" opacity={0.7} />
      <ellipse cx={820} cy={1080} rx={150} ry={20} fill="#3a4258" opacity={0.6} />
      {/* деревья до третьего этажа */}
      {[[150, 0], [560, 1], [930, 2]].map(([x, k]) => {
        const g = 0.35 + 0.65 * grow;
        return (
          <g key={k} transform={`translate(${x}, 900) scale(${g})`}>
            <path d="M-14 0 L-10 -300 L10 -300 L14 0 Z" fill="#2a1f1a" stroke={INK} strokeWidth={5} />
            <path d="M0 -260 L-70 -360 M0 -300 L60 -400" stroke="#2a1f1a" strokeWidth={14} strokeLinecap="round" />
            {[[-90, -380, 110], [60, -430, 120], [-20, -500, 130], [100, -330, 90], [-120, -300, 80]].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy + Math.sin((f + i * 13) / 20) * 3} r={r} fill={['#c98a2a', '#d9a03a', '#b8752a', '#e0b048', '#c4842e'][i]} stroke={INK} strokeWidth={5} />
            ))}
          </g>
        );
      })}
      {/* Лёха со спины с пакетами */}
      <g transform="translate(540, 1180)">
        <path d="M-150 0 L-140 -260 Q-130 -330 -60 -340 L60 -340 Q130 -330 140 -260 L150 0 Z" fill={L.hood} stroke={INK} strokeWidth={6} />
        <path d="M-70 -340 Q0 -300 70 -340 L60 -380 Q0 -350 -60 -380 Z" fill={L.hoodL} stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={-430} r={86} fill={L.hair} stroke={INK} strokeWidth={6} />
        <ellipse cx={-86} cy={-420} rx={16} ry={24} fill={L.skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={86} cy={-420} rx={16} ry={24} fill={L.skin} stroke={INK} strokeWidth={4} />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 200}, -90)`}>
            <path d="M-60 -60 L60 -60 L70 90 L-70 90 Z" fill="#d8d4c8" stroke={INK} strokeWidth={5} />
            <path d="M-30 -60 Q0 -120 30 -60" stroke={INK} strokeWidth={6} fill="none" />
            <Bill x={-20} y={-66} r={-20} s={0.5} /><Bill x={22} y={-70} r={14} s={0.5} />
          </g>
        ))}
      </g>
    </g>
  </svg>
);

// ---------------------------------------------------------------- дверь квартиры 47
export const AptDoor: React.FC<{open: number; ring: number}> = ({open, ring}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <rect width={W} height={H} fill="#2c3a33" />
    <rect x={0} y={600} width={W} height={580} fill="#24302a" />
    <line x1={0} y1={600} x2={W} y2={600} stroke={INK} strokeWidth={6} />
    <rect x={250} y={160} width={500} height={1000} fill="#f2c27a" stroke={INK} strokeWidth={8} />
    {open > 0 && (
      <g opacity={Math.min(1, open * 1.5)} transform="translate(500, 1160)">
        <circle cx={0} cy={-700} r={70} fill="#2a1d18" />
        <path d="M-120 0 L-110 -540 Q-100 -620 0 -630 Q100 -620 110 -540 L120 0 Z" fill="#2a1d18" />
      </g>
    )}
    <g transform={`translate(250, 0) scale(${1 - open * 0.85}, 1) translate(-250, 0)`}>
      <rect x={250} y={160} width={500} height={1000} fill="#5a3a28" stroke={INK} strokeWidth={8} />
      {Array.from({length: 9}).map((_, r) => Array.from({length: 5}).map((__, c) => (
        <circle key={`${r}-${c}`} cx={310 + c * 95} cy={250 + r * 100} r={7} fill="#c9a070" stroke={INK} strokeWidth={2} />
      )))}
      <text x={500} y={240} textAnchor="middle" fontFamily="Russo One" fontSize={70} fill="#e3c27a" stroke={INK} strokeWidth={2}>47</text>
      <circle cx={500} cy={420} r={12} fill="#1a1410" stroke="#c9a070" strokeWidth={4} />
      <rect x={680} y={640} width={40} height={90} rx={10} fill="#c9a070" stroke={INK} strokeWidth={4} />
    </g>
    {/* звонок */}
    <rect x={800} y={600} width={60} height={80} rx={10} fill="#d8d4c8" stroke={INK} strokeWidth={5} />
    <circle cx={830} cy={640} r={16} fill={ring > 0 ? '#ffd23f' : '#9a968c'} stroke={INK} strokeWidth={4} />
  </svg>
);

// ---------------------------------------------------------------- мама (постаревшая)
export const Mom: React.FC<{tears: number; f: number}> = ({tears, f}) => {
  const ink = INK;
  const tremble = Math.sin(f / 3) * 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      <rect width={W} height={H} fill="#3a2a1e" />
      <rect width={W} height={H} fill="#f0a860" opacity={0.3} />
      <g transform="translate(540, 820) scale(1.5)">
        {/* кофта */}
        <path d="M-240 400 L-220 220 Q-200 150 -110 130 L110 130 Q200 150 220 220 L240 400 Z" fill="#6b2f3a" stroke={ink} strokeWidth={6} />
        <path d="M-60 130 L0 230 L60 130" fill="#e9e1d2" stroke={ink} strokeWidth={5} />
        <path d="M-40 70 L-44 140 L44 140 L40 70 Z" fill="#d9ad8c" stroke={ink} strokeWidth={5} />
        {/* пучок и волосы */}
        <circle cx={0} cy={-178} r={54} fill="#b9b9c2" stroke={ink} strokeWidth={6} />
        <path d="M-30 -196 Q0 -210 30 -196" stroke="#8d8d96" strokeWidth={4} fill="none" />
        <path d="M-128 -60 C-140 -200 140 -200 128 -60 L118 -110 C60 -150 -60 -150 -118 -110 Z" fill="#b9b9c2" stroke={ink} strokeWidth={6} />
        {/* лицо */}
        <path d="M-118 -80 C-120 -170 120 -170 118 -80 L112 20 C100 100 56 130 0 132 C-56 130 -100 100 -112 20 Z" fill="#e8c09e" stroke={ink} strokeWidth={6} />
        <path d="M-118 -80 C-90 -140 90 -140 118 -80 C80 -112 -80 -112 -118 -80 Z" fill="#b9b9c2" stroke={ink} strokeWidth={5} />
        {/* морщины */}
        <g stroke={ink} strokeWidth={3} fill="none" opacity={0.7}>
          <path d="M-50 -100 Q0 -108 50 -100 M-40 -88 Q0 -94 40 -88" />
          <path d="M-96 -20 l-16 -6 M-96 -10 l-16 2 M96 -20 l16 -6 M96 -10 l16 2" />
          <path d="M-46 30 Q-56 60 -40 84 M46 30 Q56 60 40 84" />
          <path d="M-78 4 Q-52 16 -26 4 M26 4 Q52 16 78 4" />
        </g>
        {/* глаза */}
        {[-52, 52].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={-28} r={26} fill="#fbfbf7" stroke={ink} strokeWidth={5} />
            <circle cx={x} cy={-24 + tremble * 0.3} r={10} fill={ink} />
            <circle cx={x - 4} cy={-29} r={3.5} fill="#fff" />
          </g>
        ))}
        <path d="M-84 -66 Q-56 -58 -26 -74 M84 -66 Q56 -58 26 -74" stroke="#7d7d86" strokeWidth={8} strokeLinecap="round" fill="none" />
        <path d="M4 -10 Q-10 22 2 30 Q10 32 16 28" stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d={`M-26 66 Q0 ${54 + tremble} 26 66`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        {tears > 0 && [-52, 52].map((x, i) => (
          <path key={i} d={`M${x + 10} -2 Q${x + 18} ${-2 + 50 * tears} ${x + 8} ${4 + 70 * tears}`} stroke="#9fd0ff" strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};
