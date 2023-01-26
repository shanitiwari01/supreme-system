import React, { Component } from 'react';
import Router from './Router';
import { withRouter } from 'react-router-dom';
import LoaderWC from './Common/LoaderWC';
import AlertWC from './Common/AlertWC'
import RouteChangedWC from './Common/RouteChangedWC';
import { connect } from 'react-redux';

global.logoutMessage = "";
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <RouteChangedWC />
        <LoaderWC />
        <AlertWC />
        <div onClick={this.checkClickEvent} className={`app-whole-wrapper`}>
          <Router />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
