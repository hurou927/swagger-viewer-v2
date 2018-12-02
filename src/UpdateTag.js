import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import yaml from 'js-yaml';
import Modal from '@material-ui/core/Modal'
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import path from 'path';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        

    }
});

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
class UpdateTag extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonDisabled: true,
        }
    }
    //yaml.safeDump(updatedServiceInfo)
    updateTagS3 (path, body)  {
        Auth.currentCredentials()
            .then(credentials => {
                const s3 = new AWS.S3({ 
                    apiVersion: '2006-03-01', 
                    credentials: Auth.essentialCredentials(credentials)
                })
                const params = {
                    Bucket: 'hue-swagger-viewer-test',
                    Key: path,
                    Body: body,
                };
                            //corng: https://stackoverflow.com/questions/28568794/amazon-s3-javascript-no-access-control-allow-origin-header-is-present-on-the
                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    } else {
                        console.log(data);
                    }
                })
            })
    }

    render(){
        const { classes } = this.props;
        const { actions, state } = this.props;
        const updatedServiceInfo = state.serviceConfig.detail;
        const serviceConfigBasic = state.serviceConfig.basic;
        const serviceConfigDetail = state.serviceConfig.detail;
        return(
            <div>
                <Button 
                    variant="contained"
                    onClick={ e=>{actions.toggleUpdateTag(true)} }
                    style={{margin:"40px 0 0 40px"}}
                    color="primary"
                >Edit Tag</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={state.isOpenUpdateTag}
                    onClose={()=>{actions.toggleUpdateTag(false)}}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Grid container spacing={24}>
                            <Grid item xs={4}> Vergion </Grid>
                            <Grid item xs={4}> Tag(Environment) </Grid>
                            <Grid item xs={4}> Path
                        </Grid>
                        </Grid>
                        <hr />
                        {
                            serviceConfigDetail.Releases.map((r, index) => {
                                return (
                                    <Grid container spacing={24}>
                                        <Grid item xs={4}>
                                            {r.Version}
                                        </Grid>
                                        <Grid item xs={4}>
                                            {
                                                <TextField
                                                    defaultValue={r.Tag}
                                                    onChange={e => {
                                                        updatedServiceInfo.Releases[index].Tag = e.target.value;
                                                        this.setState({ buttonDisabled: false });
                                                    }}
                                                />
                                            }
                                        </Grid>
                                        <Grid item xs={4}>{r.Path}</Grid>
                                    </Grid>
                                );
                            })
                        }
                        <Grid container justify="center">
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                style={{ margin: '24px' }}
                                disabled={this.state.buttonDisabled}

                                onClick={e => {
                                    console.log(yaml.safeDump(updatedServiceInfo));

                                    const s3ConfigFilePath = path.normalize(path.resolve(serviceConfigBasic.dir, 'config.yaml'));
                                    this.updateTagS3(s3ConfigFilePath, yaml.safeDump(updatedServiceInfo));
                                }}
                            >
                                Update
                            </Button>
                        </Grid>

                    </div>
                </Modal>


                {/* <AlertDialog /> */}

            </div>
        );
    }
}
export default connect(
    state => {
        return {
            state: {
                selectedVersionInfo: state.selectedVersionInfo,
                serviceConfig: state.serviceConfig,
                isOpenUpdateTag: state.isOpenUpdateTag,
            }
        };
    },
    dispatch => {
        return { actions: bindActionCreators(actionCreators, dispatch) };
    }
)(withStyles(styles)(UpdateTag));

// export default withStyles(styles)(UpdateTag );