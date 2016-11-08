import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import ExperienceRow from './ExperienceRow';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import UserCareer from './UserCareer';
import UserOverview from './UserOverview';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      profileImage: '../../resources/pattern.png',
      name: '',
      currentStatus: '',
      currentPosition: '',
      currentLocation: '',
      statusAsMentee: '',
      statusAsMentor: '',
      loaded: false,
      evalLoaded: false,
      connectPressed: false,
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {

    // Check result code: profile Request/mentor request
    if (result._id) {
      let currentStatus = this.state.currentStatus;
      let currentPosition = this.state.currentPosition;
      let currentLocation = this.state.currentLocation;

      if (result.work.length > 0) {
        let work = result.work[0];

        if (work.employer) {
          currentStatus = 'at ' + work.employer.name;
        }

        if (work.position) {
          currentPosition = work.position.name;
        }

        if (work.location) {
          currentLocation = work.location.name;
        }
      } else if (result.education.length > 0) {
        let lastIndex = result.education.length - 1;
        let education = result.education[lastIndex];

        if (education.school) {
          currentStatus = 'at ' + education.school.name;
        }

        if (education.concentration.length > 0) {
          currentPosition = education.concentration[0].name;
        }
      }

      let statusAsMentee = this.state.statusAsMentee;
      let statusAsMentor = this.state.statusAsMentor;

      if (result.relation !== undefined) {
        statusAsMentee = result.relation.asMentee;
        statusAsMentor = result.relation.asMentor;
      }

      let image;
      if (result.profile_picture) {
        image = { uri: result.profile_picture };
      } else {
        image = require('../../resources/pattern.png');
      }

      this.setState({
        id: result._id,
        profileImage: image,
        name: result.name,
        currentStatus: currentStatus,
        currentPosition: currentPosition,
        currentLocation: currentLocation,
        loaded: true,
        isRefreshing: false,
        statusAsMentee: statusAsMentee,
        statusAsMentor: statusAsMentor,
      });
    } else if (result.msg !== undefined) {
      this.setState({ evalLoaded: true });
      Actions.evalPageMain({ select: 'mentee' });
    }
  }

  onRequestFail(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

  componentDidMount() {
    ServerUtil.getOthersProfile(this.props._id);
  }

  // Receive props befofe completly changed
  componentWillReceiveProps(props) {
    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

    ServerUtil.getOthersProfile(props._id);
  }

  sendRequest() {
    Actions.requestPage({ id: this.state.id });
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size="large"
      />
    );
  }

  // Render User profile
  renderUserProfile() {
    const connect = () => this.sendRequest();
    let connectButton;
    const ConnectStatus = {
      DISCONNECTED: 0,
      PENDING: 1,
      CONNECTED: 2,
    };

    if (this.state.statusAsMentee === ConnectStatus.CONNECTED
        || this.state.statusAsMentor === ConnectStatus.CONNECTED) {
      connectButton = (
          <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
          <TouchableHighlight>
            <Text style={styles.buttonText}>WAITING...</Text>
          </TouchableHighlight>
          </LinearGradient>
        );
    } else if (this.state.statusAsMentee === ConnectStatus.DISCONNECTED
        && this.state.statusAsMentor === ConnectStatus.DISCONNECTED) {
      connectButton = (
          <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
          <TouchableHighlight onPress={connect}>
            <Text style={styles.buttonText}>CONNECT</Text>
          </TouchableHighlight>
          </LinearGradient>
        );
    } else if (this.state.statusAsMentee === ConnectStatus.PENDING
        || this.state.statusAsMentor === ConnectStatus.PENDING) {
      connectButton = (
          <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
          <TouchableHighlight>
            <Text style={styles.buttonText}>CONNECTED</Text>
          </TouchableHighlight>
          </LinearGradient>
        );
    }

    return (
        <ScrollView>
          <StatusBar
            backgroundColor = "transparent"
            barStyle = "light-content"
            networkActivityIndicatorVisible={false}
          />
          <LinearGradient style={styles.profileImgGradient} start={[0.0, 0.25]} end={[0.5, 1.0]}
            colors={['#546979', '#08233a']}>
            <Image style={styles.profileImage}
              source={this.state.profileImage} />
          </LinearGradient>
          <Image style={styles.bookmarkIcon}
            source={require('../../resources/icon-bookmark.png')}/>
          <View style={styles.profileUserInfo}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.positionText}>
              {this.state.currentPosition} {this.state.currentStatus}
            </Text>
            <Text style={styles.currentLocationText}>{this.state.currentLocation}</Text>
          </View>

          <ScrollableTabView
            initialPage={0}
            tabBarTextStyle={styles.tabBarText}
            tabBarInactiveTextColor={'#a6aeae'}
            tabBarActiveTextColor={'#2e3031'}
            renderTabBar={() => <ScrollableTabBar />}
            >
            <UserOverview tabLabel='OVERVIEW' id={this.props._id}/>
            <UserCareer tabLabel='CAREER' id={this.props._id}/>
          </ScrollableTabView>
          <View style={styles.btn}>
            {connectButton}
          </View>
        </ScrollView>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderUserProfile();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  name: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 22,
    color: '#ffffff',
  },
  positionText: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginTop: 30,
    color: '#ffffff',
  },
  currentLocationText: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginTop: 5,
    color: '#ffffff',
  },
  bookmarkIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 25,
    top: 32,
  },
  profileImage: {
    alignItems: 'stretch',
    opacity: 0.4,
    height: 300,
    width: WIDTH,
  },
  profileImgGradient: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 0.3,
    },
  },
  profileUserInfo: {
    position: 'absolute',
    top: 155,
    marginLeft: 45,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  btn: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  connectBtnStyle: {
    alignItems: 'stretch',
    height: 45,
    left: 0,
    right: 0,
  },
  buttonText: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
    paddingTop: 10,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  tabBarText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

module.exports = UserProfile;
