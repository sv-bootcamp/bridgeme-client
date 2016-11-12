class UrlMeta {

  //Host and API
  static host = 'http://ec2-52-78-121-221.ap-northeast-2.compute.amazonaws.com:8000/';
  // host = 'http:/192.168.0.22:8000/';

  static API_LOGIN = 'users/signIn/';
  static API_MENTOR = 'users/mentorlist/';
  static API_ALL = 'users/all/';
  static API_ME = 'users/me/';
  static API_USER = 'users/id/';
  static API_ACTIVITY = 'match/activity/';
  static API_MENTOR_REQ = 'match/request/';
  static API_MENTOR_RESP = 'match/response/';
  static API_EDIT_GENERAL = 'users/editGeneral/';
  static API_LOCAL_SIGNUP = 'users/localSignUp/';
  static API_LOCAL_SIGNIN = 'users/localSignIn/'
  static API_SECRET_CODE = 'users/secretCode/';
  static API_RESET_PASS = 'users/resetPassword/';
  static API_EDIT_PERSONALITY = 'users/editPersonality/';
  static API_GET_REQUEST_SETTING = 'users/mentorMode/';
  static API_SET_REQUEST_SETTING = 'users/editMentorMode/';
  static API_SIGN_OUT = 'users/signOut/';
}

module.exports = UrlMeta;
