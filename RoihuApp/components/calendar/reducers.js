import React, {
  ListView
} from 'react-native';
import { sortByDate, sortByDateWithFormat } from '../../utils';
const R = require('ramda');
const moment = require('moment');

const PARTITION_FORMAT = "YYYY.MM.DD";

const partitionKey = (timestamp) => timestamp.format(PARTITION_FORMAT);

const partitionEventsByDay = (events) => R.groupBy((event) => partitionKey(moment(event.startTime, moment.ISO_8601)), events);

const sortByStartTime = (a, b) => sortByDate(a.startTime, b.startTime);

function findDayBySelection(sortedDays, selectedDay, selection) {
  const selectedDayIndex = R.findIndex((day) => day === selectedDay, sortedDays);
  return sortedDays[R.min(R.max(selectedDayIndex + (selection === 'prev' ? -1 : 1),
                                0),
                          sortedDays.length - 1)];
}

const sortDays = (days) => R.sort(R.partial(sortByDateWithFormat, [PARTITION_FORMAT]), days);

function findClosestDay(sortedDays) {
  const now = moment();
  const today = partitionKey(now);
  return R.find((date) => date === today, sortedDays) ||
    now.isBefore(moment(sortedDays[0], PARTITION_FORMAT)) ? sortedDays[0] : sortedDays[sortedDays.length -1];
}

export const calendar = (
  state = {routeStack: [{name: "calendar-root"}],
           calendar: null,
           event: null,
           eventsByDay: {},
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
      const sortedDays = sortDays(Object.keys(eventsByDay));
      const today = partitionKey(moment());
      const currentSelectedDay = sortedDays.length !== 0 ? (
        state.selectedDay ?
          R.find((date) => date === state.selectedDay, sortedDays) || sortedDays[0] :
          findClosestDay(sortedDays)
      ) : null;
      const currentCalendarDataSource = currentSelectedDay ?
              state.calendarDataSource.cloneWithRows(eventsByDay[currentSelectedDay].sort(sortByStartTime)) :
              state.calendarDataSource;
      return Object.assign({},
                           state,
                           {calendar: action.calendar,
                            eventsByDay: eventsByDay,
                            selectedDay: currentSelectedDay,
                            calendarDataSource: currentCalendarDataSource});
    }
    case "SELECT_CALENDAR_EVENT":
      return Object.assign({},
                           state,
                           {event: action.event});
    case "SET_CALENDAR_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SELECT_CALENDAR_DATE": {
      const sortedDays = sortDays(Object.keys(state.eventsByDay));
      const newSelectedDay = action.dateType === "today" ?
              findClosestDay(sortedDays) :
              findDayBySelection(sortedDays, state.selectedDay, action.dateType);
      return Object.assign({},
                           state,
                           {selectedDay: newSelectedDay,
                            calendarDataSource: state.calendarDataSource.cloneWithRows(state.eventsByDay[newSelectedDay].sort(sortByStartTime))});
    }
    }
    return state;
  };
