import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import apiUtil from './ApiUtil';

class MatchUtil {
  // Request to mentor
  sendMentoringRequest(callback, mentorId, content) {
    let body = {};
    body.mentorId = mentorId;
    body.content = content;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_REQ', body);
  }

  // Reject request
  rejectRequest(callback, mentorId) {
    let body = {};
    body.mentorId = mentorId;
    body.option = 0;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_RESP', body);
  }

  // Accept request
  acceptRequest(callback, mentorId) {
    let body = {};
    body.mentorId = mentorId;
    body.option = 1;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_RESP', body);
  }

  // Get activity list(request, received)
  getActivityList(callback) {
    apiUtil.requestGetWithToken(callback, 'API_ACTIVITY');
  }

};

const matchUtil = new MatchUtil();
module.exports = matchUtil;
