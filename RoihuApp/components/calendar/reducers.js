import React, {
  ListView
} from 'react-native';
import { sortByDate } from '../../utils';
const R = require('ramda');
const moment = require('moment');

const partitionKey = (timestamp) => timestamp.format("YYYY.MM.DD");

const partitionEventsByDay = (events) => R.groupBy((event) => partitionKey(moment(event.startTime, moment.ISO_8601)), events);

const sortByStartTime = (a, b) => sortByDate(a.startTime, b.startTime);

export const calendar = (
  state = {routeStack: [{name: "calendar-root"}],
           calendar: null,
           event: null,
           eventsByDay: null,
           selectedDay: null,
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
    case "SET_CALENDAR": {
      const eventsByDay = partitionEventsByDay(action.calendar.events);
      const sortedDays = R.sort(sortByDate, Object.keys(eventsByDay));
      const today = partitionKey(moment());
      const currentSelectedDay = state.selectedDay ?
              R.find((date) => date === state.selectedDay, sortedDays) || sortedDays[0] :
              R.find((date) => date === today, sortedDays) || sortedDays[0];
      return Object.assign({},
                           state,
                           {calendar: action.calendar,
                            eventsByDay: eventsByDay,
                            selectedDay: currentSelectedDay,
                            calendarDataSource: state.calendarDataSource.cloneWithRows(eventsByDay[currentSelectedDay].sort(sortByStartTime))});
    }
    case "SELECT_CALENDAR_EVENT":
      return Object.assign({},
                           state,
                           {event: action.event});
    case "SET_CALENDAR_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "CALENDAR_SELECT_DATE": {
      const sortedDays = R.sort(sortByDate, Object.keys(state.eventsByDay));
      console.log(sortedDays);
      const selectedDayIndex = R.findIndex((day) => day === state.selectedDay, sortedDays);
      const newSelectedDay = sortedDays[R.min(R.max(selectedDayIndex + (action.dateType === 'prev' ? 1 : -1),
                                                    0),
                                              sortedDays.length - 1)];
      console.log("newSelectedDay", newSelectedDay);
      return Object.assign({},
                           state,
                           {selectedDay: newSelectedDay,
                            calendarDataSource: state.calendarDataSource.cloneWithRows(state.eventsByDay[newSelectedDay].sort(sortByStartTime))});
    }
    }
    return state;
  };
