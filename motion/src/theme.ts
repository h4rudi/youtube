import {continueRender, delayRender, staticFile} from 'remotion';

export const C = {
  bg: '#08080c',
  orange: '#ff5500',
  red: '#ff2d2d',
  green: '#2bd96b',
  yellow: '#ffc400',
  white: '#ffffff',
  grey: '#7a7a88',
  panel: 'rgba(18,18,24,0.92)',
};

export const F = {
  title: 'Unbounded',
  ui: 'Montserrat',
  alt: 'Russo One',
};

const fonts: [string, string, string][] = [
  ['Unbounded', 'fonts/Unbounded-900.ttf', '900'],
  ['Montserrat', 'fonts/Montserrat-600.ttf', '600'],
  ['Montserrat', 'fonts/Montserrat-900.ttf', '900'],
  ['Russo One', 'fonts/RussoOne.ttf', '400'],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const h = delayRender('fonts');
  Promise.all(
    fonts.map(([fam, file, weight]) => {
      const f = new FontFace(fam, `url(${staticFile(file)})`, {weight});
      return f.load().then((l) => document.fonts.add(l));
    }),
  ).then(() => continueRender(h));
};
