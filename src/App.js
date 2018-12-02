import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions';

import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import SwaggerUI from './Swagger';
import Home from './Home'



const appConfigURL = './config.yaml';

class App extends Component {

  constructor(props){
    super(props);

    props.actions.fetchAppConfig(appConfigURL);

  }


  render() {
    const { actions, state} = this.props;
    return (
      <div>
        <TopBar />
        <LeftDrawer />
        { state.isOpenHome ? <Home /> : <SwaggerUI /> }
      </div>
    );
  }
}

export default connect(
  state => {
    return { state: { 
      // appConfig: state.appConfig,
      // serviceConfig: state.serviceConfig,
      isOpenHome: state.isOpenHome,
    } };
  },
  dispatch => {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }
)(App);


// export default App;
