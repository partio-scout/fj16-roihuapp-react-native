import f from 'tcomb-form-native';
import { t, getDefaultSupportedLanguage } from '../../translations';
import stylesheet from './styles';

let fields = f.struct({
  publicAccounts: f.maybe(f.String),
  description: f.maybe(f.String) 
});

let options = {
  stylesheet: stylesheet,
  fields: {
    publicAccounts: {
      label: t("Public Accounts", getDefaultSupportedLanguage())
    },        
    description: {
      label: t("Description", getDefaultSupportedLanguage())
    }
  }   
};  

let editDetailsModel = {};
Object.assign(editDetailsModel, {'fields': fields}, {'options': options});

export default editDetailsModel;

