export const calendar = (
  state = {data: {},
           error: null},
  action) => {
    switch (action.type) {
    case "SET_CALENDAR":
      return Object.assign({}, state, {data: action.data});
    case "SET_CALENDAR_ERROR":
      return Object.assign({}, state, {error: action.error});
    }
    return state;
  };