import React, { Component } from 'react';
import {
 StyleSheet,
 View,
 TouchableHighlight,
 Image,
 Alert,
 TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../utils/ErrorMeta';
import LoginUtil from '../utils/LoginUtil';
import ServerUtil from '../utils/ServerUtil';

class Login extends Component {

  constructor(props) {
    super(props);
    LoginUtil.initCallback(this.onLoginSuccess, this.onLoginFail);
    LoginUtil.initLinkedIn();

    ServerUtil.initCallback(
            (result) => this.onServerSuccess(result),
            (error) => this.onServerFail(error)
    );

  }

  componentWillMount() {
    LoginUtil.initEvent();
    ServerUtil.hasToken();
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
            <TouchableWithoutFeedback onPress={() =>
                Alert.alert('SORRY TEMPORARILY OUT OF SERVICE UNTIL FURTHER NOTICE')}>
              <Image style={styles.linkedinLoginButton}
                source={require('../resources/Linkedin_2x.png')} />
            </TouchableWithoutFeedback>
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

  // Token already exists on the server
  onServerSuccess(result) {
    Actions.main();
  }

  onServerFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(JSON.stringify(error.msg));
    }

    Actions.login();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcomeContain: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 105,
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
