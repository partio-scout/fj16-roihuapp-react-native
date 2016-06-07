import t from 'tcomb-form-native';

let fields = t.struct({
  publicAccounts: t.maybe(t.String),
  description: t.maybe(t.String) 
});

let options = {
  //stylesheet: stylesheet,
  fields: {
    publicAccounts: {
      label: 'Some-tilit'
    },        
    description: {
      label: 'Kuvaus'
    }
  }   
};  

let editDetailsModel = {};
Object.assign(editDetailsModel, {'fields': fields}, {'options': options});

export default editDetailsModel;