import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Credits from "./components/files/Credit";
import Game from "./components/files/Game";
import App from "./App";

import history from "./history";

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/credits" component={Credits} />
          <Route path="/game" component={Game} />
        </Switch>
      </Router>
    );
  }
}
