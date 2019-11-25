import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Context Provider
import { UserContextProvider } from "./context/auth.context";
import { TodoContextProvider } from "./context/todos.context";

ReactDOM.render(
  <UserContextProvider>
    <TodoContextProvider>
      <App />
    </TodoContextProvider>
  </UserContextProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
