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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { last, renderRefreshButton, renderBackButton, popWhenRouteNotLastInStack } from '../../utils';
import { infoStyles, styles } from '../../styles';
const EventEmitter = require('EventEmitter');

class CalendarWrapper extends Component {

  constructor(props) {
    super(props);
    this.refreshEventEmitter = new EventEmitter();
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
    case "root":
    default:
      return this.renderChild(navigator);
    }
  }

  pushRoute(route) {
    this.props.actions.pushCalendarRoute(route);
    this._navigator.push(route);
  }

  popRoute() {
    this.props.actions.popCalendarRoute();
    this._navigator.pop();
  }

  resetTo(route) {
    this.props.actions.resetCalendarRoutesTo(route);
    this._navigator.resetTo(route);
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
          {this.renderRefresh()}
        </View>
        <Navigator ref={(component) => {this._navigator = component;}}
          initialRouteStack={this.props.routeStack}
          onWillFocus={(route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popCalendarRoute)}
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

const pushCalendarRoute = (route) => ({
  type: "PUSH_CALENDAR_ROUTE",
  route: route
});

export const popCalendarRoute = () => ({
  type: "POP_CALENDAR_ROUTE"
});

const resetCalendarRoutesTo = (route) => ({
  type: "RESET_CALENDAR_ROUTES",
  route: route
});

export default connect(state => ({
  routeStack: state.calendar.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({pushCalendarRoute,
                               popCalendarRoute,
                               resetCalendarRoutesTo},
                              dispatch)
}))(CalendarWrapper);
