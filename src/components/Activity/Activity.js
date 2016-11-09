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
import Row from './Row';
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
        tabBarTextStyle={styles.tabBarText}
        tabBarInactiveTextColor={'#a6aeae'}
        tabBarActiveTextColor={'#2e3031'}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <Connected tabLabel='CONNECTED' id={this.props._id}/>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabBarText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listView: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
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
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 55,
  },
  loadingText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
});

module.exports = Activity;
