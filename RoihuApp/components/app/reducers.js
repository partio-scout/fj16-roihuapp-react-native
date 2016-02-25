import {text} from '../input/reducers.js';
import { combineReducers } from 'redux';

const initialView = "input";

const view = (
  state = initialView,
  action) => {
    switch (action.type) {
    case "SET_VIEW":
      return action.view;
    }
    return state;
  };

export const reducer = combineReducers({
  view,
  text
});
