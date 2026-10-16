// Зацикленная плашка «закадровый голос» (прозрачный фон): микрофон, живая звуковая дорожка, бегущая подсветка рамки.
// Все движения периодичны с периодом = длине ролика, поэтому стык цикла незаметен.
import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender} from 'remotion';

let ld = false;
const loadBenzin = () => {
  if (ld || typeof document === 'undefined') return; ld = true;
  const h = delayRender('benzin-vt');
  new FontFace('Benzin', `url(${staticFile('fonts/Benzin-Bold.ttf')})`).load().then((l) => { document.fonts.add(l); continueRender(h); });
};

export const VT_W = 1040, VT_H = 260;
const ACC = '#ff6a13', ACC2 = '#ffb238';

export const VoiceTag: React.FC = () => {
  loadBenzin();
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const ph = (k: number) => (2 * Math.PI * k * f) / D; // k integer => seamless loop
  const pulse = 0.5 + 0.5 * Math.sin(ph(3));
  const N = 20;
  const bars = Array.from({length: N}).map((_, i) => {
    const v = 0.5 * Math.abs(Math.sin(ph(4) + i * 0.55)) + 0.3 * Math.abs(Math.sin(ph(7) - i * 0.9)) + 0.2 * Math.abs(Math.sin(ph(11) + i * 1.7));
    const env = 0.35 + 0.65 * Math.sin((Math.PI * (i + 0.5)) / N); // taller in the middle
    return 10 + v * env * 92;
  });
  const sweep = (360 * f) / D;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* outer glow */}
      <div style={{position: 'absolute', width: 960, height: 180, borderRadius: 90, boxShadow: `0 0 ${40 + 20 * pulse}px ${ACC}${Math.round(90 + 60 * pulse).toString(16)}`}} />
      {/* rotating gradient border */}
      <div style={{position: 'absolute', width: 960, height: 180, borderRadius: 90, padding: 4,
        background: `conic-gradient(from ${sweep}deg, ${ACC}, transparent 25%, ${ACC2} 50%, transparent 75%, ${ACC})`,
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}} />
      {/* glass body */}
      <div style={{position: 'relative', width: 952, height: 172, borderRadius: 86, background: 'linear-gradient(180deg, rgba(28,28,34,0.92), rgba(10,10,14,0.92))',
        display: 'flex', alignItems: 'center', padding: '0 46px 0 28px', gap: 30, boxSizing: 'border-box'}}>
        {/* mic with pulsing rings */}
        <div style={{position: 'relative', width: 124, height: 124, flexShrink: 0}}>
          {[0, 1].map((k) => {
            const t = ((f / D) * 2 + k * 0.5) % 1; // two rings, 2 cycles per loop
            return <div key={k} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${ACC}`, transform: `scale(${1 + t * 0.55})`, opacity: (1 - t) * 0.8}} />;
          })}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ff8a3d, ${ACC} 55%, #b33d00)`, boxShadow: `0 0 ${18 + 14 * pulse}px ${ACC}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={64} height={64} viewBox="0 0 24 24">
              <rect x={8.5} y={2.5} width={7} height={12} rx={3.5} fill="#fff" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
              <path d="M12 18v3.5M8.5 21.5h7" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </div>
        </div>
        {/* label */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 14, height: 14, borderRadius: 7, background: '#ff2b3a', boxShadow: '0 0 10px #ff2b3a', opacity: 0.45 + 0.55 * (Math.sin(ph(4)) > 0 ? 1 : 0.2)}} />
            <span style={{fontFamily: 'Benzin', fontSize: 24, color: '#ffb6a0', letterSpacing: 3}}>ГОЛОС</span>
          </div>
          <span style={{fontFamily: 'Benzin', fontSize: 46, color: '#fff', lineHeight: 1, textShadow: '0 3px 0 rgba(0,0,0,0.6)'}}>ЗА КАДРОМ</span>
        </div>
        {/* waveform */}
        <div style={{flex: 1, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7, overflow: 'hidden'}}>
          {bars.map((h, i) => (
            <div key={i} style={{width: 9, height: h, borderRadius: 5, background: `linear-gradient(180deg, ${ACC2}, ${ACC})`, boxShadow: `0 0 10px ${ACC}88`}} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// компактная версия без текста
export const VTM_W = 560, VTM_H = 210;
export const VoiceTagMini: React.FC = () => {
  loadBenzin();
  const f = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const ph = (k: number) => (2 * Math.PI * k * f) / D; // k integer => seamless loop
  const pulse = 0.5 + 0.5 * Math.sin(ph(3));
  const N = 16;
  const bars = Array.from({length: N}).map((_, i) => {
    const v = 0.5 * Math.abs(Math.sin(ph(4) + i * 0.55)) + 0.3 * Math.abs(Math.sin(ph(7) - i * 0.9)) + 0.2 * Math.abs(Math.sin(ph(11) + i * 1.7));
    const env = 0.35 + 0.65 * Math.sin((Math.PI * (i + 0.5)) / N); // taller in the middle
    return 10 + v * env * 78;
  });
  const sweep = (360 * f) / D;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* outer glow */}
      <div style={{position: 'absolute', width: 500, height: 150, borderRadius: 75, boxShadow: `0 0 ${40 + 20 * pulse}px ${ACC}${Math.round(90 + 60 * pulse).toString(16)}`}} />
      {/* rotating gradient border */}
      <div style={{position: 'absolute', width: 500, height: 150, borderRadius: 75, padding: 4,
        background: `conic-gradient(from ${sweep}deg, ${ACC}, transparent 25%, ${ACC2} 50%, transparent 75%, ${ACC})`,
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'}} />
      {/* glass body */}
      <div style={{position: 'relative', width: 492, height: 142, borderRadius: 71, background: 'linear-gradient(180deg, rgba(28,28,34,0.92), rgba(10,10,14,0.92))',
        display: 'flex', alignItems: 'center', padding: '0 36px 0 18px', gap: 22, boxSizing: 'border-box'}}>
        {/* mic with pulsing rings */}
        <div style={{position: 'relative', width: 108, height: 108, flexShrink: 0}}>
          {[0, 1].map((k) => {
            const t = ((f / D) * 2 + k * 0.5) % 1; // two rings, 2 cycles per loop
            return <div key={k} style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${ACC}`, transform: `scale(${1 + t * 0.55})`, opacity: (1 - t) * 0.8}} />;
          })}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ff8a3d, ${ACC} 55%, #b33d00)`, boxShadow: `0 0 ${18 + 14 * pulse}px ${ACC}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={64} height={64} viewBox="0 0 24 24">
              <rect x={8.5} y={2.5} width={7} height={12} rx={3.5} fill="#fff" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
              <path d="M12 18v3.5M8.5 21.5h7" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </div>
        </div>
        {/* waveform */}
        <div style={{flex: 1, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, overflow: 'hidden'}}>
          {bars.map((h, i) => (
            <div key={i} style={{width: 9, height: h, borderRadius: 5, background: `linear-gradient(180deg, ${ACC2}, ${ACC})`, boxShadow: `0 0 10px ${ACC}88`}} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// preview over the red intro background (to look at; not for editing)
import {Video} from '@remotion/media';
export const VoiceTagPreview: React.FC = () => (
  <AbsoluteFill style={{background: '#120205'}}>
    <Video src={staticFile('img/bg_red_waves.mp4')} loop muted />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 60}}>
      <div style={{width: VT_W, height: VT_H, position: 'relative'}}><VoiceTag /></div>
    </AbsoluteFill>
  </AbsoluteFill>
);
