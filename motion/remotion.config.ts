import {Config} from '@remotion/cli/config';
import fs from 'fs';
import path from 'path';

// браузер облачной среды Claude: версия в имени папки меняется, ищем любую headless_shell
const PW = '/opt/pw-browsers';
const shell = fs.existsSync(PW)
  ? fs.readdirSync(PW).filter((d) => d.startsWith('chromium_headless_shell')).map((d) => {
      const dir = path.join(PW, d);
      const sub = fs.readdirSync(dir).find((s) => s.startsWith('chrome-'));
      return sub ? [path.join(dir, sub, 'headless_shell'), path.join(dir, sub, 'chrome-headless-shell')].find((p) => fs.existsSync(p)) : undefined;
    }).find(Boolean)
  : undefined;
if (shell) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('jpeg');
Config.setChromiumOpenGlRenderer('angle');
