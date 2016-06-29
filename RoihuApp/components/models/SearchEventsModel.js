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
  23: '23:00',
});

const Days = f.enums({
  20: '20. heinäkuuta',
  21: '21. heinäkuuta',
  22: '22. heinäkuuta',
  23: '23. heinäkuuta',
  24: '24. heinäkuuta',
  25: '25. heinäkuuta',
  26: '26. heinäkuuta',
  27: '27. heinäkuuta',
  28: '28. heinäkuuta',
});

export const fields = f.struct({
  searchString: f.String,
  date: Days,
  startTime: Hours,
  trackers: f.Boolean,
  explorers: f.Boolean,
  rovers: f.Boolean,
  adults: f.Boolean,
  dayCareKids: f.Boolean,
  schoolKids: f.Boolean
});

export const options = (lang) => ({
  stylesheet: stylesheet,
  auto: 'placeholders',
  fields: {
    searchString: {
      placeholder: t("Hakuteksti", lang)
    },
    date: {
      label: t("Pvm", lang)
    },
    startTime: {
      label: t("Alkaa aikaisintaan", lang)
    },
    trackers: {
      label: t("Tarpojat", lang)
    },
    explorers: {
      label: t("Samoajat", lang)
    },
    rovers: {
      label: t("Vaeltajat", lang)
    },
    adults: {
      label: t("Aikuiset", lang)
    },
    dayCareKids: {
      label: t("Päiväkotilapset", lang)
    },
    schoolKids: {
      label: t("EVT", lang)
    }
  }
});