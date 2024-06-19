import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../pages/Login";
import SubMenu from "../pages/SubMenu";
import EmployeeInfo from "../pages/EmployeeInfo";
import EmployeeSearch from "../pages/EmployeeSearch";
import SalesInfo from "../pages/SalesInfo";
import ManagementCompanyRegister from "../pages/ManagementCompanyRegister";
import SubMenuNew from "../pages/SubmenuNew";

export default function Router() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/submenu" component={SubMenu} />
      <Route exact path="/insert" component={EmployeeInfo} />
      <Route exact path="/employeeSearch" component={EmployeeSearch} />
      <Route exact path="/submenu/salesInfo" component={SalesInfo} />
      <Route exact path="/submenuNew" component={SubMenuNew} />
      <Route exact path="/managementCompanyRegister" component={ManagementCompanyRegister} />

    </Switch>
  );
}
