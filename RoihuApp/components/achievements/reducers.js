export const achievements = (
  state = { achievements: null,
            error: null},
  action) => {
    switch (action.type) {
    case "SET_ACHIEVEMENTS":
      return Object.assign({}, state, {achievements: action.achievements});
    case "SET_ACHIEVEMENTS_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
