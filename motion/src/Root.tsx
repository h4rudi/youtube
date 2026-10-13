import React from 'react';
import {Composition} from 'remotion';
import {Intro, INTRO_FRAMES} from './Intro';
import {GameCard} from './GameCard';
import {Reveal} from './Reveal';

export const Root: React.FC = () => (
  <>
    <Composition id="Intro" component={Intro} durationInFrames={INTRO_FRAMES} fps={60} width={1920} height={1080} defaultProps={{transparent: false}} />
    <Composition id="GameCard" component={GameCard} durationInFrames={210} fps={60} width={1920} height={1080} defaultProps={{game: 1}} />
    <Composition id="Reveal" component={Reveal} durationInFrames={330} fps={60} width={1920} height={1080} />
  </>
);
