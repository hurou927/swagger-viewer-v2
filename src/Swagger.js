import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actions';
import path from 'path';
import SwaggerUi, {presets} from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

import { withStyles } from '@material-ui/core/styles';

import SelectVersion from './SelectVersion';
import UpdateTag from './UpdateTag';

const styles = theme => ({
});




class SwaggerUI extends Component {

    constructor(props){
        super(props);

        const { actions, state } = this.props;
        actions.fetchServiceConfig(props.service);
    }


    componentDidMount() {
        this.displaySwagger(); 
    }

    componentDidUpdate() {
        this.displaySwagger();
    }

    shouldComponentUpdate(nextProps, nextState) {;
        const { state: currentPropsState} = this.props;
        const { state: nextPropsState} = nextProps;
        
        if(currentPropsState.serviceConfig === undefined || nextPropsState.serviceConfig === undefined) {
            return true;
        }
        if (currentPropsState.selectedVersionInfo === nextPropsState.selectedVersionInfo
        && currentPropsState.serviceConfig.basic.name === nextPropsState.serviceConfig.basic.name){
            return false;
        }
        return true;
    }

    displaySwagger(){
        let swaggerURL = './swagger/auth/swagger0_0_1.yaml';
        const { actions, state } = this.props;

        if (state.serviceConfig) {
            const dirname = state.serviceConfig.basic.dir;
            swaggerURL = path.resolve(dirname, state.selectedVersionInfo.Path);
        }

        SwaggerUi({
            dom_id: '#swaggerContainer',
            url: swaggerURL,
            spec: this.props.spec,
            presets: [presets.apis]
        });
    }

 
    render() {
        const { actions, state } = this.props;

        if ( !state.serviceConfig ) {
            return (<div id="swaggerContainer" >Can Not Read Swagger</div>)
        }
        return (
            <div>
                
                
                <UpdateTag/>

                
                <div style={{ margin: "40px 0 0 40px" }}><SelectVersion /></div>
                <div id="swaggerContainer" />
            </div>
        );
    }
}

SwaggerUI.propTypes = {
    url: PropTypes.string,
    spec: PropTypes.object
};

export default connect(
    state => {
        return {
            state: {
                // appConfig: state.appConfig,
                selectedVersionInfo: state.selectedVersionInfo,
                serviceConfig: state.serviceConfig,
            }
        };
    },
    dispatch => {
        return { actions: bindActionCreators(actionCreators, dispatch) };
    }
)(withStyles(styles)(SwaggerUI));

// SwaggerUI.defaultProps = {
//     url: `http://petstore.swagger.io/v2/swagger.json`
// };

// export default withStyles(styles)(SwaggerUI);