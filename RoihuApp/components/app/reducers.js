import { combineReducers } from 'redux';
import {view} from '../navigation/reducers.js';
import {credentials} from '../login/reducers.js';
import {user} from '../user/reducers.js';
import {calendar} from '../calendar/reducers.js';
import {events} from '../events/index.js';
import {instructions} from '../instructions/index.js';
import {locations} from '../locations/index.js';
import {loginMethod} from '../auth/index.js';
import {info} from '../info/index.js';
import {map} from '../map/reducers.js';
import {language} from '../../translations.js';
import {settings} from '../settings/reducers.js';
import {achievements} from '../achievements/reducers.js';

export const reducer = combineReducers({
  view,
  credentials,
  user,
  calendar,
  events,
  instructions,
  locations,
  loginMethod,
  info,
  map,
  language,
  settings,
  achievements
});
