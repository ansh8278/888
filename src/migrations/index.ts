import * as migration_20260908_084551_initial from './20260908_084551_initial';
import * as migration_20260911_085716_page_copy from './20260911_085716_page_copy';
import * as migration_20260914_093228_page_copy_fields from './20260914_093228_page_copy_fields';

export const migrations = [
  {
    up: migration_20260908_084551_initial.up,
    down: migration_20260908_084551_initial.down,
    name: '20260908_084551_initial',
  },
  {
    up: migration_20260911_085716_page_copy.up,
    down: migration_20260911_085716_page_copy.down,
    name: '20260911_085716_page_copy',
  },
  {
    up: migration_20260914_093228_page_copy_fields.up,
    down: migration_20260914_093228_page_copy_fields.down,
    name: '20260914_093228_page_copy_fields'
  },
];
