import axios from "axios";
import {
  AUTH_USER,
  AUTH_ERROR,
  GET_CONFIGURATIONS,
  SEARCH,
  NEW_CONFIGURATION,
  NEW_CONFIGURATION_ERROR,
  DELETE_CONFIGURATION,
  DELETE_CONFIGURATION_ERROR,
  GET_CONFIGURATION,
  GET_CONFIGURATION_ERROR,
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

export const getConfiguration = (token, id) => async (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(
      `/api/exchange-configurations/${id}`,
      config
    );
    dispatch({ type: GET_CONFIGURATION, payload: response.data });
  } catch (e) {
    dispatch({
      type: GET_CONFIGURATION_ERROR,
      payload: "Issue getting DCA configuration",
    });
  }
};

export const marketSearch = (token, formProps) => async (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  let performSearch = false;

  let params = "";

  if (formProps) {
    if (formProps.inputSymbol) {
      params = params.concat(`inputSymbol=${formProps.inputSymbol}`);
      performSearch = true;
    }

    if (formProps.outputSymbol) {
      params = params.concat(`&outputSymbol=${formProps.outputSymbol}`);
      performSearch = true;
    }

    if (formProps.tradingPair) {
      params = params.concat(`&marketSymbol=${formProps.tradingPair}`);
      performSearch = true;
    }
  }

  if (performSearch) {
    const response = await axios.get(`/api/search?${params}`, config);
    dispatch({ type: SEARCH, payload: response.data });
  }
};

export const createConfiguration =
  (token, formProps, callback) => async (dispatch) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.post(
        "/api/exchange-configurations",
        formProps,
        config
      );
      dispatch({
        type: NEW_CONFIGURATION,
        payload: response.data.access_token,
      });
      callback();
    } catch (e) {
      dispatch({
        type: NEW_CONFIGURATION_ERROR,
        payload: "Issue saving DCA configuration",
      });
    }
  };

export const updateConfiguration =
  (token, id, formProps, callback) => async (dispatch) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.put(
        `/api/exchange-configurations/${id}`,
        formProps,
        config
      );
      dispatch({
        type: NEW_CONFIGURATION,
        payload: response.data.access_token,
      });
      callback();
    } catch (e) {
      dispatch({
        type: NEW_CONFIGURATION_ERROR,
        payload: "Issue saving DCA configuration",
      });
    }
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
