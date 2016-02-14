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
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';

import {styles} from './styles.js';
import {Map} from './components/map.js';
import {Calendar} from './components/calendar.js';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const currentView = (
  state = {view: "map"},
  action) => {
    switch (action.type) {
    case "SET_VIEW":
      return {view: action.view};
    }
    return state;
  };

const store = createStoreWithMiddleware(currentView);

class MainView extends Component {
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(store.getState().view)}
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.button}
                            onPress={() => store.dispatch({type: "SET_VIEW", view: "calendar"})}>
            <Image source={require('./icons/calendar.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => store.dispatch({type: "SET_VIEW", view: "map"})}>
            <Image source={require('./icons/pin.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
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

export class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainView/>
      </Provider>
    );
  }
};
