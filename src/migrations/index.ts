import * as migration_20260908_084551_initial from './20260908_084551_initial';

export const migrations = [
  {
    up: migration_20260908_084551_initial.up,
    down: migration_20260908_084551_initial.down,
    name: '20260908_084551_initial'
  },
];
