// Реквизит ролика «100 кейсов»: рулетка кейса, сетка 100 результатов, «вебка» с Лёхой, иконки кейса/ключа/ножа.
import React from 'react';
import {random, staticFile} from 'remotion';
import {LyokhaBust, Mood} from '../money/Lyokha';

export const RAR = {blue: '#4b69ff', purple: '#8847ff', pink: '#d32ce6', red: '#eb4b4b', gold: '#e4ae39', empty: '#1d2130'};
export type Rar = keyof typeof RAR;
export const RAR_NAME: Record<Rar, string> = {blue: 'АРМЕЙСКОЕ', purple: 'ЗАПРЕЩЁННОЕ', pink: 'ЗАСЕКРЕЧЕННОЕ', red: 'ТАЙНОЕ', gold: 'РЕДКИЙ ПРЕДМЕТ', empty: ''};

const INK = '#15131a';

// силуэты предметов
export const GunIcon: React.FC<{c: string; w?: number}> = ({c, w = 140}) => (
  <svg width={w} height={w * 0.43} viewBox="0 0 140 60"><path d="M4 20 H110 L120 14 H136 V28 H114 L106 40 H70 L62 56 H44 L50 40 H30 L20 30 H4 Z" fill={c} /></svg>
);
// нож-бабочка и кейс — исходники пользователя (фон вырезан, public/cases/*.png); <svg><image> работает и в HTML, и внутри SVG
export const KnifeIcon: React.FC<{c?: string; w?: number; glow?: boolean}> = ({c = RAR.gold, w = 140, glow}) => (
  <svg width={w} height={w * (365 / 443)} viewBox="0 0 443 365" style={glow ? {filter: `drop-shadow(0 0 14px ${c})`, overflow: 'visible'} : {overflow: 'visible'}}>
    <image href={staticFile('cases/butterfly.png')} width={443} height={365} />
  </svg>
);
export const CaseIcon: React.FC<{w?: number}> = ({w = 120}) => (
  <svg width={w} height={w * (273 / 373)} viewBox="0 0 373 273" style={{overflow: 'visible'}}>
    <image href={staticFile('cases/case.png')} width={373} height={273} />
  </svg>
);
export const KeyIcon: React.FC<{w?: number}> = ({w = 120}) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 120 90">
    <circle cx={34} cy={45} r={22} fill="none" stroke="#e9c46a" strokeWidth={10} />
    <path d="M56 45 H110 M92 45 V62 M104 45 V58" stroke="#e9c46a" strokeWidth={10} strokeLinecap="round" />
  </svg>
);

