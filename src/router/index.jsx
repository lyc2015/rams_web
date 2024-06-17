import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../pages/Login";
import SubMenu from "../pages/SubMenu";
import EmployeeInsert from "../pages/EmployeeInsert";
import EmployeeSearch from "../pages/EmployeeSearch";
import SalesInfo from "../pages/SalesInfo";
import ManagementCompanyRegister from "../pages/ManagementCompanyRegister";

export default function Router() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/submenu" component={SubMenu} />
      <Route exact path="/insert" component={EmployeeInsert} />
      <Route exact path="/subMenuManager/employeeSearch" component={EmployeeSearch} />
      <Route exact path="/salesInfo" component={SalesInfo} />
      <Route exact path="/managementCompanyRegister" component={ManagementCompanyRegister} />

    </Switch>
  );
}
