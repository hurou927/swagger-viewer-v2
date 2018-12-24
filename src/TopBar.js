
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from './actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Login from './Login'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


function TopBar(props) {
  const { classes } = props;
  const { actions, state } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="Menu" 
            onClick={(e) => {  props.actions.toggleLeftDrawer(true) }}>
            <MenuIcon />
          </IconButton>
          <img
            src="./huwager_icon.svg"
            width="32" height="32"
            alt=""
            style={{ padding: "0 10px 0 0" }}
            onClick={e => { props.history.push('/') }}
          />
          <Typography variant="h6" color="inherit" className={classes.grow}>
            HUWagger
          </Typography>
          <Login />
        </Toolbar>
      </AppBar>
    </div>
  );
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(
  null,
  dispatch => {
    return { actions: bindActionCreators(actionCreators, dispatch) };
  }
// )(withStyles(styles)(TopBar));
)(withStyles(styles)(withRouter(TopBar)));


// export default withStyles(styles)(ButtonAppBar);