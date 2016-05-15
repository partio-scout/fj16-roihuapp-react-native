'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Navigator,
  BackAndroid
} from 'react-native';
import Settings from '../settings/index.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { last } from '../../utils.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

class SettingsWrapper extends Component {

  renderSettings(navigator) {
    return (
      <Settings navigator={navigator}/>
    );
  }

  renderChild(navigator) {
    return React.cloneElement(this.props.children,
                              {parentNavigator: navigator,
                               pushRoute: (route) => this.pushRoute(route)});
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case "settings":
      return this.renderSettings(navigator);
    case "root":
    default:
      return this.renderChild(navigator);
    }
  }

  pushRoute(route) {
    this.props.actions.pushSettingsRoute(route);
    this._navigator.push(route);
  }

  popRoute() {
    this.props.actions.popSettingsRoute();
    this._navigator.pop();
  }

  renderBackButton() {
    if (this.props.routeStack.length === 1) {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}
                          onPress={() => this.popRoute()}>
          <Icon name="arrow-back" size={30} color="#000000"/>
        </TouchableOpacity>
      );
    }
  }

  renderSettingsButton() {
    if (last(this.props.routeStack).name === "settings") {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                          onPress={() => this.pushRoute({name: "settings"})}>
          <Icon style={{textAlign: 'right'}} name="settings" size={30} color="#000000"/>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <View style={{flexDirection: 'row'}}>
          {this.renderBackButton()}
          <View style={{flex: 1}}></View>
          {this.renderSettingsButton()}
        </View>
        <Navigator ref={(component) => {this._navigator = component;}}
                   initialRouteStack={this.props.routeStack}
                   renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
      </View>
    );
  }

  componentWillMount() {
    this.onBack = () => {
      if (this.props.routeStack.length === 1) {
        return false;
      } else {
        this.popRoute();
        return true;
      }
    };
    BackAndroid.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
  }

}

const pushSettingsRoute = (route) => ({
  type: "PUSH_SETTINGS_ROUTE",
  route: route
});

const popSettingsRoute = () => ({
  type: "POP_SETTINGS_ROUTE"
});

export default connect(state => ({
  routeStack: state.settings.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({pushSettingsRoute,
                               popSettingsRoute},
                              dispatch)
}))(SettingsWrapper);
