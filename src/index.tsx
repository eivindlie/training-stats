import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  handle_callback,
  isSignedIn,
  REDIRECT_PATH,
  signIn,
} from "./utils/auth";

if (window.location.pathname.startsWith(REDIRECT_PATH)) {
  handle_callback();
} else if (!isSignedIn()) {
  signIn();
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
