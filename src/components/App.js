import React, { Component } from 'react';
import { Platform, StyleSheet, Alert } from 'react-native';
import Login from './Login';
import GeneralInfo from './SignUp/GeneralInfo';
import Main from './Main';
import ChannelList from './Chat/ChannelList';
import ChatPage from './Chat/ChatPage';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import Activity from './Activity/Activity';
import EvalPage from './Eval/EvalPage';
import MyPage from './MyPage';
import RequestPage from './userProfile/RequestPage';
import RequestSent from './userProfile/RequestSent';
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

const refreshPreviousSceneOnBack = () => {
  Actions.pop();

  //Delay 10ms to refresh previous scene when current scene is completely popped.
  setTimeout(() => {
    Actions.refresh();
  }, 10);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.scene = null;
  }

  render() {
    let backAndroidHandler = () => {
      if (App.scene.sceneKey === 'evalPageMain' ||
          App.scene.sceneKey === 'main' ||
          App.scene.sceneKey === 'generalInfo') {
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
          <Scene key="login" component={Login}
            initial={true} hideNavBar={true} type={ActionConst.RESET} />

          <Scene key="generalInfo" component={GeneralInfo} title="General Info"
            hideNavBar={false} type={ActionConst.RESET} />

          {/* The right button(filter) function will be added later */}
          <Scene key="main" component={Main} title="Bridgeme" rightTitle="right"
            rightButtonTextStyle={{ color: 'transparent' }}
            rightButtonIconStyle={{ marginBottom: 13, marginRight: 6 }}
            onRight={()=>Alert.alert('Filtering service will come soon')
            }
            rightButtonImage={require('../resources/filter.png')}
            hideNavBar={false} type={ActionConst.RESET}/>
          <Scene key="userList" component={UserList} />
          <Scene key='myPage' component={MyPage}/>
          <Scene key="userProfile" component={UserProfile} hideBackImage={false}
            backButtonImage={require('../resources/icon-arrow-left-white.png')}
            navigationBarStyle={{ backgroundColor: 'transparent',
              borderBottomColor: 'transparent', }}/>
          <Scene key="requestPage" component={RequestPage} title='Request Connection'
            backButtonImage={require('../resources/icon-cancel.png')}/>
          <Scene key="requestSent" component={RequestSent} title='Request Sent'
          hideBackImage={true} type={ActionConst.REPLACE}/>
          <Scene key="activity" component={Activity} />
          <Scene key="chatPage" onBack={refreshPreviousSceneOnBack} component={ChatPage} />
          <Scene key="channelList" component={ChannelList} />
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
