import defaultState from "./state";
import { updateDropDown, fetchDropDown } from "./dropDown";
import { fetchGetAllEmployee } from "./allEmployee";

export default (state = defaultState, action) => {
  if (!state) {
    return {
      count: 0,
    };
  }

  switch (action.type) {
    case "UPDATE_ALL_EMPLOYEE":
      let es = fetchGetAllEmployee(state);
      console.log("es", es);
      return {
        ...state,
        allEmployee: es,
      };
    // dropNameは更新の部分
    case "UPDATE_STATE":
      return {
        ...state,
        ...updateDropDown(state, action.dropName),
      };
    case "FETCH_STATE":
      let dropDown = fetchDropDown(state);
      return {
        ...state,
        dropDown: dropDown,
      };
    default:
      return state;
  }
};
