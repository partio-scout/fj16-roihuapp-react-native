export const settings = (
  state = {routeStack: [{name: "user-root"}]},
  action) => {
    switch (action.type) {
    case "PUSH_SETTINGS_ROUTE":
      return Object.assign({}, state, {routeStack: state.routeStack.concat(action.route)});
    case "POP_SETTINGS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    case "RESET_SETTINGS_ROUTES":
      return Object.assign({}, state, {routeStack: [action.route]});
    }
    return state;
  };
