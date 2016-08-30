'use strict';

const React = require('react-native');
const {
    Platform,
    DeviceEventEmitter,
    NativeModules
} = React;
const RNLinkedinLogin = NativeModules.LinkedinLogin;

class LinkedinLogin {

    _accessToken = null;
    _expiresOn = null;

    _redirectUrl = null;
    _clientId = null;
    _clientSecret = null;
    _state = null;
    _scopes = null;

    constructor() {
    }

    /**
     * Initializes the LinkedinLogin API
     * @param  {string} redirectUrl     redirectUrl can be anything I guess? lol
     * @param  {string} clientId        clientId from linkedin developer portal
     * @param  {string} clientSecret    clientSecret from linkedin developer portal
     * @param  {string} state           any random string no one else has
     * @param  {array} scopes           array of available permissions
     */
    init(redirectUrl, clientId, clientSecret, state, scopes) {
        this._redirectUrl = redirectUrl;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._state = state;
        this._scopes = scopes;
    }

    /**
     * Gets the Profile image
     * @return {object} Returns the promise with the image
     */
    getProfileImages() {
        const atoken = this._accessToken;

        return new Promise((resolve, reject) => {
            const picstr = 'https://api.linkedin.com/v1/people/~/picture-urls::(original)';
            const picstrWithAuth = `${picstr}?oauth2_access_token=${atoken}&format=json`;

            if (Platform.OS === 'android') {
                RNLinkedinLogin.getRequest(picstr);
            } else if(Platform.OS === 'ios'){
                console.log('picstrWithAuth', picstrWithAuth);

                fetch(picstrWithAuth).then(function(response) {
                    return response.json();
                }).then((data) => {
                    if (data.values && data.values.length > 0) {
                        resolve(data.values);
                    } else {
                        reject('Profile has no images');
                    }
                });
            }
        });
    }

    /**
     * Gets the user profile
     * @return {object} Returns a promise with the user object or error
     */
    getProfile() {
        const atoken = this._accessToken;

        return new Promise((resolve, reject) => {
            const options = 'id,first-name,last-name,industry,email-address';
            const profilestr = `https://api.linkedin.com/v1/people/~:(${options})`;
            const profilestrWithAuth = `${profilestr}?oauth2_access_token=${atoken}&format=json`;

            console.log(profilestrWithAuth);
            if (Platform.OS === 'android') {
                RNLinkedinLogin.getRequest(profilestr);
            } else if(Platform.OS === 'ios'){
                fetch(profilestrWithAuth).then(function(response) {
                    return response.json();
                }).then((data) => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject('No profile found');
                    }
                });
            }
        });
    }

    /**
     * Sets the Linkedin session
     * @param  {string} accessToken Linkedin access token
     * @param  {Number} expiresOn   The access token's expiration number
     * @return {object} promise     Returns if access token is valid or not
     */
    setSession(accessToken, expiresOn) {
        this._accessToken = accessToken;
        this._expiresOn = expiresOn;
    }

    /**
     * Logs the user in
     * @return {promise} returns whether or not the user logged in successfully
     */
    login() {
        return new Promise((resolve, reject) => {
            RNLinkedinLogin.login(
                this._clientId,
                this._redirectUrl,
                this._clientSecret,
                this._state,
                this._scopes
            );
        });
    }

    logout() {
        this._accessToken = null;
    }
}

const linkedinLogin = new LinkedinLogin();

module.exports = linkedinLogin;
