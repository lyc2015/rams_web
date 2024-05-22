import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import LoginManager from "./components/loginManager";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Route exact path="/" component={LoginManager} />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
export default App;
