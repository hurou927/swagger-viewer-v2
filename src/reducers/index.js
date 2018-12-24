import * as actionTypes from '../utils/actionType';
import compareVersions from 'compare-versions';

const initialAppState = {
    appConfig: undefined,
    serviceConfig: undefined,
    isOpenLeftDrawer: false,
    selectedVersionInfo: undefined,
    isOpenHome: true,
    isLogin: false,
    loginUser : undefined,
    isOpenUpdateTag: false,
}

const reducer = (state=initialAppState, action) => {
    console.log('reducer', state, action);
    if(action.type === actionTypes.LOAD_CONFIG) {
        action.appConfig.Services = action.appConfig.Services.sort((a, b) => a.name > b.name)
        return {
            ...state,
            appConfig: action.appConfig
        }
    } else if (action.type === actionTypes.TOGGLE_LEFT_DRAWER){
        return {
            ...state,
            isOpenLeftDrawer: action.isOpenLeftDrawer
        }
    }else if (action.type === actionTypes.SELECT_SERVICE){
        action.serviceConfig.detail.Releases = (action.serviceConfig.detail.Releases || []).sort((a, b) => compareVersions(b.Version, a.Version));
        let defaultSelectVersion = action.serviceConfig.detail.Releases[0];
        if (action.defaultVersion) {
            for (let i = 0; i < action.serviceConfig.detail.Releases.length; i=i+1){
                if (action.serviceConfig.detail.Releases[i].Version === action.defaultVersion ) {
                    defaultSelectVersion = action.serviceConfig.detail.Releases[i];
                    break;
                }
            }
        }
        return {
            ...state,
            serviceConfig: action.serviceConfig,
            isOpenLeftDrawer: false,
            selectedVersionInfo: defaultSelectVersion,//action.serviceConfig.detail.Releases[0],
            isOpenHome: false
        }
    }else if (action.type === actionTypes.SELECT_VERSION) {
        return {
            ...state,
            selectedVersionInfo: action.selectedVersionInfo,
        }
    } else if (action.type === actionTypes.JUMP_HOME) {
        return {
            ...state,
            isOpenHome: true,
        }
    } else if (action.type === actionTypes.LOGIN) {
        return {
            ...state,
            isLogin: true,
            loginUser: action.loginUser
        }
    } else if (action.type === actionTypes.LOGOUT) {
        return {
            ...state,
            isLogin: false,
            loginUser: undefined,
        }
    } else if (action.type === actionTypes.TOGGLE_UPDATE_TAG){
        return{
            ...state,
            isOpenUpdateTag: action.isOpenUpdateTag
        }
    }else{
        return state;
    }
}

export default reducer;
