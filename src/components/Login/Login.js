import React, { Component } from 'react';
import {
 ActivityIndicator,
 Alert,
 AsyncStorage,
 Image,
 Text,
 TextInput,
 TouchableWithoutFeedback,
 TouchableHighlight,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../../utils/ErrorMeta';
import LoginMeta from '../../utils/LoginMeta';
import LinearGradient from 'react-native-linear-gradient';
import LoginUtil from '../../utils/LoginUtil';
import ServerUtil from '../../utils/ServerUtil';
import styles from './Styles';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loaded: false,
    };
  }

  render() {
    if (this.state.loaded === false) {
      return this.renderLoadingView();
    }

    let onChangeEmail = (text) => { this.state.email = text; };
    let onChangePassword = (text) => { this.state.password = text; };

    return (

      //  Render the screen on View.
      <View style={styles.container}>
        <View style={styles.mainLogo}>
          <Image source={require('../../resources/splash_icon_1x.png')} />
        </View>

        {/* Render facebook login button */}
        <TouchableWithoutFeedback onPress={() => this.signInFB()}>
          <View style={styles.facebookLoginContainer}>
            <Image style={styles.facebookLoginButton}
                   source={require('../../resources/fb.png')} />
            <Text style={styles.facebookLoginText}>Login with Facebook</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.hrContainer}>
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
            placeholderTextColor="#d8d8d8"
            onChangeText={onChangePassword}
            underlineColorAndroid="#efeff2" />
        </View>

        <TouchableWithoutFeedback onPress={() => this.signInLocal()}>
          <LinearGradient
            colors={['#44acff', '#07e4dd']}
            start={[0.0, 0.0]} end={[1.0, 1.0]}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </LinearGradient>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => Actions.findPassStep1()}>
          <View style={styles.subTextContainer}>
            <Text style={styles.subText}>Forgot password?</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomTextLeft}>{'Don\'t you have an account? '}</Text>
          <TouchableWithoutFeedback onPress={() => Actions.signUp()}>
            <View>
              <Text style={styles.bottomTextRight}>Sign up</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={!this.state.loaded}
          style={[styles.activityIndicator]}
          size="large"
          />
        <Text style={styles.headerText}>Loading...</Text>
      </View>
    );
  }

  componentDidMount() {
    let onGetTokenSuccess = (result) => this.onGetTokenSuccess(result);
    let onGetTokenFail = (error) => this.onGetTokenFail(error);

    LoginUtil.initCallback(onGetTokenSuccess, onGetTokenFail);
    LoginUtil.hasToken();
  }

  onGetTokenSuccess(token) {
    this.onSignInSuccess(token);
  }

  onGetTokenFail(error) {
    this.setState({ loaded: !this.state.loaded });
  }

  signInFB() {
    let onSignInSuccess = (result) => this.onSignInSuccess(result);
    let onSignInFail = (error) => this.onSignInFail(error);

    LoginUtil.initCallback(onSignInSuccess, onSignInFail);
    LoginUtil.signInWithFacebook();
  }

  onSignInSuccess(result) {
    if (result) {
      let onGetProfileSuccess = (res) => this.onGetProfileSuccess(res);
      let onGetProfileFail = (error) => this.onGetProfileFail(error);

      ServerUtil.initCallback(onGetProfileSuccess, onGetProfileFail);
      ServerUtil.getMyProfile();
      return;
    }

    this.setState({ loaded: !this.state.loaded });
  }

  onSignInFail(error) {
    Alert.alert(
      'SignIn',
      'Sever error(Sign in)! Please contact to developer',
    );
  }

  onGetProfileSuccess(profile) {
    Actions.generalInfo({ me: profile });
  }

  onGetProfileFail(error) {
    Alert.alert(
      'SignIn',
      'Sever error(Profile)! Please try to sign in again.',
    );
    this.onGetTokenFail();
  }

  signInLocal() {
    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email) === false) {
      Alert.alert(
        'SignIn',
        'Please input your correct email.',
      );
      return;
    }

    if (this.state.password === '') {
      Alert.alert(
        'SignIn',
        'Please input your password.',
      );
      return;
    }

    let onLocalLoginSuccess = (result) => this.onLocalLoginSuccess(result);
    let onLocalLoginFail = (error) => this.onSignInFail(error);

    ServerUtil.initCallback(onLocalLoginSuccess, onLocalLoginFail);
    ServerUtil.signIn(this.state.email, this.state.password);
  }

  onLocalLoginSuccess(result) {
    let onSignInSuccess = (res) => this.onSignInSuccess(res);
    AsyncStorage.multiSet(
       [['token', result.user.password], ['loginType', LoginMeta.LOGIN_TYPE_LOCAL]],
       () => onSignInSuccess(result)
    );
  }

  focusNextField(refNo) {
    this.refs[refNo].focus();
  }
}

module.exports = Login;
