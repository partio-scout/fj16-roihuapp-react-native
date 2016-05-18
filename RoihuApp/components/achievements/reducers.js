'use strict';
import React, {
  ListView
} from 'react-native';

const agelevelComparator = (a, b) => a.title.localeCompare(b.title);

export const achievements = (
  state = {
    achievements: null,
    error: null,
    ageLevelDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
    achievementsDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title})
  },
  action) => {
    switch (action.type) {
    case "SET_ACHIEVEMENTS":
      return Object.assign({}, state, {achievements: action.achievements,
                                       ageLevelDataSource:
                                       state.ageLevelDataSource.cloneWithRows(action.achievements.agelevels.sort(agelevelComparator))});
    case "SELECT_AGELEVEL":
      return Object.assign({}, state, {achievementsDataSource: state.achievementsDataSource.cloneWithRows(action.agelevel.achievements)});
    case "SELECT_ACHIEVEMENT":
      return Object.assign({}, state, {achievement: action.achievement});
    case "SET_ACHIEVEMENTS_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
