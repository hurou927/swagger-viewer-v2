import * as actionTypes from '../utils/actionType';
import yaml from 'js-yaml';
import path from 'path';

export const loadAppConfig = (config) => {
    return {
        type: actionTypes.LOAD_CONFIG,
        appConfig: config,
    }
}

export const toggleLeftDrawer = (isOpenLeftDrawer) => {
    return{
        type: actionTypes.TOGGLE_LEFT_DRAWER,
        isOpenLeftDrawer : isOpenLeftDrawer,
    }
}


export const selectService = (config) => {
    return {
        type: actionTypes.SELECT_SERVICE,
        serviceConfig: config,
    }
}

export const selectVersion = (versionInfo) => {
    return {
        type: actionTypes.SELECT_VERSION,
        selectedVersionInfo: versionInfo,
    }
}

export const jumpHome = () => {
    return {
        type: actionTypes.JUMP_HOME,
    }
}

export const login = (loginUser) => {
    return {
        type: actionTypes.LOGIN,
        loginUser: loginUser
    }
}

export const logout = () => {
    return {
        type: actionTypes.LOGOUT,
    }
}

export const toggleUpdateTag = (isOpenUpdateTag) => {
    return{
        type: actionTypes.TOGGLE_UPDATE_TAG,
        isOpenUpdateTag: isOpenUpdateTag,
    }
}

export const fetchAppConfig = (path) => {
    return function (dispatch) {
        return fetch(path)
            .then(res => res.text())
            .then(body => {
                const config = yaml.safeLoad(body);
                dispatch(loadAppConfig(config));
            });
    }
}

export const fetchServiceConfig = (selectedServiceInfo) => {
    return function (dispatch) {
        console.log('fetchSC', selectedServiceInfo);
        const configPath = path.resolve(selectedServiceInfo.dir, 'config.yaml');
        return fetch(configPath)
            .then(res => res.text())
            .then(body => {
                const config = yaml.safeLoad(body);
                dispatch(selectService({
                    basic: selectedServiceInfo,
                    detail: config
                }));
            });
    }
}
