export const credentials = (
  state = null,
  action) => {
    switch (action.type) {
    case "SET_CREDENTIALS":
      return Object.assign({}, state, action.credentials);
    case "REMOVE_CREDENTIALS":
      return null;
    }
    return state;
  };
