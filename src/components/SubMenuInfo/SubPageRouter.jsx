import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EmployeeSearch from '../../pages/EmployeeSearch'
import EmployeeInsertNew from '../../pages/EmployeeInsertNew';

const Routes = ({ match }) => {
  console.log(match);
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/`}
        component={EmployeeSearch}
      />
      <Route
        exact
        path={`${match.url}/employeeInsertNew`}
        component={EmployeeInsertNew}
      />
    </Switch>
  );
};

export default Routes;
