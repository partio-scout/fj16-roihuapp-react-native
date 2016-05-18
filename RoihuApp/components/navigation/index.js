'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {styles} from '../../styles.js';
import { t } from '../../translations.js';
const Map = require('../map');
import Auth from '../auth/index.js';
import User from '../user/index.js';
import Info from '../info/index.js';
import SettingsWrapper from '../settings/wrapper.js';
import * as actions from './actions.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

class Navigation extends Component {

  render() {
    const { view, actions: {setView}, lang } = this.props;
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(view)}
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("map")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="place" size={30} color="#000000"/>
              <Text>{t("Kartta", lang)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("info")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="search" size={30} color="#000000"/>
              <Text>{t("Info", lang)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("user")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="account-circle" size={30} color="#000000"/>
              <Text>{t("Minä", lang)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderView(view) {
    switch (view) {
    case "map":
      return (<Map/>);
    case "info":
      return (<Info/>);
    case "user":
      return (
        <SettingsWrapper>
          <Auth>
            <User/>
          </Auth>
        </SettingsWrapper>
      );
    default:
      return (<Calendar/>);
    }
  }

}

export default connect(state => ({
  view: state.view,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Navigation);
