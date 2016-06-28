'use strict';

import f from 'tcomb-form-native';
import { t } from '../../translations';
import stylesheet from './styles';

export const fields = f.struct({
  searchString: f.String,
  date: f.maybe(f.Date),
  startTime: f.maybe(f.Date),
  endTime: f.maybe(f.Date)
});

export const options = (lang) => ({
  stylesheet: stylesheet,
  auto: 'placeholders',
  fields: {
    searchString: {
      placeholder: t("Hakuteksti", lang)
    },
    date: {
      mode: 'date'
    },
    startTime: {
      mode: 'time',
      label: 'alkaa',
      minuteInterval: 10,
    },
    endTime: {
      mode: 'time',
      label: 'loppuu',
      minuteInterval: 10,
    }
  }
});