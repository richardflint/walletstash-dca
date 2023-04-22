import { GET_CONFIGURATION } from "../../actions/types";

const INITIAL_STATE = {
  configuration: {},
  errorMessage: "",
};

const configurationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CONFIGURATION:
      return { ...state, configuration: action.payload, errorMessage: "" };
    default:
      return state;
  }
};

export default configurationReducer;

