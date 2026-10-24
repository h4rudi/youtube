import React from 'react';
import {Composition} from 'remotion';
import {Intro, INTRO_FRAMES} from './Intro';
import {GameCard} from './GameCard';
import {Reveal} from './Reveal';
import {IntroV2, V2_FRAMES} from './IntroV2';
import {IntroV3, V3_FRAMES} from './IntroV3';
import {IntroV4, V4_FRAMES} from './IntroV4';
import {IntroV5, V5_FRAMES} from './IntroV5';
import {Outro, OUTRO_FRAMES} from './Outro';
import {IntroV6, V6_FRAMES} from './IntroV6';
import {IntroV7, V7_FRAMES} from './IntroV7';
import {IntroV8, V8_FRAMES} from './IntroV8';
import {Tilt, TILT_FRAMES} from './tilt/Tilt';
import {Body8, BODY_FRAMES} from './body/Body8';
import {LyokhaSheet} from './money/Lyokha';
import {Money, MONEY_FRAMES} from './money/Money';
import {VoiceTag, VoiceTagPreview, VoiceTagMini, VT_W, VT_H, VTM_W, VTM_H} from './VoiceTag';

export const Root: React.FC = () => (
  <>
    <Composition id="Intro" component={Intro} durationInFrames={INTRO_FRAMES} fps={60} width={1920} height={1080} defaultProps={{transparent: false}} />
    <Composition id="GameCard" component={GameCard} durationInFrames={210} fps={60} width={1920} height={1080} defaultProps={{game: 1}} />
    <Composition id="Reveal" component={Reveal} durationInFrames={330} fps={60} width={1920} height={1080} />
    <Composition id="IntroV2" component={IntroV2} durationInFrames={V2_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV3" component={IntroV3} durationInFrames={V3_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV4" component={IntroV4} durationInFrames={V4_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV5" component={IntroV5} durationInFrames={V5_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="Outro" component={Outro} durationInFrames={OUTRO_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV6" component={IntroV6} durationInFrames={V6_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV7" component={IntroV7} durationInFrames={V7_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV8" component={IntroV8} durationInFrames={V8_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="VoiceTag" component={VoiceTag} durationInFrames={240} fps={60} width={VT_W} height={VT_H} />
    <Composition id="VoiceTagPreview" component={VoiceTagPreview} durationInFrames={240} fps={60} width={1920} height={1080} />
    <Composition id="VoiceTagMini" component={VoiceTagMini} durationInFrames={240} fps={60} width={VTM_W} height={VTM_H} />
    <Composition id="Money" component={Money} durationInFrames={MONEY_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="LyokhaSheet" component={LyokhaSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Body8" component={Body8} durationInFrames={BODY_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Tilt" component={Tilt} durationInFrames={TILT_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
