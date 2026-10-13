import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, Easing} from 'remotion';
import {C, F, loadFonts} from './theme';
import {Flash, Gauge, GridBg, Shake, glitchShadow, useSlam} from './fx';
import {FINAL, GAMES} from './games';

// 0-90: "?" pulsing with tension; 90: glitch; 120: level slam; then ELO counts up and W/L summary
export const Reveal: React.FC = () => {
  loadFonts();
  const f = useCurrentFrame();
  const hit = 120;
  const after = f >= hit;
  const fill = after ? interpolate(f, [hit, hit + 40], [0, FINAL.level / 10], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}) : 0;
  const elo = Math.round(interpolate(f, [hit + 20, hit + 90], [0, FINAL.elo], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const {scale} = useSlam(hit, 2.6);
  const pre = 1 + interpolate(f, [0, hit], [0, 0.12]) + (f > 70 && f < hit ? (random(`rv${f}`) - 0.5) * 0.04 : 0);
  const wins = GAMES.filter((g) => g.win).length;
  const o = (a: number) => interpolate(f, [a, a + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <GridBg accent={after ? C.yellow : C.grey} speed={after ? 1 : 0.4} />
      <Shake at={hit} amount={34} dur={24}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{fontFamily: F.ui, fontWeight: 900, fontSize: 54, color: C.white, letterSpacing: 6, marginBottom: 20}}>ИТОГ КАЛИБРОВКИ</div>
          <div style={{transform: `scale(${after ? 1 : pre})`}}>
            <Gauge fill={fill} color={C.yellow} size={480}>
              <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 230, color: after ? C.yellow : C.white,
                transform: `scale(${after ? scale : 1})`, textShadow: glitchShadow(f, (f > 90 && f < hit) || (after && f < hit + 10), 24)}}>{after ? FINAL.level : '?'}</div>
            </Gauge>
          </div>
          <div style={{display: 'flex', gap: 60, marginTop: 30, alignItems: 'baseline'}}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 90, color: C.white, opacity: o(hit + 20)}}>{elo} <span style={{color: C.grey, fontSize: 50}}>ELO</span></div>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 60, opacity: o(hit + 70)}}>
              <span style={{color: C.green}}>{wins}W</span> <span style={{color: C.grey}}>/</span> <span style={{color: C.red}}>{10 - wins}L</span>
            </div>
          </div>
        </AbsoluteFill>
      </Shake>
      <Flash at={hit} dur={14} color={C.yellow} />
    </AbsoluteFill>
  );
};
