import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
 } from 'react-native';
import {
  ErrorMeta,
  UrlMeta,
  ServerMeta,
} from './ApiMeta';
import { Actions } from 'react-native-router-flux';

class ApiUtil extends Component {

  constructor(props) {
    super(props);
  }

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

    this.url = url;
    this.reqSet = reqSet;
    this.callback = callback;

    this.fetchData(callback);
  }

  fetchData(callback) {
    fetch(this.url, this.reqSet)
    .then(this.getResponse.bind(this))
    .then((res) => callback(res, null))
    .catch((error) => {
      if (JSON.stringify(error) !== '{}') callback(null, JSON.stringify(error));
      else callback(null, error);
    });
  }

  getResponse(response) {
    if (response.status === 200 || response.status === 201 || response.status === 401) {
      return response.json()
        .then((res) => {
          if (!res) return res;
          res.status = response.status;
          if (res.status === 401)
            this.tokenCheck(res);
          else
            return res;
        });
    } else {
      throw new Error(response);
    }
  }

  tokenCheck(response) {
    if (response.err_point === ErrorMeta.ERR_TOKEN_EXPIRED) {
      this.requestUpdateToken();
    } else {
      (async () => {
        try {
          await AsyncStorage.removeItem('token');
          Actions.login();
        } catch (error) {
          Alert.alert('ERROR: Try again');
        }
      })();
    }
  }

  requestUpdateToken() {
    let reqSet = {
      method: 'PUT',
      headers: {
        access_token: this.reqSet.headers.access_token,
      },
    };
    fetch(UrlMeta.HOST + UrlMeta.API_TOKEN, reqSet)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then((response)=> {
      if (response.access_token) {
        AsyncStorage.setItem('token', response.access_token);
        this.reqSet.headers.access_token = response.access_token;
      }

      this.fetchData(this.callback);
    })
    .catch((error) => Alert.alert(error));
  }

}

const apiUtil = new ApiUtil();
module.exports = apiUtil;
