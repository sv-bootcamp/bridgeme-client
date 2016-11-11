import ErrorMeta from './ErrorMeta';
import ErrorUtil from './ErrorUtil';
import UrlMeta from './UrlMeta';

class ServerUtil {
  constructor() {
    successCallback = null;
    errorCallback = null;
  }

  // Set two callbacks to get result
  initCallback(success, error) {
    this.successCallback = success;
    this.errorCallback = error;
  }

  // Error messages
  onError(errCode) {
    let result = ErrorUtil.getErrorMsg(errCode);
    this.errorCallback(result);
  }

  // Get user lists except me
  getMentorList() {
    this.requestToServer('GET', UrlMeta.API_MENTOR, '');
  }

  // Get my profile
  getMyProfile() {
    this.requestToServer('GET', UrlMeta.API_ME, '');
  }

  // Get other user's profile
  getOthersProfile(userid) {
    this.requestToServer('GET', UrlMeta.API_USER, userid);
  }

  // Get activity list(request, received)
  getActivityList() {
    this.requestToServer('GET', UrlMeta.API_ACTIVITY, '');
  }

  getRequestSetting() {
    this.requestToServer('GET', UrlMeta.API_GET_REQUEST_SETTING, '');
  }

  signOut() {
    this.requestToServer('GET', UrlMeta.API_SIGN_OUT, '');
  }

  // Request to mentor
  sendMentoringRequest(mentorId, content) {
    let paramList = [mentorId, content];
    this.requestToServer('POST', UrlMeta.API_MENTOR_REQ, '', paramList);
  }

  // Accept request
  acceptRequest(mentorId) {
    let paramList = [mentorId, 1];
    this.requestToServer('POST', UrlMeta.API_MENTOR_RESP, '', paramList);
  }

  // Reject request
  rejectRequest(mentorId) {
    let paramList = [mentorId, 0];
    this.requestToServer('POST', UrlMeta.API_MENTOR_RESP, '', paramList);
  }

  editGeneral(fieldSet) {
    this.requestToServer('POST', UrlMeta.API_EDIT_GENERAL, '', fieldSet);
  }

  // Local SignUp
  createAccount(email, password) {
    let paramList = [email, password];
    this.requestToServer('POST', UrlMeta.API_LOCAL_SIGNUP, '', paramList);
  }

  // Local SignIn
  signIn(email, password) {
    let paramList = [email, password];
    this.requestToServer('POST', UrlMeta.API_LOCAL_SIGNIN, '', paramList);
  }

  // Send an email address to get secret code
  reqeustSecretCode(email) {
    this.requestToServer('POST', UrlMeta.API_SECRET_CODE, '', email);
  }

  // Reset password
  resetPassword(email, password, code) {
    let paramList = [email, password, code];
    this.requestToServer('POST', UrlMeta.API_RESET_PASS, '', paramList);
  }

  editPersonality(object) {
    let paramList = [object];
    this.requestToServer('POST', UrlMeta.API_EDIT_PERSONALITY, '', paramList);
  }

  setRequestSetting(bool) {
    let paramList = [bool ? 'true' : 'false'];
    this.requestToServer('POST', UrlMeta.API_SET_REQUEST_SETTING, '', paramList);
  }

  // Request to server
  requestToServer(method, apiType, urlEtc, paramList) {
    let url = UrlMeta.host + apiType + urlEtc;
    let formBody;
    if (method === 'GET') {
      formBody = this.makeGetFormBody(method, apiType, paramList);
    } else if (method === 'POST') {
      formBody = this.makePostFormBody(method, apiType, paramList);
    }

    this.fetchData(url, method, formBody);
  }

  makeGetFormBody(httpMethod, apiType, paramList) {
    let formBody = '';
    if (apiType === UrlMeta.API_MENTOR_REQ) {
      formBody += 'mentor_id=' + paramList[0];
      formBody += '&content=' + paramList[1];
    } else if (apiType === UrlMeta.API_MENTOR_RESP) {
      formBody += 'mentor_id=' + paramList[0];
      formBody += '&option=' + paramList[1];
    }

    if (httpMethod == 'GET') {
      return '?' + formBody;
    } else {
      return formBody;
    }
  }

  makePostFormBody(httpMethod, apiType, paramList) {
    let body = {};

    if (apiType === UrlMeta.API_MENTOR_REQ) {
      body.mentor_id = paramList[0];
      body.content = paramList[1];
    } else if (apiType === UrlMeta.API_MENTOR_RESP) {
      body.match_id = paramList[0];
      body.option = paramList[1];
    } else if (apiType === UrlMeta.API_EDIT_GENERAL) {
      return JSON.stringify(paramList);
    } else if (apiType === UrlMeta.API_LOCAL_SIGNUP ||
               apiType === UrlMeta.API_LOCAL_SIGNIN) {
      body.email = paramList[0];
      body.password = paramList[1];
    } else if (apiType === UrlMeta.API_RESET_PASS) {
      body.email = paramList[0];
      body.password = paramList[1];
      body.secretCode = paramList[2];
    } else if (apiType === UrlMeta.API_SECRET_CODE) {
      body.email = paramList;
    } else if (apiType === UrlMeta.API_EDIT_PERSONALITY) {
      body.personality = paramList[0];
    } else if (apiType === UrlMeta.API_SET_REQUEST_SETTING) {
      body.mentorMode = paramList[0];
    }

    return JSON.stringify(body);
  }

  fetchData(url, httpMethod, formBody) {
    let reqSet = this.getReqSet(httpMethod, formBody);

    if (httpMethod == 'GET') {
      url += formBody;
    }

    fetch(url, reqSet)
    .then(serverUtil.getResponse)
    .then(serverUtil.getSuccessResponse)
    .catch(serverUtil.getException);
  }

  getReqSet(httpMethod, formBody) {
    let contentType = (httpMethod === 'GET') ?
                        'application/x-www-form-urlencoded' :
                        'application/json';

    let reqSet = {
      method: httpMethod,
      headers: {

        // TODO: Modify condition if you add PUT, DELETE method
        'Content-Type': contentType,
      },
    };

    if (httpMethod === 'PUT') {
      reqSet.body = formBody;
    } else if (httpMethod === 'POST') {
      reqSet.body = formBody;
    }

    return reqSet;
  }

  getResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  }

  getSuccessResponse(result) {
    serverUtil.successCallback(result);
  }

  getException(error) {
    console.log(error);
    serverUtil.onError(ErrorMeta.ERR_SERVER_FAIL);
  }
}

const serverUtil = new ServerUtil();
module.exports = serverUtil;
