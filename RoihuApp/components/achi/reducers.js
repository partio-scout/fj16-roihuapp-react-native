export const achievements = (
  state = { achievements: null},
  action) => {
    switch (action.type) {
    case "SET_ACHIEVEMENTS":
      return Object.assign({}, state, {achievements: action.achievements});
    case "SET_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
