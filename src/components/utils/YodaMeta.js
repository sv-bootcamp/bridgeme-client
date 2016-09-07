class YodaMeta {

  // Sign In type
  // 1 : Facebook
  // 2 : LinkedIn
  static LOGIN_TYPE_FB = '1';
  static LOGIN_TYPE_LI = '2';

   // Meta data for LinkedIn Sign In
  static redirectUrl = 'http://localhost';
  static clientId = '78831o5pn1vg4p';
  static clientSecret = 'ioMEK1Qu77xqxKyu';
  static state = 'DCEeFWf45A53qdfKef424';
  static scopes = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin'];

  //Host and API
  static host = 'http://ec2-52-78-121-221.ap-northeast-2.compute.amazonaws.com:8080/';
  static API_LOGIN = 'users/signIn/';
  static API_MENTOR = 'users/mentorlist/';
  static API_ALL = 'users/all/';
  static API_ME = 'users/me/';
  static API_USER = 'users/id/';
  static API_ACTIVITY = 'match/list/';
  static API_MENTOR_REQ = 'match/request/';
  static API_MENTOR_RESP = 'match/response/';

  // Error code
  static ERR_NONE = 0;
  static ERR_TOKEN_INVALID = 1;
  static ERR_SERVER_FAIL = 2;
  static ERR_NO_LOGIN_TYPE = 3;
  static ERR_FB_LOGIN = 4;
  static ERR_LI_LOGIN = 5;
  static ERR_NO_USER_DATA = 6;
  static ERR_APP_FAIL = 7;
}

module.exports = YodaMeta;
