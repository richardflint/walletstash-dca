import axios from "axios";
import {
  AUTH_ERROR,
  AUTH_USER,
  DELETE_CONFIGURATION,
  DELETE_CONFIGURATION_ERROR,
  GET_CONFIGURATIONS
} from "./types";

export const login = (formProps, callback) => async (dispatch) => {
  try {
    const response = await axios.post("/api/auth/login", formProps);
    localStorage.setItem("accessToken", response.data.access_token);
    dispatch({ type: AUTH_USER, payload: response.data.access_token });
    callback();
  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Incorrect username/password" });
  }
};

export const logout = (callback) => async (dispatch) => {
  localStorage.setItem("accessToken", "");
  dispatch({ type: AUTH_USER, payload: "" });
  callback();
};

export const getConfigurations = (token) => async (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get("/api/exchange-configurations", config);
  dispatch({ type: GET_CONFIGURATIONS, payload: response.data });
};

export const deleteConfiguration = (token, id) => async (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    await axios.delete(`/api/exchange-configurations/${id}`, config);
    dispatch({
      type: DELETE_CONFIGURATION,
      payload: id,
    });
  } catch (e) {
    dispatch({
      type: DELETE_CONFIGURATION_ERROR,
      payload: "Issue deleting DCA configuration",
    });
  }
};
