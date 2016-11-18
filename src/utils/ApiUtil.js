import {
  AsyncStorage,
  Alert,
 } from 'react-native';
import {
  UrlMeta,
  ServerMeta,
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
    this.requestWithToken(callback, api, 'GET', body, contentType);
  }

  requestGetWithTokenUrl(callback, api, etcUrl, body = null,
    contentType = ServerMeta.CONTENT_TYPE_URL) {
    this.requestWithToken(callback, api, 'GET', body, contentType, etcUrl);
  }

  requestPostWithToken(callback, api, body, contentType = ServerMeta.CONTENT_TYPE_JSON)  {
    this.requestWithToken(callback, api, 'POST', body, contentType);
  }

  requestWithToken(callback, api, method, body, contentType, etcUrl) {
    AsyncStorage.getItem('token', (err, result) => {
      this.request(callback, api, method, body, contentType, result, etcUrl);
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
