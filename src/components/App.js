import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Navigator,
} from 'react-native';

import SplashPage from './SplashPage';
import Login from './Login';
import UserList from './UserList/UserList';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let initialPage = 'SplashPage';

    // Platform verification
    if (Platform.OS === 'ios') {
      initialPage = 'UserList';
    }

    return (
    <Navigator
      initialRoute={{ id: initialPage, name: 'Index' }}
      renderScene={this.renderScene.bind(this)}
      configureScene={(route) => {
        if (route.sceneConfig) {
          return route.sceneConfig;
        }

        return Navigator.SceneConfigs.FloatFromRight;
      }}/>
   );
  }

  // Register route
  renderScene(route, navigator) {
    var routeId = route.id;

    if (routeId === 'SplashPage') {
      return (<SplashPage navigator={navigator}/>);
    }

    if (routeId === 'Login') {
      return (<Login navigator={navigator}/>);
    }

    if (routeId === 'UserList') {
      return (<UserList navigator={navigator}/>);
    }

    return this.noRoute(navigator);
  }

  // Handle unregisterd route
  noRoute(navigator) {
    return (
      <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => navigator.pop()}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>No specific route exsist</Text>
      </TouchableOpacity>
    </View>
  );
  }
}

module.exports = App;
