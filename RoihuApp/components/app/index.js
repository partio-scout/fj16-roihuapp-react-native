'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import migrate from 'redux-storage-decorator-migrate';
import {reducer} from './reducers.js';
import Navigation from '../navigation/index.js';
import { baseUrl } from '../../config';

console.log("Using base url", baseUrl);

const engine = migrate(createEngine('roihu'), 1);
engine.addMigration(1, (state) => {
  console.log("migration 1: remove article key from state.instructions and state.locations");
  delete state.instructions.article;
  delete state.locations.article;
  return state;
});
const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
const store = createStoreWithMiddleware(storage.reducer(reducer));
const load = storage.createLoader(engine);
load(store)
  .then((newState) => console.log('Loaded state:', newState))
  .catch(() => console.log('Failed to load previous state'));

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation/>
      </Provider>
    );
  }
};
