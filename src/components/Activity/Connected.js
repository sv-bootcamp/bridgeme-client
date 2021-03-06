import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import MatchUtil from '../../utils/MatchUtil';
import ConnectedRow from './ConnectedRow';
import Text from '../Shared/UniText';

class Connected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      isRefreshing: false,
      isEmpty: false,
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      this.onRequestSuccess(result);
    }
  }

  onRequestSuccess(result) {
    const REQUESTED_ACCEPT = 1;

    this.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    });

    // Collect connected objects by user and mentor
    let connected = result.accepted;
    connected = connected.map((value) => value.detail[0]);

    let connectByMentor = result.requested.filter(
       (value) => value.status === REQUESTED_ACCEPT);
    connectByMentor = connectByMentor.map((value) => value.detail[0]);

    connected = connected.concat(connectByMentor);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(connected),
      loaded: true,
      isRefreshing: false,
      isEmpty: connected.length === 0,
    });
  }

  componentDidMount() {
    MatchUtil.getActivityList(this.onRequestCallback.bind(this));
  }

  // Receive props befofe completely changed
  componentWillReceiveProps(props) {
    MatchUtil.getActivityList(this.onRequestCallback.bind(this));
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='small'
      />
    );
  }

  renderRow(rowData) {
    return <ConnectedRow dataSource={rowData} me={this.props.me}/>;
  }

  renderConnected() {
    if (this.state.isEmpty)
      return (
        <View style={styles.container}>
          <Image source={require('../../resources/chat_onboarding.png')}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Make a connection!</Text>
            <Text style={{ color: '#a6aeae', fontSize: dimensions.fontWeight * 14, }}>
              You did not connect with anyone yet.
            </Text>
          </View>
        </View>
      );
    else {
      return (
        <ListView
          style={styles.listView}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
      );
    }
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderConnected();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  listView: {
    flex: 1,
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#efeff2',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionName: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: dimensions.heightWeight * 62,
  },
  title: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 20,
    textAlign: 'center',
    marginBottom: dimensions.heightWeight * 10,
  },
});

module.exports = Connected;
