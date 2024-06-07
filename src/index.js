import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Polyfills
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";

// 
import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ja_JP";
import "moment/locale/ja";
import "./asserts/css/antdCssReset.css";
import "antd/dist/antd.css";

import "./asserts/css/index.css";
import "./asserts/css/tagClass.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
