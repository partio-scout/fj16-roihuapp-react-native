export const token = (
  state = "",
  action) => {
    switch (action.type) {
        case "SET_TOKEN":
      return action.token;
        }
    return state;
  };
