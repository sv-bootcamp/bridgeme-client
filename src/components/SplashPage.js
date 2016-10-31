import React, { Component } from 'react';
import {
 Image,
 Navigator,
 StyleSheet,
 Text,
 View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../utils/ErrorMeta';
import LoginUtil from '../utils/LoginUtil';

class SplashPage extends Component {
  constructor(props) {
    super(props);

    LoginUtil.initCallback(
      (result) => this.onServerSuccess(result),
      (error) => this.onServerFail(error)
    );
  }

  componentWillMount() {
    LoginUtil.hasToken();

  }

  // Token already exists on the server
  onServerSuccess(result) {
    Actions.login();
  }

  // If the token is not validate and has an error
  onServerFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(JSON.stringify(error.msg));
    }
    Actions.login();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.splashImg}
          source={require('../resources/splash_icon_1x.png')} />
      </View>
   );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  splashImg: {
    flex: 1,
    resizeMode: 'contain',
  },
});

module.exports = SplashPage;
