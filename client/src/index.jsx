import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./components/App";
import RequireAuth from "./components/Auth/RequireAuth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import reducers from "./components/reducers";
import NewConfiguration from "./components/NewConfiguration";
import EditConfiguration from "./components/EditConfiguration";
import "./index.css";

const token = localStorage.getItem("accessToken") || "";

const initialState = {
  auth: { authenticated: token },
};

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route
              index
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="new-configuration"
              element={
                <RequireAuth>
                  <NewConfiguration />
                </RequireAuth>
              }
            />
            <Route
              path="configurations/:id"
              element={
                <RequireAuth>
                  <EditConfiguration />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
