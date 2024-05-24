import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Login from "./components/Login";
import SubMenu from "./components/SubMenu";
import EmployeeInsertNew from "./components/EmployeeInsertNew";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/submenu" component={SubMenu} />
          <Route exact path="/insert" component={EmployeeInsertNew} />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
export default App;
