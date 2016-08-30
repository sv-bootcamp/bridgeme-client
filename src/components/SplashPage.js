
import React, { Component } from 'react';
import {
 AppRegistry,
 Text,
 View,
 Navigator,
} from 'react-native';

class SplashPage extends Component {
  componentWillMount() {
    var navigator = this.props.navigator;

    // Delay 1sec for next screen
    setTimeout(() => {
      navigator.replace({
        id: 'Login',
      });
    }, 1000);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white',
        alignItems: 'center', justifyContent: 'center', }}>
        <Text style={{ color: 'black', fontSize: 32, }}>Splash Screen</Text>
     </View>
   );
  }
}

module.exports = SplashPage;
