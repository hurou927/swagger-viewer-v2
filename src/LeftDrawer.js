import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';

import TextField from '@material-ui/core/TextField';


const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};


class LeftDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }


  render(){
    const { classes } = this.props;
    const { actions, state } = this.props;
    const serviceList = state.appConfig ? state.appConfig.Services.filter(s => s.name.includes(this.state.searchValue)) : [];
  

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem>
            <TextField
              id="standard-search"
              label="Search field"
              type="search"
              className={classes.textField}
              margin="normal"
              value={this.state.searchValue}
              onChange={e => {
                this.setState({ searchValue: e.target.value, })
              }}
            />
          </ListItem>
          {serviceList.map((service, index) => (
            <ListItem
              button key={service.name}
              onClick={e => {
                // this.props.onSelect(service);
                actions.fetchServiceConfig( service )
                // actions.toggleLeftDrawer(false)
              }}
            >
              <ListItemText primary={service.name} />
              {/* <Chip label={`${service.latestVersion}`} className={classes.chip} style={{ fontSize: '10px' }} /> */}
            </ListItem>
          ))}
        </List>
      </div>
    );


    return (
      <div>
        <Drawer open={state.isOpenLeftDrawer} onClose={(e) => { actions.toggleLeftDrawer(false)}}>
          <div
            tabIndex={0}
            role="button"
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

LeftDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default connect(
  state => {
    return {
      state: {
        appConfig: state.appConfig,
        isOpenLeftDrawer: state.isOpenLeftDrawer,
      }
    };
  },
  dispatch => {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }
)(withStyles(styles)(LeftDrawer));