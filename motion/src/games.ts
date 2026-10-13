export type Game = {n: number; map: string; win: boolean; score: string; kda: string; kd: string; rating: string; adr: string; date: string};
// Матчи калибровки (скрин FACEIT пользователя, 10 и 12 окт.)
export const GAMES: Game[] = [
  {n: 1, map: 'MIRAGE', win: false, score: '8:13', kda: '13/16/5', kd: '0.81', rating: '1.15', adr: '71.0', date: '10 окт'},
  {n: 2, map: 'NUKE', win: true, score: '13:5', kda: '25/8/4', kd: '3.13', rating: '2.03', adr: '129.4', date: '10 окт'},
  {n: 3, map: 'DUST 2', win: true, score: '13:5', kda: '12/10/5', kd: '1.20', rating: '1.12', adr: '76.8', date: '10 окт'},
  {n: 4, map: 'MIRAGE', win: true, score: '13:6', kda: '10/13/2', kd: '0.77', rating: '0.86', adr: '70.7', date: '10 окт'},
  {n: 5, map: 'MIRAGE', win: false, score: '9:13', kda: '17/18/4', kd: '0.94', rating: '1.04', adr: '89.9', date: '10 окт'},
  {n: 6, map: 'DUST 2', win: false, score: '14:16', kda: '32/17/4', kd: '1.88', rating: '1.43', adr: '104.1', date: '12 окт'},
  {n: 7, map: 'ANCIENT', win: false, score: '9:13', kda: '20/16/7', kd: '1.25', rating: '1.31', adr: '86.6', date: '12 окт'},
  {n: 8, map: 'MIRAGE', win: true, score: '13:10', kda: '14/15/9', kd: '0.93', rating: '1.16', adr: '81.3', date: '12 окт'},
  {n: 9, map: 'INFERNO', win: true, score: '13:6', kda: '14/12/8', kd: '1.17', rating: '1.37', adr: '85.6', date: '12 окт'},
  {n: 10, map: 'ANUBIS', win: false, score: '9:13', kda: '17/17/4', kd: '1.00', rating: '0.86', adr: '84.5', date: '12 окт'},
];
export const FINAL = {level: 4, elo: 1044};
