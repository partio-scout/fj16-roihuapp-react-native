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

import {styles} from '../../styles.js';
import {Map} from '../map.js';
import {Calendar} from '../calendar.js';

import {reducer} from './reducers.js';
import * as actions from './actions.js';

import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';

const engine = createEngine('roihu');
const middleware = storage.createMiddleware(engine);

const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
const store = createStoreWithMiddleware(storage.reducer(reducer));
store.subscribe(() => {
  console.log(store.getState());
});
const load = storage.createLoader(engine);
load(store)
  .then((newState) => console.log('Loaded state:', newState))
  .catch(() => console.log('Failed to load previous state'));

class MainView extends Component {

  render() {
    const { view, actions: {setView} } = this.props;
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(view)}
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("calendar")}>
            <Image source={require('../../icons/calendar.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("map")}>
            <Image source={require('../../icons/pin.png')}/>
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
  actions: bindActionCreators(actions, dispatch)
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
