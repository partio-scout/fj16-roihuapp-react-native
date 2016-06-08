'use strict';

import f from 'tcomb-form-native';
import { t } from '../../translations';
import stylesheet from './styles';

export const fields = f.struct({
  publicAccounts: f.maybe(f.String),
  description: f.maybe(f.String)
});

export const options = (lang) => ({
  stylesheet: stylesheet,
  fields: {
    publicAccounts: {
      label: t("Public Accounts", lang)
    },
    description: {
      label: t("Description", lang)
    }
  }
});
