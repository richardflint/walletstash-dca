import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const App = () => {
  return (
    <>
      <div className="min-h-full">
        <NavBar />
        <Outlet />
      </div>
    </>
  );
};

export default App;
