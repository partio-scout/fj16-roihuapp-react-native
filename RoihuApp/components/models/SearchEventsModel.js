'use strict';

import f from 'tcomb-form-native';
import { t } from '../../translations';
import stylesheet from './styles';

const Hours = f.enums({
  0: '00:00',
  1: '01:00',
  2: '02:00',
  3: '03:00',
  4: '04:00',
  5: '05:00',
  6: '06:00',
  7: '07:00',
  8: '08:00',
  9: '09:00',
  10: '10:00',
  11: '11:00',
  12: '12:00',
  13: '13:00',
  14: '14:00',
  15: '15:00',
  16: '16:00',
  17: '17:00',
  18: '18:00',
  19: '19:00',
  20: '20:00',
  21: '21:00',
  22: '22:00',
  23: '23:00'
});

const Days = (lang) => f.enums({
  20: '20. ' + t("Heinäkuuta", lang),
  21: '21. ' + t("Heinäkuuta", lang),
  22: '22. ' + t("Heinäkuuta", lang),
  23: '23. ' + t("Heinäkuuta", lang),
  24: '24. ' + t("Heinäkuuta", lang),
  25: '25. ' + t("Heinäkuuta", lang),
  26: '26. ' + t("Heinäkuuta", lang),
  27: '27. ' + t("Heinäkuuta", lang),
  28: '28. ' + t("Heinäkuuta", lang)
});

const Groups = (lang) => f.enums({
  Tarpojat: t('Tarpojat', lang),
  Samoajat: t('Samoajat', lang),
  Vaeltajat: t('Vaeltajat', lang),
  Aikuiset: t('Aikuiset', lang),
  Päiväkotilapset: t('Päiväkotilapset', lang),
  EVT: t('EVT', lang)
});

export const fields = (lang) => f.struct({
  searchString: f.maybe(f.String)
});

export const options = (lang) => ({
  stylesheet: stylesheet,
  auto: 'placeholders',
  fields: {
    searchString: {
      placeholder: t("Hakuteksti", lang)
    }
  }
});

export const detailFields = (lang) => f.struct({
  date: f.maybe(Days(lang)),
  startTime: f.maybe(Hours),
  ageGroup: f.maybe(Groups(lang))
});

export const detailOptions = (lang) => ({
  stylesheet: stylesheet,
  fields: {
    date: {
      label: t("Pvm", lang)
    },
    startTime: {
      label: t("Alkaa aikaisintaan", lang)
    },
    ageGroup: {
      label: t("Age level", lang)
    }
  }
});
