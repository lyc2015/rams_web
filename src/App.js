import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./components/mainIn";
import PasswordReset from "./components/passwordReset";
import ErrorPage from "./components/errorPage";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <ErrorPage>
            <Main />
            <Route exact path="/passwordReset" component={PasswordReset} />
          </ErrorPage>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
export default App;
