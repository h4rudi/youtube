# Моушен-графика канала (Remotion)

Ролики делаются кодом (React + Remotion), рендер в MP4 1920×1080, 60 fps.

- `src/Intro.tsx` — интро выпуска (25,5 с, 7 блоков, таймингы в `INTRO_BEATS`).
- `src/GameCard.tsx` — карточка результата игры (3,5 с), данные в `src/games.ts`.
- `src/Reveal.tsx` — раскрытие итогового уровня (5,5 с).
- `src/fx.tsx` — сетка-фон, тряска, вспышка, глитч, значок пинга, шкала уровня.

Рендер: `npm install`, затем `sh render_all.sh` → файлы в `out/`.
В облачной среде Claude браузер берётся из `/opt/pw-browsers` (см. `remotion.config.ts`).
