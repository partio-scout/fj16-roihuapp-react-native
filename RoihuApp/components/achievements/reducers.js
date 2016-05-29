'use strict';
import React, {
  ListView
} from 'react-native';

const titleComparator = (a, b) => a.title.localeCompare(b.title);

export const achievements = (
  state = {
    achievements: null,
    routeStack: [{name: "agelevels"}],
    ageLevelDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
    achievementsDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
    achievement: {},
    fetch: {state: "COMPLETED"}
  },
  action) => {
    switch (action.type) {
    case "SET_ACHIEVEMENTS":
      return Object.assign({}, state, {achievements: action.achievements,
                                       ageLevelDataSource:
                                       state.ageLevelDataSource.cloneWithRows(action.achievements.agelevels.sort(titleComparator))});
    case "SELECT_AGELEVEL":
      return Object.assign({}, state, {achievementsDataSource: state.achievementsDataSource.cloneWithRows(action.agelevel.achievements.sort(titleComparator)),
                                       routeStack: state.routeStack.concat(action.route)});
    case "SELECT_ACHIEVEMENT":
      return Object.assign({}, state, {achievement: action.achievement,
                                       routeStack: state.routeStack.concat(action.route)});
    case "SET_ACHIEVEMENTS_ERROR":
      return Object.assign({}, state, {error: action.error});;
    case "POP_ACHIEVEMENTS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    case "ACHIEVEMENTS_FETCH_STATE":
      return Object.assign({}, state, {fetch: {state: action.state}});
    case "MARK_ACHIEVEMENT_DONE":
      return Object.assign({}, state, {achievement: Object.assign({}, state.achievement, {userAchieved: true})});
    }
    return state;
  };
