import {
 DeviceEventEmitter,
 Alert,
 AsyncStorage,
} from 'react-native';

import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

import LinkedInLogin from './linkedin-login';
import ErrorMeta from './ErrorMeta';
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

  // Register info data to use LinkedIn SDK
  initLinkedIn() {
    LinkedInLogin.init(
      LoginMeta.redirectUrl,
      LoginMeta.clientId,
      LoginMeta.clientSecret,
      LoginMeta.state,
      LoginMeta.scopes);
  }

  // Register listeners to use LinkedIn SDK Login, LoginError
  initEvent() {
    DeviceEventEmitter.addListener(
      'linkedinLogin',
      this.onLoginSuccessLI
    );

    DeviceEventEmitter.addListener(
      'linkedinLoginError',
      this.onLoginErrorLI
    );
  }

  //Error codes
  onError(errCode) {
    let result = { code: errCode };
    if (errCode === ErrorMeta.ERR_NONE) {
      result.msg = '';
    } else if (errCode === ErrorMeta.ERR_FB_LOGIN) {
      result.msg = 'Login error from Linkedin';
    } else if (errCode === ErrorMeta.ERR_LI_LOGIN) {
      result.msg = 'Login error from Facebook';
    } else if (errCode === ErrorMeta.ERR_TOKEN_INVALID) {
      result.msg = 'Your token has been expired.';
    } else if (errCode === ErrorMeta.ERR_NO_USER_DATA) {
      result.msg = 'Cannot fetch user data';
    } else if (errCode === ErrorMeta.ERR_APP_FAIL) {
      result.msg = 'Error has occured from web';
    } else if (errCode === ErrorMeta.ERR_SERVER_FAIL) {
      result.msg = 'Server error. Try again';
    }

    this.errorCallback(result);
  }

  // Sign In with Facebook.
  signInWithFacebook() {
    LoginManager.logInWithReadPermissions(
      ['public_profile', 'email', 'user_education_history', 'user_work_history'])
    .then(
      loginUtil.onLoginSuccessFB,
      loginUtil.onLoginErrorFB
    );
  }

  onLoginSuccessFB(result) {
    console.log(result);
    if (result.isCancelled) {
      loginUtil.onError(ErrorMeta.ERR_FB_LOGIN);
    } else {
      AccessToken.getCurrentAccessToken()
      .then((data) => {
        AsyncStorage.setItem('loginType', LoginMeta.LOGIN_TYPE_FB);
        loginUtil.fetchData(LoginMeta.LOGIN_TYPE_FB, data.accessToken.toString());
      })
      .catch((error) => {
        loginUtil.onError(ErrorMeta.ERR_APP_FAIL);
      });
    }
  }

  onLoginErrorFB(error) {
    console.log(error);
    loginUtil.onError(ErrorMeta.ERR_FB_LOGIN);
  }

  //Sign In with LinkedIn.
  signInWithLinkedIn() {
    LinkedInLogin.login();
  }

  onLoginSuccessLI(result) {
    AsyncStorage.setItem('loginType', LoginMeta.LOGIN_TYPE_LI);
    loginUtil.fetchData(LoginMeta.LOGIN_TYPE_LI, result.accessToken);
  }

  onLoginErrorLI(error) {
    loginUtil.onError(ErrorMeta.ERR_LI_LOGIN);
  }

  fetchData(type, token) {
    let formBody = this.makeFormBody(type, token);
    AsyncStorage.setItem('token', token);

    fetch(UrlMeta.host + UrlMeta.API_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((result) => {
        this.successCallback(result);
      }).catch((error) => {
      this.onError(ErrorMeta.ERR_SERVER_FAIL);
    });
  }

  makeFormBody(type, token) {
    let formBody = 'platform_type=' + type;
    formBody += '&access_token=' + token;
    return formBody;
  }
}

const loginUtil = new LoginUtil();

module.exports = loginUtil;
