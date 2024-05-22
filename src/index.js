import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./components/redux/store";

import * as serviceWorker from "./serviceWorker";
import App from "./App";

import "./asserts/css/index.css";
import "antd/dist/antd.css";

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
