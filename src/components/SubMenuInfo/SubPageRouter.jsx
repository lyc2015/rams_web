import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EmployeeSearch from '../../pages/EmployeeSearch';
import EmployeeInsertNew from '../../pages/EmployeeInsertNew';
import SalesInfo from '../../pages/SalesInfo'
import ManagementCompanyRegister from '../../pages/ManagementCompanyRegister'

import SalesInfo from '../../pages/SalesInfo';
const Routes = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/`}
        component={EmployeeInsertNew}
      />
      <Route
        exact
        path={`${match.path}/employeeInsertNew`}
        component={EmployeeInsertNew}
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
    </Switch>
  );
};

export default Routes;
