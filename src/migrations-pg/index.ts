import * as migration_20260914_101915_initial from './20260914_101915_initial';
import * as migration_20260922_093331_bay_area_model from './20260922_093331_bay_area_model';

export const migrations = [
  {
    up: migration_20260914_101915_initial.up,
    down: migration_20260914_101915_initial.down,
    name: '20260914_101915_initial',
  },
  {
    up: migration_20260922_093331_bay_area_model.up,
    down: migration_20260922_093331_bay_area_model.down,
    name: '20260922_093331_bay_area_model'
  },
];
