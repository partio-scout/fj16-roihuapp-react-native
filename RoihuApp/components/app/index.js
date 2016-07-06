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
import { isEmpty, last } from '../../utils';

console.log("Using base url", baseUrl);

const engine = migrate(createEngine('roihu'), 2);
engine.addMigration(1, (state) => {
  console.log("migration 1: remove article key from state.instructions and state.locations");
  if (!isEmpty(state.instructions.article)) {
    state.instructions.selectedArticle = state.instructions.article;
  }
  if (!isEmpty(state.locations.article)) {
    state.locations.selectedArticle = state.locations.article;
  }
  delete state.instructions.article;
  delete state.locations.article;
  return state;
});
engine.addMigration(2, (state) => {
  console.log("migration 2: when selected article is null and current view is article, change view to category");
  if (last(state.instructions.routeStack).name === "article" && !state.instructions.selectedArticle) {
    state.instructions.routeStack.pop();
  }
  if (last(state.locations.routeStack).name === "article" && !state.locations.selectedArticle) {
    state.locations.routeStack.pop();
  }
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
