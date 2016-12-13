import React, { Component } from 'react';
import {
  AppState,
  AsyncStorage,
  Dimensions,
  Image,
  NetInfo,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Activity from './Activity/Activity';
import ChannelList from './Chat/ChannelList';
import Fcm from 'react-native-fcm';
import FcmUtil from '../utils/FcmUtil';
import MyPage from './MyPage';
import SendBird from 'sendbird';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './Shared/TabBar';
import Text from './Shared/UniText';
import UserList from './UserList/UserList';
import UserUtil from '../utils/UserUtil';

const mainPageTitle = {
  DEFAULT: -1,
  HOME: 0,
  TOURNAMENT: 1,
  MYCONNECTION: 2,
  CHAT: 3,
  MYPROFILE: 4,
};

const activityPageTitle = {
  DEFAULT: -1,
  NEWREQUESTS: 0,
  CONNECTED: 1,
};

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMainPage: mainPageTitle.DEFAULT,
      currentActivityPage: activityPageTitle.DEFAULT,
    };

    this.isConnected = false;
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange.bind(this));
    this.initSendBird((user, error)=> {

      if (user.nickname !== this.props.me.name ||
        user.profileUrl !== this.props.me.profile_picture) {

        //Sendbird has an issue in updateCurrentUserInfo() API right after connect() API.
        setTimeout(() => {
          this.sb.updateCurrentUserInfo(this.props.me.name, this.props.me.profile_picture);
        }, 1000);
      }

      NetInfo.isConnected.addEventListener('change', this.onConnectionStateChange.bind(this));

      this.notificationUnsubscribe = Fcm.on('notification', this.onNotificationReceived.bind(this));
      Fcm.getInitialNotification().then((notif) => {
        if (notif) this.actionFromNotification(notif);
      });
    });

  }

  componentWillReceiveProps(nextProps) {
    this.sb.removeChannelHandler('Main');
    this.sb.addChannelHandler('Main', this.ChannelHandler);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change');
    this.notificationUnsubscribe();
  }

  initSendBird(callback) {
    UserUtil.getSendBirdAppId((sendBirdAppIdObject, error) => {
      if (!error) {
        this.sendBirdAppId = sendBirdAppIdObject.key;
        this.connectSendBird(callback);
      } else {
        if (callback) {
          callback(user, error);
        }
      }
    });
  }

  connectSendBird(callback) {
    this.sb = new SendBird({
      appId: this.sendBirdAppId,
    });
    this.sb.connect(this.props.me._id, (user, error) => {
      this.sb.removeChannelHandler('Main');
      this.ChannelHandler = new this.sb.ChannelHandler();
      this.ChannelHandler.onMessageReceived = this.onMainMessageReceived.bind(this);
      this.sb.addChannelHandler('Main', this.ChannelHandler);

      if (callback) {
        callback(user, error);
      }
    });
  }

  onAppStateChange(currentAppState) {
    if (currentAppState === 'active') {
      this.sb.setForegroundState();
    } else if (currentAppState === 'background') {
      this.sb.setBackgroundState();
    }
  }

  onConnectionStateChange(isConnected) {
    this.isConnected = isConnected;
    if (this.isConnected) {
      this.connectSendBird();
    } else {
      SendBird().removeChannelHandler('Main');
      this.sb.disconnect();
    }
  }

  onMainMessageReceived(channel, userMessage) {
    Vibration.vibrate();
    FcmUtil.presentLocalChatNotification(userMessage);
  }

  onNotificationReceived(notif) {
    if (notif.opened_from_tray) {
      this.actionFromNotification(notif);
    }
  }

  actionFromNotification(notif) {
    Actions.main({ me: this.props.me });
    setTimeout(() => {
      if (notif.notificationType === 'MESSAGE') {
        this.changeMainPage(mainPageTitle.CHAT, () => {
          const opponent = JSON.parse(notif.extraData).opponent;
          Actions.chatPage({
            title: opponent.name,
            me: { userId: this.props.me._id },
            opponent,
          });
        });
      } else if (notif.notificationType === 'CONNECTION') {
        this.changeMainPage(
          mainPageTitle.MYCONNECTION, () => this.changeActivityPage(activityPageTitle.CONNECTED));
      } else if (notif.notificationType === 'REQUEST') {
        this.changeMainPage(
          mainPageTitle.MYCONNECTION, () => this.changeActivityPage(activityPageTitle.NEWREQUESTS));
      }
    }, 500);
  }

  changeMainPage(pageTitle, callback) {
    this.setState({ currentMainPage: pageTitle }, () => {
      this.setState({ currentMainPage: mainPageTitle.DEFAULT }, () => {
        if (typeof callback === 'function') callback();
      });
    });
  }

  changeActivityPage(pageTitle, callback) {
    this.setState({ currentActivityPage: pageTitle }, () => {
      this.setState({ currentActivityPage: activityPageTitle.DEFAULT }, () => {
        if (typeof callback === 'function') callback();
      });
    });
  }

  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        page={this.state.currentMainPage}
        onChangeTab={(obj) => {
          this.currentTab = obj.i;
          if (this.currentTab === mainPageTitle.HOME) {
            Actions.refresh({ title: 'Bridge Me', titleStyle: styles.mainTitle });
          } else if (this.currentTab === mainPageTitle.TOURNAMENT) {
            Actions.refresh({ title: 'Tournament', titleStyle: styles.title });
          } else if (this.currentTab === mainPageTitle.MYCONNECTION) {
            Actions.refresh({ title: 'My Connection', titleStyle: styles.title });
          } else if (this.currentTab === mainPageTitle.CHAT) {
            Actions.refresh({ title: 'Chat', titleStyle: styles.title });
          } else if (this.currentTab === mainPageTitle.MYPROFILE) {
            Actions.refresh({ title: 'My Profile', titleStyle: styles.title });
          }
        }}

        tabBarPosition='bottom'
        locked
        scrollWithoutAnimation
        renderTabBar={() => <TabBar />}
      >
        <UserList tabLabel="ios-home" style={styles.tabView} me={this.props.me} />
        <ScrollView tabLabel="md-shuffle" style={styles.tabView}>
          <View style={styles.comingSoonView}>
            <Image source={require('../resources/tournament.png')} />
            <Text style={styles.comingSoonText}>Coming Soon!</Text>
          </View>
        </ScrollView>
        <Activity
          tabLabel="ios-people"
          style={styles.tabView}
          currentActivityPage={this.state.currentActivityPage}
          me={this.props.me}
        />
        <ChannelList tabLabel="ios-chatbubbles" style={styles.tabView} me={this.props.me} />
        <MyPage tabLabel="md-contact" me={this.props.me} />
      </ScrollableTabView>
    );
  }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  comingSoonView: {
    width,
    height: height - 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    marginTop: 12,
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    color: '#a6aeae',
  },
  mainTitle: {
    fontFamily: 'ProductSans-Bold',
    fontSize: 17,
    color: '#2e3031',
  },
  title: {
    fontSize: 16,
    color: '#2e3031',
  },
});

module.exports = Main;
