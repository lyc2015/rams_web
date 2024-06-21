import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EmployeeSearch from '../../pages/EmployeeSearch';
import EmployeeInfo from '../../pages/EmployeeInfo';
import SalesInfo from '../../pages/SalesInfo'
import ManagementCompanyRegister from '../../pages/ManagementCompanyRegister'
import ManagementCompanySearch from '../../pages/ManagementCompanySearch'

const Routes = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/`}
        component={EmployeeInfo}
      />
      <Route
        exact
        path={`${match.path}/employeeInfo`}
        component={EmployeeInfo}
      />
      <Route
        exact
        path={`${match.path}/employeeSearch`}
        component={EmployeeSearch}
      />
      <Route
        exact
        path={`${match.path}/salesInfo`}
        component={SalesInfo}
      />
      <Route
        exact
        path={`${match.path}/managementCompanyRegister`}
        component={ManagementCompanyRegister}
      />
      <Route
        exact
        path={`${match.path}/managementCompanySearch`}
        component={ManagementCompanySearch}
      />
      <Route path="/submenu/employeeInfo" component={EmployeeInfo} />
      <Route path="/submenu/employeeSearch" component={EmployeeSearch} />
      <Route path="/submenu/salesInfo" component={SalesInfo} />
    </Switch>
  );
};

export default Routes;
