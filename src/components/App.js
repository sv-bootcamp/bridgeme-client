/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    TouchableHighlight,
    DeviceEventEmitter,
    Alert,
} from 'react-native';

import {
  LoginButton,
  AccessToken,
} from 'react-native-fbsdk';
import LinkedInLogin from './utils/linkedin-login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        titleText: 'Yoda',
        os: '',
      };

    // Populate the OS state by looking at Platform params.
    if (Platform.OS === 'ios') {
      this.state.os = 'IOS';
    } else if (Platform.OS === 'android') {
      this.state.os = 'Android API :' + Platform.Version;
    }

    console.log(('Starting the app for platform: ' + this.state.os));
    this.initLinkedIn();
  }

  // Initialize linkedin tokens
  initLinkedIn() {
    let redirecUrl = 'http://localhost';
    let clientId = '78831o5pn1vg4p';
    let clientSecret = 'ioMEK1Qu77xqxKyu';
    let state = 'DCEeFWf45A53qdfKef424';
    let scopes = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin'];
    LinkedInLogin.init(redirecUrl, clientId, clientSecret, state, scopes);
  }

  signinWithLinkedIn() {
    LinkedInLogin.login();
  }

  componentWillMount() {
    this.initEvent();
  }

  // fetching data from linkedin
  initEvent() {
    DeviceEventEmitter.addListener('linkedinLoginError', (error) => {
      console.log('linkedinLoginError!');
    });

    DeviceEventEmitter.addListener('linkedinLogin', (data) => {
      LinkedInLogin.setSession(data.accessToken, data.expiresOn);
      LinkedInLogin.getProfile();
    });

    DeviceEventEmitter.addListener('linkedinGetRequest', (d) => {
      const data = JSON.parse(d.data);
      if (data) {
        console.log(JSON.stringify(data));
        console.log('data');
      }
    });

    DeviceEventEmitter.addListener('linkedinGetRequestError', (error) => {
      console.log('linkedinGetRequestError!');
    });
  }

  render() {
    return (

          //  Render the screen on View.
           <View style={styles.container}>

             {/* Render facebook login button */}
             <LoginButton
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert('Login has error: ' + result.error);
                    } else if (result.isCancelled) {
                      alert('Login is cancelled.');
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          alert(data.accessToken.toString());
                        }
                    );
                    }
                  }
              }
              onLogoutFinished={() => alert('Logout.')}/>

            {/* Render linkedin login buttion */}
            <TouchableHighlight onPress={this.signinWithLinkedIn}>
              <Image
                source={require('../resources/Linkedin_SignIn_btn.png')} />
            </TouchableHighlight>
        </View>
     );
  }
}

// Set style components.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = App;
