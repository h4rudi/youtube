#!/bin/sh
# Перерендер всех роликов выпуска 1: sh render_all.sh
set -e
npx remotion render src/index.ts Intro out/01_intro.mp4 --codec=h264 --crf=16
for g in 1 2 3 4 5 6 7 8 9 10; do
  npx remotion render src/index.ts GameCard out/card_game$(printf %02d $g).mp4 --codec=h264 --crf=16 --props="{\"game\":$g}"
done
npx remotion render src/index.ts Reveal out/99_reveal.mp4 --codec=h264 --crf=16
