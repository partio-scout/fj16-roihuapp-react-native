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
import { popSettingsRoute } from '../settings/wrapper';
import { fields, options } from '../models/EditDetailsModel';
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
      this.popRoute();
    }
  }

  render() {
    let Form = f.form.Form;
    const { lang, details } = this.props;
    return (
      <View style={{flex: 1}}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>{t("Muokkaa tietoja", lang)}</Text>
        <Form ref="form" value={details} type={fields} options={options(lang)} />
        <TouchableHighlight style={styles.basicButton} onPress={() => this.saveDetails()}>
          <Text style={styles.buttonBarColor}>Tallenna</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export const setDetails = (details) => ({
  type: "SET_DETAILS",
  details: details
});

export default connect(state => ({
  lang: state.language.lang,
  details: state.user.details,
  routeStack: state.settings.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({setDetails, popSettingsRoute}, dispatch)
}))(EditDetails);
