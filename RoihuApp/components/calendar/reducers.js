export const calendar = (
  state = {routeStack: [{name: "root"}],
           calendar: null,
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
    case "SET_CALENDAR":
      return Object.assign({}, state, {calendar: action.calendar});
    case "SET_CALENDAR_ERROR":
      return Object.assign({}, state, {error: action.error});
    }
    return state;
  };