'use strict';
import React, {
  ListView
} from 'react-native';
import { sortNumber } from '../../utils';

const achievementEquals = (r1, r2) => r1.id !== r2.id || r1.title !== r2.title || r1.achievement !== r2.userAchieved;

function markAchievementDone(state, done) {
  const markDone = (a) => { if(a.id === state.achievement.id) {
    return Object.assign({}, a, {userAchieved: done});
  } else {
    return a;
  }};
  const newAgeLevel = Object.assign({},
                                    state.agelevel,
                                    {achievements: state.agelevel.achievements.map(markDone)});
  const updateAgeLevel = (ageLevel) => {
    if (ageLevel.id === newAgeLevel.id) {
      return newAgeLevel;
    } else {
      return ageLevel;
    }
  };
  const newAchievements = Object.assign({},
                                        state.achievements,
                                        {agelevels: state.achievements.agelevels.map(updateAgeLevel)});
  const newAgeLevelDataSource = state.ageLevelDataSource.cloneWithRows(newAchievements.agelevels.sort(titleComparator));
  const newAchievementsDataSource = state.achievementsDataSource.cloneWithRows(newAgeLevel.achievements.sort(titleComparator));
  return Object.assign({},
                       state,
                       {achievements: newAchievements,
                        achievement: Object.assign({}, state.achievement, {userAchieved: done}),
                        ageLevelDataSource: newAgeLevelDataSource,
                        achievementsDataSource: newAchievementsDataSource,
                        agelevel: newAgeLevel});
}

export const achievements = (
  state = {
    achievements: null,
    routeStack: [{name: "agelevels"}],
    ageLevelDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
    achievementsDataSource: new ListView.DataSource({rowHasChanged: achievementEquals}),
    achievement: {},
    agelevel: {},
    fetch: {state: "COMPLETED"}
  },
  action) => {
    switch (action.type) {
    case "SET_ACHIEVEMENTS":
      return Object.assign({},
                           state,
                           {achievements: action.achievements,
                            ageLevelDataSource: state.ageLevelDataSource.cloneWithRows(action.achievements.agelevels.sort((a, b) => sortNumber(a.sort_no, b.sort_no)))});
    case "SELECT_AGELEVEL":
      const ageLevel = state.achievements.agelevels.find((a) => a.id === action.agelevel.id);
      return Object.assign({},
                           state,
                           {achievementsDataSource: state.achievementsDataSource.cloneWithRows(ageLevel.achievements.sort((a, b) => sortNumber(a.sort_no, b.sort_no))),
                            routeStack: state.routeStack.concat(action.route),
                            agelevel: ageLevel});
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
      return markAchievementDone(state, action.done);
    }
    return state;
  };
