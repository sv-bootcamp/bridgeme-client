import {
  AsyncStorage,
  Alert,
 } from 'react-native';
import ErrorUtil from './ErrorUtil';
import {
  UrlMeta,
  ServerMeta,
  LoginMeta,
  ErrorMeta,
} from './ApiMeta';

class ApiUtil {

  requestGet(callback, api, body = null, contentType = ServerMeta.CONTENT_TYPE_URL) {
    this.request(callback, api, 'GET', body, contentType);
  }

  requestGetUrl(callback, api, etcUrl, body = null, contentType = ServerMeta.CONTENT_TYPE_URL) {
    this.request(callback, api, 'GET', body, contentType, null, etcUrl);
  }

  requestPost(callback, api, body, contentType = ServerMeta.CONTENT_TYPE_JSON) {
    this.request(callback, api, 'POST', body, contentType);
  }

  requestGetWithToken(callback, api, body = null, contentType = ServerMeta.CONTENT_TYPE_URL)  {
    AsyncStorage.getItem('token', (err, result) => {
      if (err) return;
      if (result)
       this.request(callback, api, 'GET', body, contentType, result);
    });
  }

  requestGetWithTokenUrl(callback, api, etcUrl, body = null,
    contentType = ServerMeta.CONTENT_TYPE_URL) {
    AsyncStorage.getItem('token', (err, result) => {
      if (err) return;
      if (result)
       this.request(callback, api, 'GET', body, contentType, result, etcUrl);
    });
  }

  requestPostWithToken(callback, api, body, contentType = ServerMeta.CONTENT_TYPE_JSON)  {
    AsyncStorage.getItem('token', (err, result) => {
      if (err) return;
      if (result)
       this.request(callback, api, 'POST', body, contentType, result);
    });
  }

  request(callback, api, httpMethod, body = null, contentType,  jwt = null, etcUrl = '') {
    if (UrlMeta[api] === undefined) return;
    let url = UrlMeta.HOST + UrlMeta[api] + etcUrl;
    let reqSet = {
      method: httpMethod,
      headers: {
        'Content-Type': contentType,
      },
    };

    if (body !== null) {
      if (httpMethod === 'GET') {
        url += '?';
        Object.keys(body).map(
          (key, idx) => {
            if (idx > 0) url += '&';
            url += key + '=' + body[key];
          }
        );
      } else if (httpMethod === 'POST') {
        reqSet.body = JSON.stringify(body);
      }
    }

    if (jwt) {
      reqSet.headers.access_token = jwt;
    }

    fetch(url, reqSet)
    .then(this.getResponse)
    .then((res) => callback(res, null))
    .catch((error) => callback(null, error));
  }

  getResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  }

}

const apiUtil = new ApiUtil();
module.exports = apiUtil;
