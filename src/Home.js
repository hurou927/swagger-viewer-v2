import React, { Component } from 'react';


import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        width: '100%',
        maxWidth: 500,
    },
};
class Home extends Component {

    render(){
        const { classes } = this.props;
        return (
            <div style={{ margin: '50px' }} className={classes.root}>
                <Typography variant="h4" gutterBottom>
                    HUE Swagger Viewer 
                </Typography>
                    <ul>
                        <Typography variant="body1" gutterBottom>
                        <li>Update config.yaml when adding new service or deleting exsisting service</li>
                        <li>Update swagger/[service]/config.yaml when updateing swagger file</li>
                        </Typography>
                    </ul>
            </div>
        )
    }
}

export default withStyles(styles)(Home);