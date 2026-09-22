import * as migration_20260908_084551_initial from './20260908_084551_initial';
import * as migration_20260911_085716_page_copy from './20260911_085716_page_copy';
import * as migration_20260914_093228_page_copy_fields from './20260914_093228_page_copy_fields';
import * as migration_20260922_093319_bay_area_model from './20260922_093319_bay_area_model';
import * as migration_20260922_152804_tracking_fields from './20260922_152804_tracking_fields';

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
    name: '20260914_093228_page_copy_fields',
  },
  {
    up: migration_20260922_093319_bay_area_model.up,
    down: migration_20260922_093319_bay_area_model.down,
    name: '20260922_093319_bay_area_model',
  },
  {
    up: migration_20260922_152804_tracking_fields.up,
    down: migration_20260922_152804_tracking_fields.down,
    name: '20260922_152804_tracking_fields'
  },
];
