import { combineReducers } from 'redux';
import {view} from '../navigation/reducers.js';
import {credentials} from '../login/reducers.js';
import {info} from '../info/reducers.js';
import {instructions} from '../instructions/index.js';

export const reducer = combineReducers({
  view,
  credentials,
  info,
  instructions
});
