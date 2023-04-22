import { GET_CONFIGURATIONS, DELETE_CONFIGURATION } from "../../actions/types";

const INITIAL_STATE = {
  existing: [],
  errorMessage: "",
};

const configurationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CONFIGURATIONS:
      return { ...state, existing: action.payload, errorMessage: "" };
    case DELETE_CONFIGURATION:
      return { ...state, existing: state.existing.filter(item => item.id !== action.payload), errorMessage: "" };
    default:
      return state;
  }
};

export default configurationReducer;
