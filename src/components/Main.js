import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import Activity from './Activity/Activity';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';
import TabBar from './Shared/TabBar';
import MyPage from './MyPage';

class Main extends Component {

  constructor(props) {
    super(props);
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
        <ScrollView tabLabel="ios-chatbubbles" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Messenger</Text>
          </View>
        </ScrollView>

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
