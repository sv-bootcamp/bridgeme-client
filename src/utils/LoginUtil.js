import {
 AsyncStorage,
} from 'react-native';
import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import ErrorMeta from './ErrorMeta';
import ErrorUtil from './ErrorUtil';
import UrlMeta from './UrlMeta';
import LoginMeta from './LoginMeta';

class LoginUtil {
  constructor() {
    this.successCallback = null;
    this.errorCallback = null;
  }

  // Initialize callback to get result
  initCallback(success, error) {
    this.successCallback = success;
    this.errorCallback = error;
  }

  // Check token
  hasToken() {
    AsyncStorage.getItem('token', (err, result) => {
      if (result === null) {
        this.onError(ErrorMeta.ERR_NONE);
      } else {
        this.successCallback(result);
      }
    });
  }

  //Error codes
  onError(errCode) {
    let result = ErrorUtil.getErrorMsg(errCode);
    loginUtil.errorCallback(result);
  }

  // Sign In with Facebook.
  signInWithFacebook() {
    LoginManager.logInWithReadPermissions(
      ['public_profile', 'email', 'user_education_history', 'user_work_history', 'user_location',
    ])
    .then(
      loginUtil.onLoginSuccessFB,
      loginUtil.onLoginErrorFB
    );
  }

  // Login success from facebook
  onLoginSuccessFB(result) {
    if (result.isCancelled) {
      loginUtil.onError(ErrorMeta.ERR_FB_LOGIN);
    } else {
      AccessToken.getCurrentAccessToken()
      .then((data) => {
        loginUtil.fetchData(LoginMeta.LOGIN_TYPE_FB, data.accessToken.toString());
      })
      .catch((error) => {
        loginUtil.onError(ErrorMeta.ERR_APP_FAIL);
      });
    }
  }

  onLoginErrorFB(error) {
    loginUtil.onError(ErrorMeta.ERR_FB_LOGIN);
  }

  fetchData(type, token) {
    AsyncStorage.multiSet(
    [['token', token], ['loginType', type]],
      () => {
        let reqSet = loginUtil.getReqSet(type, token);
        fetch(UrlMeta.host + UrlMeta.API_LOGIN, reqSet)
        .then(loginUtil.getResponse)
        .then(loginUtil.getSuccessResponse)
        .catch(loginUtil.getException);
      }
    );
  }

  makeFormBody(type, token) {
    let formBody = 'platform_type=' + type;
    formBody += '&access_token=' + token;
    return formBody;
  }

  getReqSet(type, token) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: loginUtil.makeFormBody(type, token),
    };
  }

  getResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  }

  getSuccessResponse(result) {
    loginUtil.successCallback(result);
  }

  getException(error) {
    loginUtil.onError(ErrorMeta.ERR_SERVER_FAIL);
  }
}

const loginUtil = new LoginUtil();
module.exports = loginUtil;
