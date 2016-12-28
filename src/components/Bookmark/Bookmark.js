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
import UserUtil from '../../utils/UserUtil';
import Row from './Row';
import Text from '../Shared/UniText';

class Bookmark extends Component {
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
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result),
      loaded: true,
      isRefreshing: false,
      isEmpty: connected.length === 0,
    });
  }
  
  componentDidMount() {
    UserUtil.getBookmarkList(this.onRequestCallback.bind(this));
  }
  
  // Receive props befofe completely changed
  componentWillReceiveProps(props) {
    UserUtil.getBookmarkList(this.onRequestCallback.bind(this));
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
    return <Row dataSource={rowData} me={this.props.me}/>;
  }
  
  renderConnected() {
    if (this.state.isEmpty)
      return (
        <View style={styles.container}>
          <Image source={require('../../resources/chat_onboarding.png')}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Make a connection!</Text>
            <Text style={{ color: '#a6aeae', fontSize: 14, }}>
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
    padding: 20,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 62,
  },
  title: {
    color: '#a6aeae',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
});

module.exports = Bookmark;
