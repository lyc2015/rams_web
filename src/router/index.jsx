import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../pages/Login";
import SubMenu from "../pages/SubMenu";
import EmployeeInsertNew from "../pages/EmployeeInsertNew";
import EmployeeSearch from "../pages/EmployeeSearch";

export default function Router() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/submenu" component={SubMenu} />
      <Route exact path="/insert" component={EmployeeInsertNew} />
      <Route exact path="/subMenuManager/employeeSearch" component={EmployeeSearch} />
    </Switch>
  );
}
