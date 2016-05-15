'use strict';
import React, {
  Component,
  View,
  Picker,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLanguage } from '../../translations.js';

class Settings extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{marginTop: 10, marginLeft: 10}}>Kieli</Text>
        <Picker selectedValue={this.props.lang}
                prompt={"Kieli"}
                onValueChange={(lang) => this.props.actions.setLanguage(lang)}>
          <Picker.Item label="Suomi" value="fi" />
          <Picker.Item label="Svenska" value="sv" />
          <Picker.Item label="English" value="en" />
        </Picker>
      </View>
    );
  }
}

export default connect(state => ({
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators({setLanguage}, dispatch)
}))(Settings);
