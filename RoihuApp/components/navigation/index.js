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
import Achievements from '../achievements/index.js';
import * as actions from './actions.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

class Navigation extends Component {

  renderSelectionHighlight() {
    return (
      <View style={{width: 80, height: 10, backgroundColor: 'white'}}></View>
    );
  }

  renderTabButton(id, text, icon) {
    return (
      <TouchableOpacity style={styles.button}
                        onPress={() => this.props.actions.setView(id)}>
        <View style={{alignItems: 'center', flex: 1}}>
          <Icon style={styles.buttonBarIcon} name={icon} />
          <Text style={styles.buttonBarColor}>{text}</Text>
          {id === this.props.view ? this.renderSelectionHighlight() : null }
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { view, lang } = this.props;
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(view)}
        </View>
        <View style={styles.buttonBar}>
          {this.renderTabButton("map", t("Kartta", lang), "map")}
          {this.renderTabButton("info", t("Info", lang), "info-outline")}
          {this.renderTabButton("achievements", t("Aktiviteetit", lang), "stars")}
          {this.renderTabButton("user", t("Minä", lang), "perm-identity")}
        </View>
      </View>
    );
  }

  renderView(view) {
    switch (view) {
    case "info":
      return (<Info/>);
    case "achievements":
      return (<Achievements/>);
    case "user":
      return (
        <SettingsWrapper>
          <Auth>
            <User/>
          </Auth>
        </SettingsWrapper>
      );
    case "map":
    default:
      return (<Map/>);
    }
  }

}

export default connect(state => ({
  view: state.view,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Navigation);
