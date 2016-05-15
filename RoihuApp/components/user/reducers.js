export const user = (
  state = {data: {},
           error: null,
           image: null,
           routeStack: [{name: "root"}]},
  action) => {
    switch (action.type) {
    case "SET_IMAGE":
      return Object.assign({}, state, {image: action.image});
    case "SET_USER":
      return Object.assign({}, state, {data: action.data});
    case "SET_USER_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "PUSH_USER_ROUTE":
      return Object.assign({}, state, {routeStack: state.routeStack.concat(action.route)});
    case "POP_USER_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    }
    return state;
  };
