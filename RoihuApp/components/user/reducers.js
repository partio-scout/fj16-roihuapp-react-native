export const user = (
  state = {data: {},
           error: null,
           image: null},
  action) => {
    switch (action.type) {
    case "SET_IMAGE":
      return Object.assign({}, state, {image: action.image});
    case "SET_USER":
      return Object.assign({}, state, {data: action.data});
    case "SET_USER_ERROR":
      return Object.assign({}, state, {error: action.error});;
    }
    return state;
  };
