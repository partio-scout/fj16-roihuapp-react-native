'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';

import {styles} from './styles.js';
import {Map} from './components/map.js';
import {Calendar} from './components/calendar.js';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const initialView = {view: "map"};

const currentView = (
  state = initialView,
  action) => {
    switch (action.type) {
    case "SET_VIEW":
      return {
          ...state,
        view: action.view};
    }
    return state;
  };

const store = createStoreWithMiddleware(currentView);

class MainView extends Component {

  render() {
    const { view, actions } = this.props;
    const { setView } = actions;
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(view)}
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("calendar")}>
            <Image source={require('./icons/calendar.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("map")}>
            <Image source={require('./icons/pin.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderView(view) {
    switch (view) {
    case "calendar":
      return (<Calendar/>);
      break;
    case "map":
      return (<Map/>);
      break;
    default:
      return (<Calendar/>);
    }
  }

}

const ConnectedMainView = connect(state => ({
  view: state.view
}), (dispatch) => ({
  actions: bindActionCreators({
    setView: (view) => ({
      type: "SET_VIEW",
      view: view})}, dispatch)
}))(MainView);

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedMainView/>
      </Provider>
    );
  }
};
