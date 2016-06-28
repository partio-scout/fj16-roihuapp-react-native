'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ListView,
  StyleSheet,
  Navigator
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { t } from '../../translations.js';
import { categoryStyles } from '../../styles.js';
import { popWhenRouteNotLastInStack } from '../../utils.js';

class Events extends Component {

  constructor() {
    super();
  }


  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
    }
  }

  render() {
    const onWillFocus = (route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popNavigationRoute);

    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Navigator initialRouteStack={this.props.routeStack}
                   onWillFocus={onWillFocus}
                   renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
      </View>
    )
  }

  onBack() {
    if (this._navigator) {
      this.props.actions.popNavigationRoute();
      this._navigator.pop();
    }
  }

  componentWillMount() {
    this.backListener = this.props.emitter.addListener("back", () => this.onBack());
  }

  componentWillUnmount() {
    this.backListener.remove();
  }
}

const actions = {
  popNavigationRoute: () => ({
    type: "POP_EVENTS_ROUTE"
  })
};

export const events = (
  state = {routeStack: [{name: "events"}]},
  action) => {
    switch (action.type) {
    case "POP_EVENTS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    }
    return state;
  };

export default connect(state => ({
  routeStack: state.events.routeStack,
  lang: state.language.lang,
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Events);
