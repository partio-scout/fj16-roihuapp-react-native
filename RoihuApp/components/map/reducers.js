export const map = (
  state = {markers: false},
  action) => {
    switch (action.type) {
    case "SET_MARKERS":
      return Object.assign({}, state, {markers: action.markers});
    }
    return state;
  };