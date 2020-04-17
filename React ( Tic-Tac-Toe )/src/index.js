import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import "./index.css";
// import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
// import { Provider } from "react-redux";
// import configureStore from "./store";
import Routes from './Routes';

ReactDOM.render(
  // <Provider store={configureStore()}>
  //   <App />
  // </Provider>,
  <Router>
    <div className="App">

      <Routes />
    </div>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
