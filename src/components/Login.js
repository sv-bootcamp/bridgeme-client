import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../utils/ErrorMeta';
import LoginUtil from '../utils/LoginUtil';
import ServerUtil from '../utils/ServerUtil';

class Login extends Component {
  constructor(props) {
    super(props);

    let onLoginSuccess = (result) => this.onLoginSuccess(result);
    let onServerFail = (error) => this.onServerFail(error);
    let onServerSuccess = (profile) => this.onServerSuccess(profile);

    LoginUtil.initCallback(onLoginSuccess, onServerFail);
    ServerUtil.initCallback(onServerSuccess, onServerFail);

    this.state = {
      loaded: false,
    };
  }

  render() {
    return this.state.loaded ? this.renderLoginView() : this.renderLoadingView();
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

  renderLoginView() {
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
      </View>
    );
  }

  componentDidMount() {
    LoginUtil.hasToken();
  }

  onLoginSuccess(result) {
    if (result) {
      ServerUtil.getMyProfile();
      return;
    }

    // If there is no token...
    this.setState({ loaded: !this.state.loaded });
  }

  onLoginFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }

    this.setState({ loaded: true });
  }

  onServerSuccess(myProflile) {
    Actions.generalInfo({ me: myProflile });
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
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#0e417a',
  },
});

module.exports = Login;
