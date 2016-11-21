import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Connected from './Connected';
import NewRequests from './NewRequests';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

class Activity extends Component {
  constructor(props) {
    super(props);

    // TODO: isRefreshing is for refresh control will be added shortly
    this.state = {
        isRefreshing: false,
      };
  }

  componentDidMount() {
    this.setState({
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
        tabBarUnderlineStyle={styles.tabBarUnderline}
        renderTabBar={() => <ScrollableTabBar />}
      >
        <NewRequests tabLabel='NEW REQUESTS'/>
        <Connected tabLabel='CONNECTED' me={this.props.me}/>
      </ScrollableTabView>
    );
  }
}

const WIDTH = Dimensions.get('window').width;
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
  tabBarUnderline: {
    backgroundColor: '#44acff',
    borderBottomColor: '#44acff',
    height: 2,
    width: WIDTH / 12.5,
    marginLeft: WIDTH / 8,
  },
});

module.exports = Activity;
