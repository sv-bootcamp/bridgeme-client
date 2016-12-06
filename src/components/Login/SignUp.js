import React, { Component } from 'react';
import {
 Alert,
 Image,
 TextInput,
 TouchableWithoutFeedback,
 TouchableOpacity,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Styles';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password1: '',
      password2: '',
    };
  }

  render() {
    let onInputEmail = (text) => this.state.email = text;
    let onInputPassword1 = (text) => this.state.password1 = text;
    let onInputPassword2 = (text) => this.state.password2 = text;
    let focusNextField = (refNo) => this.refs[refNo].focus();
    let createAccount = () => this.createAccount();

    return (

      //  Render the screen on View.
      <View style={styles.container}>
        <View style={styles.mainLogo}>
          <Image source={require('../../resources/page-1-copy-2.png')} />
          <Text style={styles.mainLogoText}>Bridge Me</Text>
        </View>

        {/* Render facebook login button */}
        <TouchableWithoutFeedback
          onPress={() => this.signInFB()}>
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
            onChangeText={onInputEmail}
            onSubmitEditing={() => focusNextField('2')} />
          <TextInput
            style={styles.input}
            ref="2"
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType="next"
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onInputPassword1}
            onSubmitEditing={() => focusNextField('3')} />
          <TextInput
            style={styles.input}
            ref="3"
            placeholder="Confirm password"
            secureTextEntry={true}
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onInputPassword2} />
        </View>
        <TouchableOpacity onPress={createAccount}>
          <LinearGradient
            colors={['#44acff', '#07e4dd']}
            start={[0.0, 0.0]} end={[1.0, 1.0]}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>CREATE ACCOUNT</Text>
          </LinearGradient>
        </TouchableOpacity>
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

  signInFB() {
    UserUtil.signInWithFacebook(this.onLoginCallback.bind(this));
  }

  onLoginCallback(result, error) {
    if (error) {
      this.alert('Sever error(Profile)! Please sign in again.');
    } else if (result) {
      AsyncStorage.setItem('token', result.access_token, () => Actions.generalInfo());
    }
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

    UserUtil.localSignUp(
      this.onSignUpCallback.bind(this),
      this.state.email,
      this.state.password1
    );
  }

  onSignUpCallback(result, error) {
    if (error) {
      this.alert('Sever error(Profile)! Please sign up again.');
    } else if (result) {
      Actions.login();
    }
  }

  alert(msg) {
    Alert.alert('Sign In', msg);
  }
}

module.exports = SignUp;
