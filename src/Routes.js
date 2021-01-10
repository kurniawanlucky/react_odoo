import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Partner from "./partner/partner";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/Partner" component={Partner} />
                </Switch>
            </Router>
        )
    }
}