// Рулетка: лента из 40 предметов, останавливается на ячейке 30 (или рядом с золотом — «почти»)
export const Roulette: React.FC<{p: number; result: Rar; seed: string; nearMiss?: boolean; y?: number; done?: boolean}> = ({p, result, seed, nearMiss = false, y = 220, done = false}) => {
  const iw = 200;
  const pool: Rar[] = ['blue', 'blue', 'blue', 'blue', 'purple', 'blue', 'purple', 'pink', 'blue', 'red', 'purple', 'blue', 'gold'];
  const items: Rar[] = Array.from({length: 40}).map((_, i) => pool[Math.floor(random(`${seed}${i}`) * pool.length)]);
  items[30] = result;
  if (nearMiss) items[31] = 'gold';
  // стоп: центр ячейки 30; при «почти» — у правого края, золото в паре пикселей
  const stopX = 30 * iw + (nearMiss ? iw - 14 : iw / 2) - 500;
  const off = stopX * p;
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: 1000, height: 280, background: 'rgba(10,11,16,0.96)', border: '5px solid #2c2f38', borderRadius: 26, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 36, left: -off, display: 'flex'}}>
        {items.map((c, i) => (
          <div key={i} style={{width: iw - 12, marginRight: 12, height: 200, background: 'linear-gradient(#262a35, #171a22)', borderRadius: 14, borderBottom: `16px solid ${RAR[c]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box',
            outline: done && i === 30 ? `6px solid ${RAR[c]}` : 'none', boxShadow: done && i === 30 ? `0 0 40px ${RAR[c]}` : 'none'}}>
            {c === 'gold' ? <KnifeIcon w={150} /> : <GunIcon c={RAR[c]} />}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 497, top: 0, width: 6, height: 280, background: '#ffd23f', boxShadow: '0 0 24px #ffd23f'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,11,16,0.9), transparent 22%, transparent 78%, rgba(10,11,16,0.9))'}} />
    </div>
  );
};

// Сетка 10×10 результатов
export const Grid100: React.FC<{cells: Rar[]; x: number; y: number; size: number; gap?: number; highlightGold?: number; pulse?: number}> = ({cells, x, y, size, gap = 6, highlightGold = 0, pulse = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'grid', gridTemplateColumns: `repeat(10, ${size}px)`, gap}}>
    {Array.from({length: 100}).map((_, i) => {
      const c = cells[i] ?? 'empty';
      return <div key={i} style={{width: size, height: size, borderRadius: size * 0.18, background: RAR[c], border: `2px solid ${c === 'empty' ? '#2a2f42' : 'rgba(0,0,0,0.35)'}`,
        boxShadow: c !== 'empty' && c !== 'blue' ? `0 0 ${10 + pulse * 10}px ${RAR[c]}` : 'none'}} />;
    })}
    {highlightGold > 0 && (
      <div style={{position: 'absolute', right: -size * 1.9, top: 0, width: size * 1.4, height: size * 1.4, borderRadius: size * 0.25, border: `4px dashed ${RAR.gold}`, opacity: highlightGold,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff3b47', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size * 1.1}}>×</div>
    )}
  </div>
);

// раскладка 100 результатов в нужных пропорциях (80/16/3/1/0), порядок «как выпадало»
export const ORDER: Rar[] = (() => {
  const arr: Rar[] = [];
  for (let i = 0; i < 100; i++) arr.push('blue');
  const put = (idx: number, c: Rar) => { arr[idx] = c; };
  [2, 7, 13, 19, 24, 33, 38, 44, 57, 61, 66, 72, 78, 85, 91, 96].forEach((i) => put(i, 'purple'));
  [29, 63, 88].forEach((i) => put(i, 'pink'));
  put(47, 'red');
  // первые три — синий, синий, фиолетовый; десятый синий; тридцатый розовый; пятидесятый и сотый синие
  arr[0] = 'blue'; arr[1] = 'blue'; arr[2] = 'purple'; arr[9] = 'blue'; arr[49] = 'blue'; arr[99] = 'blue';
  return arr;
})();
// итоговая сетка, отсортированная по редкости
export const SORTED: Rar[] = [...Array(80).fill('blue'), ...Array(16).fill('purple'), ...Array(3).fill('pink'), 'red'] as Rar[];

// «Вебка» стримера: круг с лицом Лёхи
export const Facecam: React.FC<{x: number; y: number; r: number; mood: Mood; look?: number; sweat?: boolean; tears?: number; light?: string; lightAmt?: number; blink?: number; ring?: string}> = ({x, y, r, ring = '#ffd23f', ...p}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, overflow: 'hidden', border: `6px solid ${ring}`,
    background: 'radial-gradient(circle at 50% 40%, #2a3045, #12141c)', boxShadow: `0 0 30px ${ring}55`}}>
    <svg width={r * 2} height={r * 2} viewBox="-300 -330 600 600">
      <LyokhaBust {...p} />
    </svg>
  </div>
);

// Уведомление Дискорда
export const DiscordCard: React.FC<{appear: number; img: number}> = ({appear, img}) => (
  <div style={{position: 'absolute', left: 540, top: 520, width: 920, transform: `translate(-50%, -50%) translateY(${(1 - appear) * -120}px) scale(${0.9 + 0.1 * appear})`, opacity: appear,
    background: '#313338', borderRadius: 30, padding: 30, boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', fontFamily: 'Montserrat'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18}}>
      <div style={{width: 64, height: 64, borderRadius: 18, background: '#5865f2', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={40} height={30} viewBox="0 0 40 30"><path d="M8 4 Q20 0 32 4 Q38 14 37 24 Q32 28 27 29 L25 25 Q20 26 15 25 L13 29 Q8 28 3 24 Q2 14 8 4 Z" fill="#fff" /><circle cx={14} cy={16} r={3} fill="#5865f2" /><circle cx={26} cy={16} r={3} fill="#5865f2" /></svg>
      </div>
      <div style={{fontSize: 30, fontWeight: 900, color: '#fff'}}>Discord</div>
      <div style={{fontSize: 24, fontWeight: 600, color: '#9aa0aa', marginLeft: 'auto'}}>сейчас</div>
    </div>
    <div style={{display: 'flex', gap: 18}}>
      <div style={{width: 76, height: 76, borderRadius: 38, background: '#f0a24a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 38}}>С</div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 32, fontWeight: 900, color: '#f2f3f5'}}>Санёк</div>
        <div style={{fontSize: 34, fontWeight: 600, color: '#dbdee1', marginTop: 4}}>бро, смотри — нож с первого кейса!!</div>
        {img > 0 && (
          <div style={{marginTop: 18, height: 230, borderRadius: 18, background: 'radial-gradient(circle at 50% 50%, #5a4310, #1a1407 70%)', border: `4px solid ${RAR.gold}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: img, transform: `scale(${0.9 + 0.1 * img})`, boxShadow: `0 0 40px ${RAR.gold}66`}}>
            <KnifeIcon w={420} glow />
          </div>
        )}
      </div>
    </div>
  </div>
);
