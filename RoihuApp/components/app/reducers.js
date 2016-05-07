import { combineReducers } from 'redux';
import {view} from '../navigation/reducers.js';
import {credentials} from '../login/reducers.js';
import {user} from '../user/reducers.js';
import {instructions} from '../instructions/index.js';
import {loginMethod} from '../auth/index.js';
import {info} from '../info/index.js';

export const reducer = combineReducers({
  view,
  credentials,
  user,
  instructions,
  loginMethod,
  info
});
