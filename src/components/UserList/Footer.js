import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

class Footer extends Component {
  render() {
    return <ScrollableTabView
      renderTabBar={() => <DefaultTabBar />}
    >
      <Text tabLabel='Find'></Text>
      <Text tabLabel='Activity'></Text>
      <Text tabLabel='My Profile'></Text>
    </ScrollableTabView>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#dedee0',
  },
});

module.exports = Footer;
