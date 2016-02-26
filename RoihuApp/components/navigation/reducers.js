const initialView = "map";

export const view = (
  state = initialView,
  action) => {
    switch (action.type) {
    case "SET_VIEW":
      return action.view;
    }
    return state;
  };
