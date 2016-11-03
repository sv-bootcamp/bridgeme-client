import React, { Component } from 'react';
import {
  AppState,
  AsyncStorage,
  NetInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Activity from './Activity/Activity';
import ChannelList from './Chat/ChannelList';
import MyPage from './MyPage';
import SendBird from 'sendbird';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import TabBar from './Shared/TabBar';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';

const APP_ID = 'D1A48349-CBE6-41FF-9FF8-BCAA2A068B05';

class Main extends Component {
  constructor(props) {
    super(props);
    new SendBird({
      appId: APP_ID
    });
  }

  componentDidMount(){
    AsyncStorage.getItem('userInfo', (err, result) => {
      if(err){
        throw new Error(err)
      }
      this.userInfo = JSON.parse(result);
      SendBird().connect(`${this.userInfo._id}`, function (user, error) {
        if(error){
          throw new Error(error)
        }
        SendBird().updateCurrentUserInfo(this.userInfo.name, this.userInfo.profile_picture, function (response, error) {
          if(error){
            throw new Error(error)
          }
        }.bind(this));
      }.bind(this));
    });
  }

  render() {
    return (
        <ScrollableTabView
          initialPage={0}
          tabBarPosition='bottom'
          renderTabBar={() => <TabBar />}
          >
        <UserList tabLabel="ios-home" style={styles.tabView} />
        <ScrollView tabLabel="md-shuffle" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Tournament</Text>
          </View>
        </ScrollView>
        <Activity tabLabel="ios-people" style={styles.tabView} />
        <ChannelList tabLabel="ios-chatbubbles" style={styles.tabView} me={this.props.me} />
        <MyPage tabLabel="md-contact"/>
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
