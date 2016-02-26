import { combineReducers } from 'redux';

const initialView = "map";

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
  view
});
