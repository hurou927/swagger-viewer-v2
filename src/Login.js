import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import * as actionCreators from './actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:34bf31a3-034f-4b7f-87b5-11ec928c96e4',
        region: 'ue-east-1',
        identityPoolRegion: 'us-east-1'
    }
});

const getEmailInfo = email => {
    return {
        name: email.substring(0, email.lastIndexOf("@")),
        domain: email.substring(email.lastIndexOf("@") + 1)
    }
}
const styles = theme => ({
});

class Login extends Component {
    constructor(props) {
        super(props);
        const { actions, state } = props;
        Auth.currentAuthenticatedUser()
            .then(user => {
                const emailInfo = getEmailInfo(user.email);
                console.log(emailInfo);
                if (emailInfo.domain === 'worksap.co.jp') {
                    console.log('Auth', user);
                    actions.login(user);
                }
            })
            .catch(err => console.log('NotLogin'));
        
        this.signInSuccess = this.signInSuccess.bind(this);
        this.signOutSuccess = this.signOutSuccess.bind(this);
    }
    signInSuccess(response) {
        const { actions, state } = this.props;
        console.log(window.gapi.auth2);
        console.log(new window.gapi.auth2.SigninOptionsBuilder());
        // // https://developers.google.com/identity/sign-in/web/reference#googleusergetid
        const googleUser = window.gapi.auth2.getAuthInstance().currentUser.get();
        const profile = googleUser.getBasicProfile();
        const { id_token, expires_at } = googleUser.getAuthResponse();
        const user = {
            email: profile.getEmail(),
            name: profile.getName()
        };
        const emailInfo = getEmailInfo(user.email);
        if (emailInfo.domain === 'worksap.co.jp') {
            Auth.federatedSignIn('google', { token: id_token, expires_at }, user)
                .then((credentials) => {
                    console.log(user, credentials);
                    actions.login(user);
                })
        } else {
            console.log('You must use works account');
        }

    }
    signOutSuccess() {
        const { actions, state } = this.props;
        Auth.signOut({ global: true })
            .then(data => console.log('signOutSuccess:', data))
            .catch(err => console.log('signOutError:', err));
        const GoogleAuth = window.gapi.auth2.getAuthInstance();

        GoogleAuth.signOut().then(() => {
            console.log(window.gapi.auth2.getAuthInstance().isSignedIn);
        })
        
        GoogleAuth.disconnect();
        actions.logout();
    }
    render() {
        // const { classes } = this.props;
        const { actions, state } = this.props;
        return (
            <div>
                {
                    !state.isLogin ?
                        <GoogleLogin
                            clientId="52834004980-3ik1kksh07j91i54cgp99brmkfdhr9pf.apps.googleusercontent.com"
                            prompt="select_account"
                            render={renderProps => (
                                <Button color="inherit" onClick={renderProps.onClick}>Login</Button>
                            )}
                            buttonText="Login"
                            onSuccess={res => { this.signInSuccess(res) }}
                            onFailure={(response) => { console.log('error:', response) }}
                        />

                        :
                        <GoogleLogout
                            buttonText="Logout"
                            onLogoutSuccess={this.signOutSuccess}
                            render={renderProps => (
                                <div style={{ 'textAlign': 'right' }}>
                                    <Button color="inherit" onClick={renderProps.onClick}>Logout</Button>
                                    <div>
                                        {state.loginUser.email}
                                    </div>
                                </div>
                            )}
                        />

                }
            </div>
        )
    }

}


Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(
    state => {
        return {
            state: {
                isLogin: state.isLogin,
                loginUser: state.loginUser,
            }
        };
    },
    dispatch => {
        return { 
            actions: bindActionCreators(actionCreators, dispatch)
        };
    }
)(withStyles(styles)(Login));


// export default withStyles(styles)(SelectVersion);