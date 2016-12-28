import React, { Component } from 'react';
import {
 ActivityIndicator,
 Alert,
 AsyncStorage,
 Image,
 TextInput,
 TouchableWithoutFeedback,
 TouchableOpacity,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
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
  }

  componentDidMount() {
    AsyncStorage.getItem('firstFlag', (error, result) => {
      if (result === 'on') {
        this.hasToken();
        return;
      }

      AsyncStorage.setItem('firstFlag', 'on');
      Actions.onBoarding();
    });
  }

  hasToken() {
    AsyncStorage.getItem('token', (err, result) => {
      if (err) {
        this.setState({ loaded: true });
      } else if (result) {
        UserUtil.getMyProfile(this.onGetProfileCallback.bind(this));
      } else {
        this.setState({ loaded: true });
      }
    });
  }

  render() {
    if (this.state.loaded === false) {
      return this.renderLoadingView();
    }

    let onChangeEmail = (text) => this.state.email = text;
    let onChangePassword = (text) => this.state.password = text;
    let focusNextField = (refNo) => this.refs[refNo].focus();

    return (

      //  Render the screen on View.
      <View style={styles.container}>
        <View style={styles.mainLogo}>
          <Image source={require('../../resources/page-1-copy-2.png')} />
          <Text style={styles.mainLogoText}>Bridge Me</Text>
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
            onSubmitEditing={() => focusNextField('2')} />
          <TextInput
            style={styles.input}
            ref="2"
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onChangeText={onChangePassword} />
        </View>

        <TouchableOpacity onPress={() => this.signInLocal()}>
          <LinearGradient
            colors={['#44acff', '#07e4dd']}
            start={[0.0, 0.0]} end={[1.0, 1.0]}
            style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>LOG IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={() => Actions.inputEmailAddr()}>
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
        <ActivityIndicator animating={!this.state.loaded} size="small" />
        <Text>Loading...</Text>
      </View>
    );
  }

  signInFB() {
    this.setState(
      { loaded: false },
      () => UserUtil.signInWithFacebook(this.onLoginCallback.bind(this)),
    );
  }

  signInLocal() {
    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email) === false) {
      this.alert('Please input your correct email.');
      return;
    }

    if (this.state.password === '') {
      this.alert('Please input your password.');
      return;
    }

    this.setState(
      { loaded: false },
      () => UserUtil.localSignIn(
        this.onLoginCallback.bind(this),
        this.state.email,
        this.state.password
      ),
    );
  }

  onLoginCallback(result, error) {
    if (error) {
      this.alert('LoginCallback error');
      this.setState({ loaded: true });
    } else if (result) {
      AsyncStorage.setItem(
        'token',
        result.access_token,
        () => UserUtil.getMyProfile(this.onGetProfileCallback.bind(this))
      );
    } else {
      this.setState({ loaded: true });
    }
  }

  onGetProfileCallback(profile, error) {
    if (error) {
      alert(error);
      this.setState({ loaded: true });
    } else if (profile) {
      if (profile.status === 201) {
        Actions.generalInfo({ me: profile });
      } else if (profile.personality.length === 0) {
        Actions.generalInfo({ me: profile });
      } else if (profile.status === 200) {
        Actions.main({ me: profile });
      } else {
        this.setState({ loaded: true });
      }
    } else {
      this.setState({ loaded: true });
    }
  }

  alert(msg) {
    Alert.alert('Login', msg);
  }
}

module.exports = Login;
