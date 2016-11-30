import {
  AccessToken,
  LoginManager,
} from 'react-native-fbsdk';
import apiUtil from './ApiUtil';

class MatchUtil {

  // Request to mentor
  sendMentoringRequest(callback, mentorId, subjects, content) {
    let body = {};
    body.mentor_id = mentorId;
    body.subjects = subjects;
    body.contents = content;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_REQ', body);
  }

  // Reject request
  rejectRequest(callback, matchId) {
    let body = {};
    body.match_id = matchId;
    body.option = 0;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_RESP', body);
  }

  // Accept request
  acceptRequest(callback, matchId) {
    let body = {};
    body.match_id = matchId;
    body.option = 1;
    apiUtil.requestPostWithToken(callback, 'API_MENTOR_RESP', body);
  }

  // Get activity list(request, received)
  getActivityList(callback) {
    apiUtil.requestGetWithToken(callback, 'API_ACTIVITY');
  }
  
  // Send chatting message
  sendChattingMessage(callback, senderId, message) {
    let body = {};
    body.senderId = senderId;
    body.message = message;
    apiUtil.requestPostWithToken(callback, 'API_CHATTING_PUSH', body);
  }
  
};

const matchUtil = new MatchUtil();
module.exports = matchUtil;
