import * as migration_20260914_101915_initial from './20260914_101915_initial';

export const migrations = [
  {
    up: migration_20260914_101915_initial.up,
    down: migration_20260914_101915_initial.down,
    name: '20260914_101915_initial'
  },
];
