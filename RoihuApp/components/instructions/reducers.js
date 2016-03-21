export const instructions = (
  state = {instructions: [],
           error: null},
  action) => {
    switch (action.type) {
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions});
    case "SET_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
