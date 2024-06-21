import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EmployeeSearch from '../../pages/EmployeeSearch';
import EmployeeInfo from '../../pages/EmployeeInfo';
import SalesInfo from '../../pages/SalesInfo'
import ManagementCompanyRegister from '../../pages/ManagementCompanyRegister'
import ManagementCompanySearch from '../../pages/ManagementCompanySearch'
import SalesInfoSearch from '../../pages/SalesInfoSearch';

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
        path={`${match.path}/employeeInsertNew`}
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
      <Route
        exact
        path={`${match.path}/salesInfoSearch`}
        component={SalesInfoSearch}
      />
    </Switch>
  );
};

export default Routes;
