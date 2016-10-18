import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import SplashPage from './SplashPage';
import Login from './Login';
import GeneralInfo from './SignUp/GeneralInfo';
import Main from './Main';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import Activity from './Activity/Activity';
import EvalPage from './Eval/EvalPage';
import {
  ActionConst,
  Actions,
  Router,
  Reducer,
  Scene,
} from 'react-native-router-flux';

// Define reducer to manage scenes
const reducerCreate = params=> {
  const defaultReducer = Reducer(params);
  return (state, action)=> {
      if (action.scene) {
        App.scene = action.scene;
      }

      return defaultReducer(state, action);
    };
};

class App extends Component {

  constructor(props) {
    super(props);
    this.scene = null;
  }

  render() {

    // Platform verification
    let isAndroid = (Platform.OS === 'android');

    let backAndroidHandler = () => {
      if (App.scene.sceneKey === 'evalPageMain' || App.scene.sceneKey == 'main') {
        return true;
      } else if (App.scene.sceneKey === 'generalInfo') {
        return true;
      } else {
        Actions.pop();
        return true;
      }
    };

    return (
      <Router createReducer={reducerCreate} backAndroidHandler={backAndroidHandler}>
        <Scene key="root"
               titleStyle={styles.title} rightButtonTextStyle={styles.leftBtn}
               navigationBarStyle={styles.bar}>
          <Scene key="splashPage" component={SplashPage}
            hideNavBar={true} type={ActionConst.RESET} />

          <Scene key="login" component={Login}
            initial={!isAndroid} hideNavBar={true} type={ActionConst.RESET} />

          <Scene key="generalInfo" component={GeneralInfo} title="General Info"
            initial={isAndroid} hideNavBar={false} type={ActionConst.RESET}
            rightTitle="Edit" onRight={()=>alert('Edit!')} />

          <Scene key="main" component={Main} title="All Lists"
            hideNavBar={false} type={ActionConst.RESET} />

          <Scene key="userList" component={UserList} />

          <Scene key="userProfile" component={UserProfile}
            title="User Profile" />

          <Scene key="activity" component={Activity} />

          <Scene key="evalPageMain" component={EvalPage} hideBackImage={true} panHandlers={null}
            onBack={() => false} title="Survey" hideNavBar={false} />

          <Scene key="evalPage" component={EvalPage}
            title="Survey" hideNavBar={false} />
        </Scene>
      </Router>
   );
  }
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#fafafa',
    borderBottomColor: '#d6dada',
  },

  title: {
    fontSize: 16,
    color: '#2e3031',
  },

  leftBtn: {
    fontSize: 16,
    color: '#557bfc',
  },
});

module.exports = App;
