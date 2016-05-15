'use strict';
import React, {
  NativeModules
} from 'react-native';
const I18n = require('react-native-i18n');

I18n.fallbacks = true;

I18n.translations = {
  en: {
    "Kalenteri": "Calendar"
  },
  fi: {
    "Kalenteri": "Kalenteri"
  },
  sv: {
    "Kalenteri": "Kalendar"
  }
};

export function t(key, locale) {
  I18n.locale = locale;
  return I18n.t(key);
}

export function getDefaultSupportedLanguage() {
  const deviceLocale = NativeModules.RNI18n.locale;
  const matches = Object.keys(I18n.translations).filter((lang) => deviceLocale.includes(lang));
  if (matches.length !== 0) {
    return matches[0];
  }
  return "en";
}

export const language = (
  state = {
    lang: getDefaultSupportedLanguage()
  },
  action) => {
  switch (action.type) {
  case "SET_LANGUAGE":
    return Object.assign({}, state, {lang: action.lang});
  }
  return state;
};

export const setLanguage = (lang) => ({
  type: "SET_LANGUAGE",
  lang: lang
});
