import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "../pages/Login";
import SubMenu from "../pages/SubMenu";

import EmployeeInfo from "../pages/EmployeeInfo";
import EmployeeSearch from "../pages/EmployeeSearch";
import SalesInfo from "../pages/SalesInfo";
import SalesInfoSearch from "../pages/SalesInfoSearch";
import ManagementCompanyRegister from "../pages/ManagementCompanyRegister";
import ManagementCompanySearch from "../pages/ManagementCompanySearch";
import CustomerRegister from "../pages/CustomerRegister"

import SubMenuNew from "../pages/SubmenuNew";

export default function Router() {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/submenu" component={SubMenu} />
      <Route path="/submenuNew" component={SubMenuNew} />
      {/* 開発用 */}
      <Route exact path="/employeeInfo" component={EmployeeInfo} />
      <Route exact path="/employeeSearch" component={EmployeeSearch} />
      <Route exact path="/salesInfo" component={SalesInfo} />
      <Route exact path="/salesInfoSearch" component={SalesInfoSearch} />
      <Route exact path="/managementCompanyRegister" component={ManagementCompanyRegister} />
      <Route exact path="/managementCompanySearch" component={ManagementCompanySearch} />
      <Route exact path="/customerRegister" component={CustomerRegister} />
      
      <Route exact path="/submenuNew" component={SubMenuNew} />
    </Switch>
  );
}
