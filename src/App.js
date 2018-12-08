import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions';

import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import SwaggerUI from './Swagger';
import Home from './Home'
import { BrowserRouter, Route, Link } from 'react-router-dom'


const appConfigURL = './config.yaml';

class App extends Component {

  constructor(props){
    super(props);

    props.actions.fetchAppConfig(appConfigURL);

  }


  render() {
    const { actions, state} = this.props;
    console.log(state);
    return (
      <div>
        <TopBar />
        <LeftDrawer />
        {/* { state.isOpenHome ? <Home /> : <SwaggerUI /> } */}
        <BrowserRouter>
          <div>
            <Route exact path='/' component={Home} />
            {
              !state.appConfig ? 'NotSerivce' : 
                state.appConfig.Services.map((v, index) => {
                  return (<Route path={`/${v.name}`} render={(props) => (<SwaggerUI service={v} />)} key={`${v.name}`}/>)
                })

            }
          </div>
        </BrowserRouter>
      </div>
    );
  }
}




export default connect(
  state => {
    return { state: { 
      appConfig: state.appConfig,
      // serviceConfig: state.serviceConfig,
      isOpenHome: state.isOpenHome,
    } };
  },
  dispatch => {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }
)(App);


// export default App;
