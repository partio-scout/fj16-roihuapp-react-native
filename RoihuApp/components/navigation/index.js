'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {styles} from '../../styles';
import { t } from '../../translations';
import Map from '../map/index';
import Auth from '../auth/index';
import User from '../user/index';
import Info from '../info/index';
import SettingsWrapper from '../settings/wrapper';
import Achievements from '../achievements/index';
import CalendarWrapper from '../calendar/wrapper';
import Calendar from '../calendar/index';
import { setCredentials } from '../login/actions';
import { parseCredentials } from '../auth/utils';
import * as actions from './actions';
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
          {this.renderView(view, lang)}
        </View>
        <View style={styles.buttonBar}>
          {this.renderTabButton("calendar", t("Kalenteri", lang), "insert-invitation")}
          {this.renderTabButton("map", t("Kartta", lang), "map")}
          {this.renderTabButton("info", t("Info", lang), "info-outline")}
          {this.renderTabButton("achievements", t("Aktiviteetit", lang), "stars")}
          {this.renderTabButton("user", t("Minä", lang), "perm-identity")}
        </View>
      </View>
    );
  }

  renderView(view, lang) {
    switch (view) {
    case "calendar":
      return (
        <CalendarWrapper>
          <Auth loginPrompt={t("Kirjaudu nähdäksesi kalenterisi", lang)}>
            <Calendar/>
          </Auth>
        </CalendarWrapper>
      );
    case "info":
      return (<Info/>);
    case "achievements":
      return (<Achievements/>);
    case "user":
      return (
        <SettingsWrapper>
          <Auth loginPrompt={t("login title", lang)}>
            <User/>
          </Auth>
        </SettingsWrapper>
      );
    case "map":
    default:
      return (<Map/>);
    }
  }

  login(url) {
    console.log("login url", url);
    if (url) {
      const [userId, token] = parseCredentials(url);
      if (userId && token) {
        this.props.actions.setCredentials({token: token, userId: userId});
        this.props.actions.setView("user");
      }
    }
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      this.login(url);
    });
    this.urlListener = (event) => {
      this.login(event.url);
    };
    if (Platform.OS === "android") {
      Linking.addEventListener('url', this.urlListener);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      Linking.removeEventListener('url', this.urlListener);
    }
  }

}

export default connect(state => ({
  view: state.view,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, actions, {setCredentials}), dispatch)
}))(Navigation);
