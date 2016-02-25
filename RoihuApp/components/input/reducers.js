export const text = (
  state = "",
  action) => {
    switch(action.type) {
    case "SET_TEXT":
      return action.text;
    }
    return state;
  };
