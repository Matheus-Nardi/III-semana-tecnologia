import * as migration_20260823_212802_initial from './20260823_212802_initial';
import * as migration_20260929_142700_schedule_improvements from './20260929_142700_schedule_improvements';
import * as migration_20261006_034704 from './20261006_034704';
import * as migration_20261006_120000_theme_secondary_color from './20261006_120000_theme_secondary_color';
import * as migration_20261006_180240 from './20261006_180240';
import * as migration_20261008_003532_users_role from './20261008_003532_users_role';

export const migrations = [
  {
    up: migration_20260823_212802_initial.up,
    down: migration_20260823_212802_initial.down,
    name: '20260823_212802_initial',
  },
  {
    up: migration_20260929_142700_schedule_improvements.up,
    down: migration_20260929_142700_schedule_improvements.down,
    name: '20260929_142700_schedule_improvements',
  },
  {
    up: migration_20261006_034704.up,
    down: migration_20261006_034704.down,
    name: '20261006_034704',
  },
  {
    up: migration_20261006_120000_theme_secondary_color.up,
    down: migration_20261006_120000_theme_secondary_color.down,
    name: '20261006_120000_theme_secondary_color',
  },
  {
    up: migration_20261006_180240.up,
    down: migration_20261006_180240.down,
    name: '20261006_180240',
  },
  {
    up: migration_20261008_003532_users_role.up,
    down: migration_20261008_003532_users_role.down,
    name: '20261008_003532_users_role'
  },
];
