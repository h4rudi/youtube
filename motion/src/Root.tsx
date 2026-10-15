import React from 'react';
import {Composition} from 'remotion';
import {Intro, INTRO_FRAMES} from './Intro';
import {GameCard} from './GameCard';
import {Reveal} from './Reveal';
import {IntroV2, V2_FRAMES} from './IntroV2';
import {IntroV3, V3_FRAMES} from './IntroV3';
import {IntroV4, V4_FRAMES} from './IntroV4';
import {IntroV5, V5_FRAMES} from './IntroV5';

export const Root: React.FC = () => (
  <>
    <Composition id="Intro" component={Intro} durationInFrames={INTRO_FRAMES} fps={60} width={1920} height={1080} defaultProps={{transparent: false}} />
    <Composition id="GameCard" component={GameCard} durationInFrames={210} fps={60} width={1920} height={1080} defaultProps={{game: 1}} />
    <Composition id="Reveal" component={Reveal} durationInFrames={330} fps={60} width={1920} height={1080} />
    <Composition id="IntroV2" component={IntroV2} durationInFrames={V2_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV3" component={IntroV3} durationInFrames={V3_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV4" component={IntroV4} durationInFrames={V4_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
    <Composition id="IntroV5" component={IntroV5} durationInFrames={V5_FRAMES} fps={60} width={1920} height={1080} defaultProps={{sound: true}} />
  </>
);
