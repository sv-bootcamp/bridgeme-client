import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Connected from './Connected';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';

class Activity extends Component {
  constructor(props) {
    super(props);

    this.state = {
        loaded: false,
        isRefreshing: false,
      };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
      isRefreshing: false,
    });
  }

  render() {
    return (
      <ScrollableTabView
        initialPage={0}
        style={styles.container}
        tabBarTextStyle={styles.tabBarText}
        tabBarInactiveTextColor={'#a6aeae'}
        tabBarActiveTextColor={'#2e3031'}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <Connected tabLabel='CONNECTED' me={this.props.me}/>
        <Connected tabLabel='CONNECTED2'/>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  tabBarText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
  text: {
    color: '#546979',
    paddingHorizontal: 8,
    fontSize: 12,
  },
  loadingText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
});

module.exports = Activity;
