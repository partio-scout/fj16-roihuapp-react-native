export const info = (
  state = {data: {},
           error: null},
  action) => {
    switch (action.type) {
    case "SET_INFO":
      return Object.assign({}, state, {data: action.data});
    case "SET_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
