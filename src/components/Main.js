import React, { Component } from 'react';
import ErrorUtils from 'ErrorUtils';
import {
  AppState,
  NetInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Activity from './Activity/Activity';
import ChannelList from './Chat/ChannelList';
import MyPage from './MyPage';
import SendBird from 'sendbird';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import TabBar from './Shared/TabBar';
import UserList from './UserList/UserList';

const APP_ID = 'D398BE17-3332-43F7-988D-78B45C3FF9EB';

class Main extends Component {
  constructor(props) {
    super(props);
    new SendBird({
      appId: APP_ID,
    });
  }

  componentDidMount() {
    this.connectSendBird();
  }

  connectSendBird() {
    SendBird().connect(this.props.me._id, function (user, error) {
      if (error) {
        alert(error);
        throw new Error(error);
      }

      SendBird().updateCurrentUserInfo(
        this.props.me.name,
        this.props.me.profile_picture,
        function (response, error) {
          if (error) {
            alert(error);
            throw new Error(error);
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
              Actions.refresh({ title: 'Bridgeme' });
            } else if (obj.i === pageTitle.TOURNAMENT) {
              Actions.refresh({ title: 'Tournament' });
            } else if (obj.i === pageTitle.MYCONNECTION) {
              Actions.refresh({ title: 'My Connection' });
            } else if (obj.i === pageTitle.CHAT) {
              Actions.refresh({ title: 'Chat' });
            } else if (obj.i === pageTitle.MYPROFILE) {
              Actions.refresh({ title: 'My Profile' });
            }
          }}

          tabBarPosition='bottom'
          locked={true}
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
});

module.exports = Main;
