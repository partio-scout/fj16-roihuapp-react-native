'use strict';
import React, {
  Component,
  View,
  Alert,
  TouchableHighlight,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import f from 'tcomb-form-native';
import { setDetails } from './index';
import { popSettingsRoute } from '../settings/wrapper';
import editDetailsModel from '../models/EditDetailsModel';
import { styles, categoryStyles } from '../../styles';
import { t } from '../../translations';

class EditDetails extends Component {

  constructor(props) {
    super(props);
  }  
  
  popRoute() {
    this.props.actions.popSettingsRoute();
    this.props.navigator.pop();
  }

  saveDetails() {
    let data = this.refs.form.getValue();
    if (data) {
      this.props.actions.setDetails(data);
      Alert.alert(
        null,
        t("Käyttäjätiedot", this.props.lang),
        [
          {text: 'OK', onPress: () => this.popRoute()},
        ]
      )
    }
  } 

  render() {
    let Form = f.form.Form;
    return (
      <View style={{flex: 1}}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>{t("Muokkaa tietoja", this.props.lang)}</Text>
        <Form ref="form" value={this.props.details} type={editDetailsModel.fields} options={editDetailsModel.options} />
        <TouchableHighlight style={styles.basicButton} onPress={() => this.saveDetails()}>
          <Text style={styles.buttonBarColor}>Tallenna</Text>
        </TouchableHighlight>        
      </View>
    );
  }
}

export default connect(state => ({
  lang: state.language.lang,
  details: state.user.details,
  routeStack: state.settings.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({setDetails, popSettingsRoute}, dispatch)
}))(EditDetails);