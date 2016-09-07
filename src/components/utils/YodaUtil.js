import { AsyncStorage } from 'react-native';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import YodaMeta from './YodaMeta';

class YodaUtil {

  constructor() {
    successCallback = null;
    errorCallback = null;
  }

  // Set two callbacks to get result
  initCallback(success, error) {
    this.successCallback = success;
    this.errorCallback = error;
  }

  // Check token
  hasToken() {
    AsyncStorage.getItem('token', (err, result) => {
      if (result === null) {
        this.onError(YodaMeta.ERR_NONE);
      } else {
        this.successCallback();
      }
    });
  }

  // Error messages
  onError(errCode) {
    let result = { code: errCode };

    if (errCode === YodaMeta.ERR_NONE) {
      result.msg = '';
    } else if (errCode === YodaMeta.ERR_TOKEN_INVALID) {
      result.msg = 'Token has been expired. Try again';
    } else if (errCode === YodaMeta.ERR_NO_LOGIN_TYPE) {
      result.msg = 'Login again';
    } else if (errCode === YodaMeta.ERR_SERVER_FAIL) {
      result.msg = 'Server error. Try again';
    }

    this.errorCallback(result);
  }

  // Get all user lists for testing. Won't be used later
  getAllList() {
    this.requestToServer('GET', YodaMeta.API_ALL, '');
  }

  // Get user lists except me
  getMentorList() {
    this.requestToServer('GET', YodaMeta.API_MENTOR, '');
  }

  // Get my profile
  getMyProfile() {
    this.requestToServer('GET', YodaMeta.API_ME, '');
  }

  // Get other user's profile
  getOthersProfile(userid) {
    this.requestToServer('GET', YodaMeta.API_ME, userid);
  }

  // Get activity list(request, received)
  getActivityList() {
    this.requestToServer('GET', YodaMeta.API_ACTIVITY, '');
  }

  // Request to mentor
  sendMentoringRequest(montorId, content) {
    let paramList = [mentorId, content];
    this.requestToServer('POST', YodaMeta.API_MENTOR_REQ, paramList);
  }

  // Accept request
  acceptRequest(montorId) {
    let paramList = [mentorId, 1];
    this.requestToServer('POST', YodaMeta.API_MENTOR_RESP, paramList);
  }

  // Reject request
  rejectRequest(montorId) {
    let paramList = [mentorId, 0];
    this.requestToServer('POST', YodaMeta.API_MENTOR_RESP, paramList);
  }

  // Request to server
  requestToServer(method, apiType, urlEtc, paramList) {
    AsyncStorage.multiGet(['loginType', 'token'], (err, stores) => {
      let type = stores[0][1];
      let token = stores[1][1];

      if (token === null || token === undefined || token === '') {
        this.onError(YodaMeta.ERR_NO_LOGIN_TYPE);
        return;
      }

      if (type == YodaMeta.LOGIN_TYPE_FB || type == YodaMeta.LOGIN_TYPE_LI) {
        let url = YodaMeta.host + apiType + urlEtc;
        let formBody = this.makeFormBody(method, token, apiType, paramList);
        this.fetchData(url, method, formBody);
      } else {
        this.onError(YodaMeta.ERR_NO_LOGIN_TYPE);
      }
    });
  }

  makeFormBody(httpMethod, token, apiType, paramList) {
    let formBody = 'access_token=' + token;

    if (apiType === YodaMeta.API_MENTOR_REQ) {
      formBody += '&metor_id=' + paramList[0];
      formBody += '&content=' + paramList[1];
    } else if (apiType === YodaMeta.API_MENTOR_RESP) {
      formBody += '&metor_id=' + paramList[0];
      formBody += '&option=' + paramList[1];
    }

    if (httpMethod == 'GET') {
      return '?' + formBody;
    } else {
      return formBody;
    }
  }

  fetchData(url, httpMethod, formBody) {
    let reqSet = this.getReqSet(httpMethod, formBody);
    if (httpMethod == 'GET') {
      url += formBody;
    }

    fetch(url, reqSet)
    .then((response) => response.json())
    .then((result) => {
      if (result.successCode === 0) {
        this.onError(YodaMeta.ERR_TOKEN_INVALID);
      } else {
        this.successCallback(result);
      }
    })
    .catch((error) => {
      this.onError(YodaMeta.ERR_SERVER_FAIL);
    });
  }

  getReqSet(httpMethod, formBody) {
    let reqSet = {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (httpMethod == 'PUT') {
      reqSet.body = formBody;
    }

    return reqSet;
  }
}

const yodaUtil = new YodaUtil();
module.exports = yodaUtil;
