import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import * as actions from "../../actions";

const RequireAuth = ({ children, auth, logout }) => {
  let location = useLocation();

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (auth.authenticated) {
      const decodedJwt = parseJwt(auth.authenticated);

      if (decodedJwt.exp * 1000 < Date.now()) {
        logout(() => {});
      }
    }
  }, []);

  if (!auth.authenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    const decodedJwt = parseJwt(auth.authenticated);

    if (decodedJwt.exp * 1000 < Date.now()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

function mapStateToProps(state) {
  return { auth: { authenticated: state.auth.authenticated } };
}

export default connect(mapStateToProps, actions)(RequireAuth);
