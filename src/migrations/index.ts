import * as migration_20260823_212802_initial from './20260823_212802_initial';
import * as migration_20260929_142700_schedule_improvements from './20260929_142700_schedule_improvements';

export const migrations = [
  {
    up: migration_20260823_212802_initial.up,
    down: migration_20260823_212802_initial.down,
    name: '20260823_212802_initial'
  },
  {
    up: migration_20260929_142700_schedule_improvements.up,
    down: migration_20260929_142700_schedule_improvements.down,
    name: '20260929_142700_schedule_improvements'
  },
];
