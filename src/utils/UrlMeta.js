class UrlMeta {

  //Host and API
  static host = 'http://192.168.0.53:8000/';
  static API_LOGIN = 'users/signIn/';
  static API_MENTOR = 'users/mentorlist/';
  static API_ALL = 'users/all/';
  static API_ME = 'users/me/';
  static API_USER = 'users/id/';
  static API_ACTIVITY = 'match/activity/';
  static API_MENTOR_REQ = 'match/request/';
  static API_MENTOR_RESP = 'match/response/';
  static API_EDIT_GENERAL = 'users/editGeneral/';
}

module.exports = UrlMeta;
