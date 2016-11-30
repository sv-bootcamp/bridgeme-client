export const LoginMeta = {
  LOGIN_TYPE_LOCAL: '0',
  LOGIN_TYPE_FB: '1',
};

export const ServerMeta = {
  CONTENT_TYPE_URL: 'application/x-www-form-urlencoded',
  CONTENT_TYPE_JSON: 'application/json',
};

export const UrlMeta = {
  HOST: 'http://ec2-52-78-121-221.ap-northeast-2.compute.amazonaws.com:80/',
  API_LOGIN: 'users/signIn/',
  API_MENTOR:  'users/mentorlist/',
  API_ALL: 'users/all/',
  API_CHATTING_PUSH: 'match/push/',
  API_ME: 'users/me/',
  API_USER: 'users/id/',
  API_ACTIVITY: 'match/activity/',
  API_MENTOR_REQ: 'match/request/',
  API_MENTOR_RESP: 'match/response/',
  API_GET_SURVEY_MENTEE: 'survey/request/mentee',
  API_GET_SURVEY_MENTOR: 'survey/request/mentor',
  API_SEND_RESULT: 'survey/answer/',
  API_EDIT_GENERAL: 'users/editGeneral/',
  API_EDIT_CAREER: 'users/editCareer/',
  API_EDIT_EXPERTISE: 'users/editExpertise/',
  API_EDIT_PERSONALITY: 'users/editPersonality/',
  API_LOCAL_SIGNUP: 'users/localSignUp/',
  API_LOCAL_SIGNIN: 'users/localSignIn/',
  API_SECRET_CODE: 'users/secretCode/',
  API_RESET_PASS: 'users/resetPassword/',
  API_GET_REQUEST_SETTING: 'users/mentorMode/',
  API_SET_REQUEST_SETTING: 'users/editMentorMode/',
  API_SIGN_OUT: 'users/signOut/',
  API_TOKEN: 'users/accessToken/',
};

export const ErrorMeta = {
  ERR_NONE: 'Undefined Error',
  ERR_TOKEN_INVALID: 'Token has been expired. Try again',
  ERR_SERVER_FAIL: 'Login again',
  ERR_NO_LOGIN_TYPE: 'Server error. Try again',
  ERR_FB_LOGIN: 'Login error from facebook',
  ERR_FB_LOGIN_CANCELLED: 'Login cancelled',
  ERR_NO_USER_DATA: 'Cannot fetch user data',
  ERR_APP_FAIL: 'Error has occured from web',
};
