const initialView = {view: "map"};

export const currentView = (
  state = initialView,
  action) => {
    switch (action.type) {
    case "SET_VIEW":
      return {
          ...state,
        view: action.view};
    }
    return state;
  };
