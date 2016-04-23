import { combineReducers } from 'redux';
import {view} from '../navigation/reducers.js';
import {credentials} from '../login/reducers.js';
import {user} from '../user/reducers.js';
import {instructions} from '../instructions/index.js';
import {locations} from '../locations/index.js';
import {loginMethod} from '../auth/index.js';
import {info} from '../info/index.js';
import {language} from '../../translations.js';
import {settings} from '../settings/reducers.js';
import {achievements} from '../achi/reducers.js';

export const reducer = combineReducers({
  view,
  credentials,
  user,
  instructions,
  locations,
  loginMethod,
  info,
  language,
  settings,
  achievements
});
