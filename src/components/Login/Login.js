import React, { Component } from 'react';
import {
 ActivityIndicator,
 Alert,
 AsyncStorage,
 Image,
 Text,
 TextInput,
 TouchableWithoutFeedback,
 TouchableOpacity,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import UserUtil from '../../utils/UserUtil';
import styles from './Styles';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loaded: false,
      tokenValid: false,
    };

    AsyncStorage.getItem('token', (err, result) => {
      if (result)
        UserUtil.getMyProfile(this.onTokenValidCheck.bind(this));
      else
        this.setState({ loaded: true });
    });
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
          <View><Text style={styles.hrText}>OR</Text></View>
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

        <TouchableOpacity onPress={() => this.signInLocal()}>
          <LinearGradient
            colors={['#44acff', '#07e4dd']}
            start={[0.0, 0.0]} end={[1.0, 1.0]}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </LinearGradient>
        </TouchableOpacity>

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

  signInFB() {
    UserUtil.signInWithFacebook(this.onLoginCallback.bind(this));
  }

  signInLocal() {
    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email) === false) {
      Alert.alert(
        'Login',
        'Please input your correct email.',
      );
      return;
    }

    if (this.state.password === '') {
      Alert.alert(
        'Login',
        'Please input your password.',
      );
      return;
    }

    UserUtil.localSignUp(this.onLoginCallback.bind(this), this.state.email, this.state.password);
  }

  onLoginCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    }else if (result) {
      AsyncStorage.setItem('token', result.access_token,
      () => UserUtil.getMyProfile(this.onGetProfileCallback.bind(this)));
    }
  }

  onTokenValidCheck(profile, error) {
    if (error) {
      this.setState({ loaded: true });
    } else if (profile) {
      if (profile.name) {
        Actions.main({ me: profile });
      } else {
        Actions.generalInfo({ me: profile });
      }
    }
  }

  onGetProfileCallback(profile, error) {
    if (error) {
      Alert.alert(
        'Login',
        'Sever error(Profile)! Please try to sign in again.',
      );
      this.setState({ loaded: true });
    } else if (profile) {
      Actions.generalInfo({ me: profile });
    }

  }

  focusNextField(refNo) {
    this.refs[refNo].focus();
  }
}

module.exports = Login;
