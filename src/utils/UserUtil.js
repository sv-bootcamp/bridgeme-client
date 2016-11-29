import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import {
  LoginMeta,
  ErrorMeta,
} from './ApiMeta';
import apiUtil from './ApiUtil';
import FCM from 'react-native-fcm';

class UserUtil {

  // Sign In with Facebook.
  signInWithFacebook(callback) {
    LoginManager.logInWithReadPermissions(
      ['public_profile', 'email', 'user_education_history', 'user_work_history'])
      .then(
        function (result) {
          if (result.isCancelled) {
            alert(ErrorMeta.ERR_FB_LOGIN_CANCELLED);
          } else {
            FCM.getFCMToken().then((token) => {
              AccessToken.getCurrentAccessToken()
                .then((data) => {
                  console.log(token);
                  const body = {};
                  body.platform_type = LoginMeta.LOGIN_TYPE_FB;
                  body.access_token = data.accessToken.toString();
                  body.deviceToken = token;
                  apiUtil.requestPost(callback, 'API_LOGIN', body);
                })
                .catch((error) => {
                  alert(ErrorMeta.ERR_FB_LOGIN);
                });
            });
          }
        },

        function (error) {
          alert('Login fail with error: ' + error);
        }
    );
  }

  localSignIn(callback, email, password) {
    FCM.getFCMToken().then(token => {
      const body = {};
      body.email = email;
      body.password = password;
      body.deviceToken = token;
      apiUtil.requestPost(callback, 'API_LOCAL_SIGNIN', body);
    });
  }

  localSignUp(callback, email, password) {
    FCM.getFCMToken().then(token => {
      const body = {};
      body.email = email;
      body.password = password;
      body.deviceToken = token;
      apiUtil.requestPost(callback, 'API_LOCAL_SIGNUP', body);
    });
  }

  // Get user lists except me
  tokenCheck(callback) {
    apiUtil.requestGetWithToken(callback, 'API_TOKEN');
  }

  // Get user lists except me
  getMentorList(callback) {
    apiUtil.requestGetWithToken(callback, 'API_MENTOR');
  }

  // Get my profile
  getMyProfile(callback) {
    apiUtil.requestGetWithToken(callback, 'API_ME');
  }

  // Get activity list(request, received)
  getActivityList(callback) {
    apiUtil.requestGetWithToken(callback, 'API_ACTIVITY');
  }

  // Get other user's profile
  getOthersProfile(callback, userid) {
    apiUtil.requestGetWithTokenUrl(callback, 'API_USER', userid);
  }

  // Send an email address to get secret code
  reqeustSecretCode(callback, email) {
    let body = {};
    body.email = email;
    apiUtil.requestPost(callback, 'API_SECRET_CODE', body);
  }

  // Reset password
  resetPassword(callback, email, password, secretCode) {
    let body = {};
    body.email = email;
    body.password = password;
    body.secretCode = secretCode;
    apiUtil.requestPost(callback, 'API_RESET_PASS', body);
  }

  editGeneral(callback, general) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_GENERAL', general);
  }

  editCareer(callback, career) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_CAREER', career);
  }

  editExpertise(callback, expertise) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_EXPERTISE', expertise);
  }

  editPersonality(callback, personality) {
    let body = {};
    body.personality = personality;
    apiUtil.requestPostWithToken(callback, 'API_EDIT_PERSONALITY', body);
  }

  getRequestSetting(callback) {
    apiUtil.requestGetWithToken(callback, 'API_GET_REQUEST_SETTING');
  }

  setRequestSetting(callback, value) {
    let body = {};
    body.mentorMode = value.toString();
    apiUtil.requestPostWithToken(callback, 'API_SET_REQUEST_SETTING', body);
  }
};

const userUtil = new UserUtil();
module.exports = userUtil;
