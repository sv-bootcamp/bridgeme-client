import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Navigator,
    TouchableOpacity,
    Text,
} from 'react-native';

import SplashPage from './SplashPage';
import Login from './Login';
import Main from './Main';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import {
  Router,
  Scene,
  Actions,
} from 'react-native-router-flux';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isAndroid = false;

    // Platform verification
    if (Platform.OS === 'android') {
      isAndroid = true;
    }

    return (
      <Router>
        <Scene key="root">
          <Scene key="splashPage" component={SplashPage} hideNavBar={true} initial={isAndroid} />
          <Scene key="login" component={Login} initial={!isAndroid} hideNavBar={true}/>
          <Scene key="main" component={Main} title="All Lists" hideNavBar={false}/>
          <Scene key="userList" component={UserList} />
          <Scene key="userProfile" component={UserProfile} title="User Profile" />
        </Scene>
      </Router>
   );
  }
}

module.exports = App;
