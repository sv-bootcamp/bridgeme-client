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
      <Text tabLabel='Find'>My</Text>
      <Text tabLabel='Activity'>favorite</Text>
      <Text tabLabel='My Profile'>project</Text>
    </ScrollableTabView>;
  }
}

const styles = StyleSheet.create({
});

module.exports = Footer;
