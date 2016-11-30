import React, { Component } from 'react';
import {
  ActivityIndicator,
  AppState,
  AsyncStorage,
  Image,
  ListView,
  NetInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import Row from './Row';
import SendBird from 'sendbird';

///Todo : Implement Sort by Alphabet & Latest Action in iOS native.
class ChannelList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      me: props.me,
      dataSource: this.ds.cloneWithRows([]),
      loaded: false,
      channelList: [],
    };
    this.isConnected = false;
    this.sb = SendBird();
    this.ChannelHandler = new this.sb.ChannelHandler();
    this.ChannelHandler.onMessageReceived = this.onMessageReceived.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.initChannelList();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange.bind(this));
    NetInfo.isConnected.addEventListener('change', this.onConnectionStateChange.bind(this));
  }

  connectSendBird() {
    SendBird().connect(this.state.me._id, function (user, error) {
      if (error) {
        alert('Fail to connect SendBird.');
        throw new Error(error);
      }

      this.initChannelList();
    }.bind(this));
  }

  onAppStateChange(state) {
    if (state === 'active') {
      if (this.isConnected) {
        this.connectSendBird();
      }
    } else {
      this.sb.removeChannelHandler('ChannelList');
      SendBird().disconnect();
    }
  }

  onConnectionStateChange(isConnected) {
    this.isConnected = isConnected;
    if (this.isConnected) {
      this.connectSendBird();
    } else {
      this.sb.removeChannelHandler('ChannelList');
      SendBird().disconnect();
    }
  }

  onMessageReceived(channel, userMessage) {
    this.initChannelList();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change');
  }

  initChannelList() {
    if (SendBird().getConnectionState() === 'OPEN') {
      const channelListQuery = SendBird().GroupChannel.createMyGroupChannelListQuery();
      channelListQuery.includeEmpty = true;
      this.sb.addChannelHandler('ChannelList', this.ChannelHandler);

      if (channelListQuery.hasNext) {
        channelListQuery.next(function (channelList, error) {
          if (error) {
            alert(error);
            throw new Error();
          } else {
            this.setState({
              channelList: channelList,
              dataSource: this.ds.cloneWithRows(channelList),
              loaded: true,
            });
          }
        }.bind(this));
      }
    }
  }

  renderRow(rowData) {
    return (
      <Row
        myId={this.state.me._id}
        dataSource={rowData}
      />
    );
  }

  renderSearchBar() {

    ///Todo : Complete Search bar and sort list.
    return (
      <View style={styles.searchBarContainer}>
        <TextInput
          ref='input'
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          onChange={this.onSearchChange}
          placeholder='Search people'
          placeholderTextColor='#c6cbcc'
          style={styles.searchBarInput}
          underlineColorAndroid='transparent'
        />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.ViewContainer}>
        <View style={styles.loadingViewheader}>
          <Text style={styles.loadingViewheaderText}>Loading...</Text>
          <ActivityIndicator
            animating={true}
            style={[styles.loadingViewActivityIndicator]}
            size='large'
          />
        </View>
      </View>
    );
  }

  renderOnboardingView() {
    return (
      <View style={styles.ViewContainer}>
        <View style={styles.onboardingView}>

          <Image
            style={styles.onboardingImage}
            source={require('../../resources/chat_onboarding.png')}
          />
          <Text style={styles.onboardingText1}>Make a chat!</Text>
          <Text style={styles.onboardingText2}>You did not chat with anyone yet.</Text>
        </View>
      </View>
    );
  }

  renderListView() {
    return (
      <View style={styles.ViewContainer}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderHeader={null}
          enableEmptySections={true}
        />
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      if (this.state.channelList.length == 0) {
        return this.renderOnboardingView();
      }

      return this.renderListView();
    }
  }
}

const styles = StyleSheet.create({
  loadingViewheader: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 250,
  },
  loadingViewheaderText: {
    fontSize: 20,
    color: '#0e417a',
  },
  loadingViewActivityIndicator: {
    marginTop: 30,
  },
  ViewContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  searchBarContainer: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efeff2',
    flexDirection: 'row',
  },
  searchBarInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    paddingTop: 0,
    fontSize: 12,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    textDecorationLine: 'none',
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
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
  },

  onboardingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingImage: {
    width: 210,
    height: 210,
  },
  onboardingText1: {
    marginTop: 62,
    fontSize: 20,
    color: '#a6aeae',
  },
  onboardingText2: {
    marginTop: 15,
    fontSize: 14,
    color: '#a6aeae',
  },
});

module.exports = ChannelList;
