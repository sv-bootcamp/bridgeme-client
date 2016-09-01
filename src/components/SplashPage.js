
import React, { Component } from 'react';
import {
 StyleSheet,
 Text,
 View,
 Navigator,
 Image,
} from 'react-native';

class SplashPage extends Component {
  componentWillMount() {
    let navigator = this.props.navigator;

    // Delay 1sec for next screen
    setTimeout(() => {
      navigator.replace({
        id: 'Login',
      });
    }, 1500);
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
