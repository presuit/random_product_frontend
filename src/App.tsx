import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedIn } from "./apollo";
import { LoggedInRouter } from "./components/LoggedInRouter";
import { LoggedOutRouter } from "./components/LoggedOutRouter";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const isLoggedInVar = useReactiveVar<boolean>(isLoggedIn);
  return (
    <Router>{isLoggedInVar ? <LoggedInRouter /> : <LoggedOutRouter />}</Router>
  );
}

export default App;
