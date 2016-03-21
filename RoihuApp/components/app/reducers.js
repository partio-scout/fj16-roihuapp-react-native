import { combineReducers } from 'redux';
import {view} from '../navigation/reducers.js';
import {token} from '../login/reducers.js';
import {info} from '../info/reducers.js';
import {instructions} from '../instructions/reducers.js';

export const reducer = combineReducers({
  view,
  token,
  info,
  instructions
});
