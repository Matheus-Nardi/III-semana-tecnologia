import * as migration_20260823_212802_initial from './20260823_212802_initial';

export const migrations = [
  {
    up: migration_20260823_212802_initial.up,
    down: migration_20260823_212802_initial.down,
    name: '20260823_212802_initial'
  },
];
