import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  ListView,
} from 'react-native';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import MyProfile from './MyProfile';
import Activity from './Activity/Activity';
import UserList from './UserList/UserList';


class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        style={styles.tab}
        renderTabBar={() => <DefaultTabBar
          activeTextColor='black'
        />}
        tabBarPosition='bottom'
      >
        <UserList tabLabel='Find'>
        </UserList>
        <Activity tabLabel='Activity'>
        </Activity>
        <MyProfile tabLabel='MyProfile'>
        </MyProfile>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  tab: {
    flex: 1,
  },
});

module.exports = Main;
