import * as migration_20260908_084551_initial from './20260908_084551_initial';
import * as migration_20260911_085716_page_copy from './20260911_085716_page_copy';

export const migrations = [
  {
    up: migration_20260908_084551_initial.up,
    down: migration_20260908_084551_initial.down,
    name: '20260908_084551_initial',
  },
  {
    up: migration_20260911_085716_page_copy.up,
    down: migration_20260911_085716_page_copy.down,
    name: '20260911_085716_page_copy'
  },
];
