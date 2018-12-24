import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actionCreators from './actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});


// function SelectVersion(props) {

class SelectVersion extends Component {
    constructor(props) {
        super(props);
        // this.state = {
            // value: ''
        // }
    }
    render() {

        const { classes } = this.props;
        const { actions, state } = this.props;
        const releases = state.serviceConfig ? state.serviceConfig.detail.Releases : [];
        // const value = this.state.value !== '' ? zthis.state.value : ; 
        return (
            <FormControl className={classes.formControl}>
                <InputLabel>Version</InputLabel>
                <Select
                    // value={ (this.state.value === '' && releases.length > 0) ? JSON.stringify(releases[0]) : this.state.value}
                    value = {JSON.stringify(state.selectedVersionInfo)}
                    onChange={e=>{
                        const versionInfoObj = JSON.parse(e.target.value);
                        // this.setState({ value: e.target.value});
                        console.log(versionInfoObj);
                        actions.selectVersion(versionInfoObj );
                    }}
                >
                    {
                    releases.map(
                        (releaseInfo, index) => {
                            const tagLowerCase = releaseInfo.Tag.toLowerCase();
                            let color = 'default';
                            if (['ir', 'internalrelease'].includes(tagLowerCase)) {
                                color = 'primary';
                            } else if (['prod', 'production'].includes(tagLowerCase)) {
                                color = 'secondary';
                            }
                            return (
                                <MenuItem
                                    value={JSON.stringify(releaseInfo)}
                                    key={index}
                                >
                                    {`${releaseInfo.Version}`}
                                    <Chip
                                        className={classes.chip}
                                        label={`${releaseInfo.Tag}`}
                                        color={color}
                                        style={{ height: '15px', fontSize: '10px', margin: '0 0 0 20px' }} />
                                </MenuItem>
                            )
                        }
                    )
                    }
                </Select>
            </FormControl>
        )
    }

}


SelectVersion.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(
    state => {
        return {
            state: {
                serviceConfig: state.serviceConfig,
                selectedVersionInfo: state.selectedVersionInfo,
            }
        };
    },
    dispatch => {
        return { actions: bindActionCreators(actionCreators, dispatch) };
    }
)(withStyles(styles)(withRouter(SelectVersion)));


// export default withStyles(styles)(SelectVersion);