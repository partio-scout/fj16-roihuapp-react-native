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
import Settings from '../settings/index';
import EditDetails from '../user/EditDetails';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { last, renderRefreshButton, renderBackButton, popWhenRouteNotLastInStack } from '../../utils';
import { infoStyles, styles } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
const EventEmitter = require('EventEmitter');

class SettingsWrapper extends Component {

  constructor(props) {
    super(props);
    this.refreshEventEmitter = new EventEmitter();
  }

  renderSettings(navigator) {
    return (
      <Settings/>
    );
  }

  renderEditDetails(navigator) {
    return (
      <EditDetails navigator={navigator}/>
    );
  }

  renderChild(navigator) {
    return React.cloneElement(this.props.children,
                              {parentNavigator: navigator,
                               pushRoute: (route) => this.pushRoute(route),
                               resetTo: (route) => this.resetTo(route),
                               refreshEventEmitter: this.refreshEventEmitter,
                               popRoute: () => this.popRoute()});
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case "edit-details":
      return this.renderEditDetails(navigator);
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

  resetTo(route) {
    this.props.actions.resetSettingsRoutesTo(route);
    this._navigator.resetTo(route);
  }

  renderEditDetailsButton() {
    if (last(this.props.routeStack).name !== "user-root") {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                          onPress={() => this.pushRoute({name: "edit-details"})}>
          <Icon style={[{textAlign: 'right'}, styles.buttonBarIcon]} name="edit" />
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
          <Icon style={[{textAlign: 'right'}, styles.buttonBarIcon]} name="settings" />
        </TouchableOpacity>
      );
    }
  }

  renderRefresh() {
    const lastRoute = last(this.props.routeStack);
    return lastRoute && lastRoute.name === "user-root" ? renderRefreshButton(() => this.refreshEventEmitter.emit("refresh")) : null;
  }

  render() {
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <View style={infoStyles.topNavigationBar}>
          {renderBackButton(this.props.routeStack, () => this.popRoute())}
          <View style={{flex: 1}}></View>
          {this.renderEditDetailsButton()}
          {this.renderRefresh()}
          {this.renderSettingsButton()}
        </View>
        <Navigator ref={(component) => {this._navigator = component;}}
          initialRouteStack={this.props.routeStack}
          onWillFocus={(route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popSettingsRoute)}
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

export const popSettingsRoute = () => ({
  type: "POP_SETTINGS_ROUTE"
});

const resetSettingsRoutesTo = (route) => ({
  type: "RESET_SETTINGS_ROUTES",
  route: route
});

export default connect(state => ({
  routeStack: state.settings.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({pushSettingsRoute,
                               popSettingsRoute,
                               resetSettingsRoutesTo},
                              dispatch)
}))(SettingsWrapper);
