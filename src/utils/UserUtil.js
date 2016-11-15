import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import {
  LoginMeta,
  ErrorMeta,
} from './ApiMeta';
import apiUtil from './ApiUtil';

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
            AccessToken.getCurrentAccessToken()
            .then((data) => {
              let body = {};
              body.platform_type = LoginMeta.LOGIN_TYPE_FB;
              body.access_token = data.accessToken.toString();
              apiUtil.requestPost(callback, 'API_LOGIN', body);
            })
            .catch((error) => {
              alert(ErrorMeta.ERR_FB_LOGIN);
            });
          }
        },

        function (error) {
          alert('Login fail with error: ' + error);
        }
    );
  }

  // Get user lists except me
  localSignUp(callback, email, password) {
    let body = {};
    body.email = email;
    body.password = password;
    apiUtil.requestPostWithToken(callback, 'API_LOCAL_SIGNUP', body);
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
    apiUtil.requestPostWithToken(callback, 'API_SECRET_CODE', body);
  }

  // Reset password
  resetPassword(callback, email, password, secretCode) {
    let body = {};
    body.email = email;
    body.password = password;
    body.secretCode = secretCode;
    apiUtil.requestPostWithToken(callback, 'API_RESET_PASS', body);
  }

  editGeneral(callback, general) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_GENERAL', general);
  }

  editJob(callback, job) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_JOB', job);
  }

  editHelp(callback, help) {
    apiUtil.requestPostWithToken(callback, 'API_EDIT_HELP', help);
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
