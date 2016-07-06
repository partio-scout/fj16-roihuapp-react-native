import React, {
  ListView
} from 'react-native';
import { sortByDate } from '../../utils';

export const calendar = (
  state = {routeStack: [{name: "user-root"}],
           calendar: null,
           calendarDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.eventId !== r2.eventId}),
           error: null},
  action) => {
    switch (action.type) {
    case "PUSH_CALENDAR_ROUTE":
      return Object.assign({}, state, {routeStack: state.routeStack.concat(action.route)});
    case "POP_CALENDAR_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    case "RESET_CALENDAR_ROUTES":
      return Object.assign({}, state, {routeStack: [action.route]});

    case "SET_CALENDAR":
      return Object.assign({}, state, {calendar: action.calendar.calendar,
                                       calendarDataSource: state.calendarDataSource.cloneWithRows(
                                          action.calendar.calendar.events.sort((a, b) => sortByDate(a.startTime, b.startTime))
                                       )});
    case "SELECT_CALENDAR_EVENT":
      return Object.assign({},
                           state,
                           {event: action.event,
                            routeStack: state.routeStack.concat(action.route)});
    case "SET_CALENDAR_ERROR":
      return Object.assign({}, state, {error: action.error});
    }
    return state;
  };
