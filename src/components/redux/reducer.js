import defaultState from "./state";

export default (state = defaultState, action) => {
  if (!state) {
    return {
      count: 0,
    };
  }
  switch (action.type) {
    case "UPDATE_INIT_EMPLOYEE":
      return {
        ...state,
        initEmployee: action.data
      };
    default:
      return state;
  }
};
