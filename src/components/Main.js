import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Activity from './Activity/Activity';
import UserList from './UserList/UserList';
import UserProfile from './userProfile/UserProfile';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let TabBar = () => <DefaultTabBar activeTextColor='#546979'
                                        tabBarBackgroundColor='#f6f7f9' />;
    return (
        <ScrollableTabView style={styles.tab}
                           renderTabBar={TabBar}
                           tabBarPosition='bottom'>
          <UserList tabLabel='Find'></UserList>
          <Activity tabLabel='Activity'></Activity>
          <UserProfile tabLabel='MyProfile' myProfile={true}></UserProfile>
        </ScrollableTabView>
      );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
  },
});

module.exports = Main;
