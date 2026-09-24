import * as migration_20260914_101915_initial from './20260914_101915_initial';
import * as migration_20260922_093331_bay_area_model from './20260922_093331_bay_area_model';
import * as migration_20260922_152829_tracking_fields from './20260922_152829_tracking_fields';
import * as migration_20260922_155838_editable_copy from './20260922_155838_editable_copy';
import * as migration_20260924_112654_example_review_source from './20260924_112654_example_review_source';

export const migrations = [
  {
    up: migration_20260914_101915_initial.up,
    down: migration_20260914_101915_initial.down,
    name: '20260914_101915_initial',
  },
  {
    up: migration_20260922_093331_bay_area_model.up,
    down: migration_20260922_093331_bay_area_model.down,
    name: '20260922_093331_bay_area_model',
  },
  {
    up: migration_20260922_152829_tracking_fields.up,
    down: migration_20260922_152829_tracking_fields.down,
    name: '20260922_152829_tracking_fields',
  },
  {
    up: migration_20260922_155838_editable_copy.up,
    down: migration_20260922_155838_editable_copy.down,
    name: '20260922_155838_editable_copy',
  },
  {
    up: migration_20260924_112654_example_review_source.up,
    down: migration_20260924_112654_example_review_source.down,
    name: '20260924_112654_example_review_source'
  },
];
