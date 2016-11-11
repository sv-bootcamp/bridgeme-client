import React, { Component } from 'react';
import {
  Alert,
  Platform,
  StyleSheet
} from 'react-native';
import Activity from './Activity/Activity';
import ChannelList from './Chat/ChannelList';
import ChatPage from './Chat/ChatPage';
import EvalPage from './Eval/EvalPage';
import FindPassStep1 from './Login/FindPassStep1';
import FindPassStep2 from './Login/FindPassStep2';
import FindPassStep3 from './Login/FindPassStep3';
import GeneralInfo from './SignUp/GeneralInfo';
import Login from './Login/Login';
import Main from './Main';
import MyPage from './MyPage';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import RequestPage from './userProfile/RequestPage';
import RequestSent from './userProfile/RequestSent';
import SignUp from './Login/SignUp';
import SplashPage from './SplashPage';
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
      let scene = App.scene.sceneKey;
      if (scene === 'evalPageMain' ||
          scene === 'main' ||
          scene === 'generalInfo' ||
          scene === 'login'
        ) {
        return true;
      }

      Actions.pop();
      return true;
    };

    return (
      <Router createReducer={reducerCreate} backAndroidHandler={backAndroidHandler}>
        <Scene key="root"
               navigationBarStyle={styles.bar} titleStyle={styles.title}
               rightButtonTextStyle={styles.leftBtn}>
          <Scene key="login" component={Login} initial={true}
                 hideNavBar={true} type={ActionConst.RESET} />

          <Scene key="signUp" component={SignUp} />

          <Scene key="findPassStep1" component={FindPassStep1}
                 hideNavBar={false} title="Forgot Password" />

          <Scene key="findPassStep2" component={FindPassStep2}
                 title="Forgot Password" />

          <Scene key="findPassStep3" component={FindPassStep3} title="Forgot Password"
             />

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
