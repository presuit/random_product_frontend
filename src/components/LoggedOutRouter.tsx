import React from "react";
import { Switch, Route } from "react-router-dom";
import { LogIn } from "../pages/LogIn";
import { CreateAccount } from "../pages/CreateAccount";
import { NotFound } from "../pages/NotFound";

export const LoggedOutRouter = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <LogIn />
      </Route>
      <Route path="/create-account">
        <CreateAccount />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};
