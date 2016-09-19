import React, { Component } from 'react';
import {
 StyleSheet,
 View,
 Navigator,
 DeviceEventEmitter,
 TouchableHighlight,
 Image,
 Alert,
 TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../utils/ErrorMeta';
import LoginUtil from '../utils/LoginUtil';

class Login extends Component {
  constructor(props) {
    super(props);
    LoginUtil.initCallback(this.onLoginSuccess, this.onLoginFail);
    LoginUtil.initLinkedIn();
  }

  componentWillMount() {
    LoginUtil.initEvent();
  }

  render() {
    return (

          //  Render the screen on View.
           <View style={styles.container}>
             <View style={styles.welcomeContain}>
                <Image source={require('../resources/splash_icon_1x.png')} />
             </View>

             {/* Render facebook login button */}
          <TouchableWithoutFeedback onPress={LoginUtil.signInWithFacebook}>
              <Image style={styles.facebookLoginButton}
               source={require('../resources/facebook_2x.png')} />
           </TouchableWithoutFeedback>

            {/* Render linkedin login buttion */}
            <TouchableHighlight onPress={LoginUtil.signinWithLinkedIn}>
              <Image style={styles.linkedinLoginButton}
                source={require('../resources/Linkedin_2x.png')} />
            </TouchableHighlight>
        </View>
     );
  }

  onLoginSuccess(result) {
    Actions.main();
  }

  onLoginFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }
}

const styles = StyleSheet.create({
  welcomeContain: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 105,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  defaultButton: {
    opacity: 0.1,
    height: 40,
    width: 290,
    marginBottom: 10,
  },
  facebookLoginButton: {
    height: 40,
    width: 290,
    marginBottom: 10,
  },
  linkedinLoginButton: {
    height: 40,
    width: 290,
    backgroundColor: '#FFFFFFFF',
  },
});

module.exports = Login;
