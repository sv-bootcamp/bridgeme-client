import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Activity from './Activity/Activity';
import ChannelList from './Chat/ChannelList';
import MyPage from './MyPage';
import SendBird from 'sendbird';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import TabBar from './Shared/TabBar';
import Text from './Shared/UniText';
import UserList from './UserList/UserList';
import UserUtil from '../utils/UserUtil';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initSendBird();
  }

  initSendBird() {
    UserUtil.getSendBirdAppId((appId, error) => {
      if (error) {
        AsyncStorage.getItem('sendBirdAppId', (err, result) => {
          this.connectSendBird(result);
        });
      } else {
        AsyncStorage.setItem('sendBirdAppId', appId.key, () => {
          this.connectSendBird(appId.key);
        });
      }
    });
  }

  connectSendBird(appID) {
    new SendBird({
      appId: appID,
    });

    SendBird().connect(this.props.me._id, function (user, error) {
      if (error) {
        alert(JSON.stringify(error));
      }

      SendBird().updateCurrentUserInfo(
        this.props.me.name,
        this.props.me.profile_picture,
        function (response, error) {
          if (error) {
            alert(JSON.stringify(error));
          }
        }.bind(this));
    }.bind(this));
  }

  render() {
    const pageTitle = {
      HOME: 0,
      TOURNAMENT: 1,
      MYCONNECTION: 2,
      CHAT: 3,
      MYPROFILE: 4,
    };

    return (
        <ScrollableTabView
          initialPage={0}
          onChangeTab={(obj) => {
            if (obj.i === pageTitle.HOME) {
              Actions.refresh({ title: 'Bridge Me', titleStyle: styles.mainTitle, });
            } else if (obj.i === pageTitle.TOURNAMENT) {
              Actions.refresh({ title: 'Tournament', titleStyle: styles.title, });
            } else if (obj.i === pageTitle.MYCONNECTION) {
              Actions.refresh({ title: 'My Connection', titleStyle: styles.title, });
            } else if (obj.i === pageTitle.CHAT) {
              Actions.refresh({ title: 'Chat', titleStyle: styles.title, });
            } else if (obj.i === pageTitle.MYPROFILE) {
              Actions.refresh({ title: 'My Profile', titleStyle: styles.title, });
            }
          }}

          tabBarPosition='bottom'
          locked={true}
          scrollWithoutAnimation={true}
          renderTabBar={() => <TabBar />}
        >
          <UserList tabLabel="ios-home" style={styles.tabView} />
          <ScrollView tabLabel="md-shuffle" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Tournament</Text>
            </View>
          </ScrollView>
          <Activity tabLabel="ios-people" style={styles.tabView}  me={this.props.me} />
          <ChannelList tabLabel="ios-chatbubbles" style={styles.tabView} me={this.props.me} />
          <MyPage tabLabel="md-contact" me={this.props.me} />
      </ScrollableTabView>
    );
  }
}

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
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
