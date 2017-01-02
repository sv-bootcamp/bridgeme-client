import React, { Component } from 'react';
import {
  AppState,
  Image,
  InteractionManager,
  NetInfo,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from './Shared/Dimensions';
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
    this.initSendBird((user, error) => {
      if (user.nickname !== this.props.me.name ||
          user.profileUrl !== this.props.me.profile_picture) {

        // Sendbird has an issue in updateCurrentUserInfo() API right after connect() API.
        setTimeout(() => {
          this.sb.updateCurrentUserInfo(this.props.me.name, this.props.me.profile_picture);
        }, 1000);
      }

      NetInfo.isConnected.addEventListener('change', this.onConnectionStateChange.bind(this));

      this.notificationUnsubscribe = Fcm.on('notification', this.onNotificationReceived.bind(this));

      InteractionManager.runAfterInteractions(() => {
        Fcm.getInitialNotification().then((notif) => {
          if (notif) this.actionFromNotification(notif, 'getInitialNotification');
        });
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
          callback(null, error);
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
    FcmUtil.presentLocalChatNotification(userMessage);
  }

  onNotificationReceived(notif) {
    if (notif.opened_from_tray) {
      this.actionFromNotification(notif, 'onNotificationReceived');
    }
  }

  actionFromNotification(notif, from) {
    Actions.popTo('main');

    InteractionManager.runAfterInteractions(() => {
      if (notif.notificationType === 'MESSAGE') {
        this.changeMainPage(mainPageTitle.CHAT, () => {
          if (from === 'onNotificationReceived') {
            InteractionManager.runAfterInteractions(() => {
              const opponent = JSON.parse(notif.extraData).opponent;
              Actions.chatPage({
                title: opponent.name,
                me: { userId: this.props.me._id },
                opponent,
              });
            });
          }
        });
      } else if (notif.notificationType === 'CONNECTION') {
        this.changeMainPage(
          mainPageTitle.MYCONNECTION, () => this.changeActivityPage(activityPageTitle.CONNECTED));
      } else if (notif.notificationType === 'REQUEST') {
        this.changeMainPage(
          mainPageTitle.MYCONNECTION,
          () => this.changeActivityPage(activityPageTitle.NEWREQUESTS));
      }
    });
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
            Actions.refresh({
              title: 'Bridge Me',
              titleStyle: styles.mainTitle,
              rightButtonImage: require('../resources/filter.png'),
              onRight: () => Actions.filter(),
            });
          } else if (this.currentTab === mainPageTitle.TOURNAMENT) {
            Actions.refresh({
              title: 'Tournament',
              titleStyle: styles.title,
              rightButtonImage: null,
              onRight: () => {},
            });
          } else if (this.currentTab === mainPageTitle.MYCONNECTION) {
            Actions.refresh({
              title: 'My Connection',
              titleStyle: styles.title,
              rightButtonImage: null,
              onRight: () => {},
            });
          } else if (this.currentTab === mainPageTitle.CHAT) {
            Actions.refresh({
              title: 'Chat',
              titleStyle: styles.title,
              rightButtonImage: null,
              onRight: () => {},
            });
          } else if (this.currentTab === mainPageTitle.MYPROFILE) {
            Actions.refresh({
              title: 'My Profile',
              titleStyle: styles.title,
              rightButtonImage: null,
              onRight: () => {},
            });
          }
        }
        }
        tabBarPosition="bottom"
        locked
        scrollWithoutAnimation
        renderTabBar={() => <TabBar />}
      >
        <UserList
          tabLabel="ios-home"
          style={styles.tabView}
          me={this.props.me}
        />
        <View tabLabel="md-shuffle" style={styles.comingSoonView}>
          <Image source={require('../resources/tournament.png')} />
          <Text style={styles.comingSoonText}>Coming Soon!</Text>
        </View>
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

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    paddingVertical: dimensions.heightWeight * 10,
    paddingHorizontal: dimensions.widthWeight * 10,
    backgroundColor: '#fafafa',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.1)',
    marginTop: dimensions.heightWeight * 5,
    marginBottom: dimensions.heightWeight * 5,
    marginLeft: dimensions.widthWeight * 5,
    marginRight: dimensions.widthWeight * 5,
    height: dimensions.heightWeight * 150,
    paddingVertical: dimensions.heightWeight * 15,
    paddingHorizontal: dimensions.widthWeight * 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  comingSoonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    marginTop: dimensions.heightWeight * 12,
    fontFamily: 'SFUIText-Regular',
    fontSize: dimensions.fontWeight * 14,
    color: '#a6aeae',
  },
  mainTitle: {
    fontFamily: 'ProductSans-Bold',
    fontSize: dimensions.fontWeight * 17,
    color: '#2e3031',
  },
  title: {
    fontSize: dimensions.fontWeight * 16,
    color: '#2e3031',
  },
});

module.exports = Main;
