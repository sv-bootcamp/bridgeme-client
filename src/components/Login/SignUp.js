import React, { Component } from 'react';
import {
 Alert,
 Image,
 Text,
 TextInput,
 TouchableWithoutFeedback,
 TouchableHighlight,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../../utils/ErrorMeta';
import LinearGradient from 'react-native-linear-gradient';
import LoginUtil from '../../utils/LoginUtil';
import ServerUtil from '../../utils/ServerUtil';
import styles from './Styles';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password1: '',
      password2: '',
    };

    LoginUtil.initCallback(this.onLoginSuccess, this.onServerFail);
  }

  onLoginSuccess(result) {
    if (result === undefined) {
      Actions.login();
    } else {
      Actions.generalInfo();
    }
  }

  onServerFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  render() {
    let onChangeEmail = (text) => { this.state.email = text; };
    let onChangePassword1 = (text) => { this.state.password1 = text; };
    let onChangePassword2 = (text) => { this.state.password2 = text; };
    let createAccount = () => this.createAccount();

    return (

      //  Render the screen on View.
      <View style={styles.container}>
        <View style={styles.mainLogo}>
          <Image source={require('../../resources/splash_icon_1x.png')} />
        </View>

        {/* Render facebook login button */}
        <TouchableWithoutFeedback onPress={LoginUtil.signInWithFacebook}>
          <View style={[styles.facebookLoginContainer, { marginTop: 43 }]}>
            <Image style={styles.facebookLoginButton}
                   source={require('../../resources/fb.png')} />
            <Text style={styles.facebookLoginText}>Login with Facebook</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.hrContainer, { marginTop: 10 }]}>
          <View style={styles.hr}></View>
          <View><Text style={styles.hrText}>or</Text></View>
          <View style={styles.hr}></View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            ref="1"
            returnKeyType="next"
            placeholder="Email"
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onChangeEmail}
            onSubmitEditing={() => this.focusNextField('2')} />
          <TextInput
            style={styles.input}
            ref="2"
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="next"
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onChangePassword1}
            onSubmitEditing={() => this.focusNextField('3')} />
          <TextInput
            style={styles.input}
            ref="3"
            placeholder="Confirm password"
            secureTextEntry={true}
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onChangePassword2} />
        </View>
        <TouchableWithoutFeedback onPress={createAccount}>
          <LinearGradient
            colors={['#44acff', '#07e4dd']}
            start={[0.0, 0.0]} end={[1.0, 1.0]}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>CREATE ACCOUNT</Text>
          </LinearGradient>
        </TouchableWithoutFeedback>
        <View style={[styles.bottomContainer, { marginTop: 80 }]}>
          <Text style={styles.bottomTextLeft}>Do you have an account? </Text>
          <TouchableWithoutFeedback onPress={() => Actions.pop()}>
            <View>
              <Text style={styles.bottomTextRight}>Log in</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  createAccount() {
    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email) === false) {
      this.alert('Please input your correct email.');
      return;
    }

    if (this.state.password1 === '') {
      this.alert('Please input your password.');
      return;
    }

    if (this.state.password2 === '') {
      this.alert('Please input your password for comparison.');
      return;
    }

    if (this.state.password1 != this.state.password2) {
      this.alert('Please input your password correctly');
      return;
    }

    ServerUtil.initCallback(this.onServerSuccess, this.onServerFail);
    ServerUtil.createAccount(this.state.email, this.state.password1);
  }

  onServerSuccess(result) {
    if (result.msg && result.msg.indexOf('already in use') > -1) {
      alert(result.msg);
    } else {
      alert('Your account is created successfuly!');
      Actions.pop();
    }
  }

  focusNextField(refNo) {
    this.refs[refNo].focus();
  }

  alert(msg) {
    Alert.alert('Sign In', msg);
  }
}

module.exports = Login;
