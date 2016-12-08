import React, { Component } from 'react';
import {
  Alert,
  Animated,
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Text from '../Shared/UniText';
import UserCareer from './UserCareer';
import UserOverview from './UserOverview';
import UserUtil from '../../utils/UserUtil';

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
      isAboutDisplayed: false,
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
    };
  }

  onReqestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      this.onRequestSuccess(result);
    }
  }

  onRequestSuccess(result) {

    // Check result code: profile Request/mentor request
    if (result._id) {
      let currentStatus = this.state.currentStatus;
      let currentPosition = this.state.currentPosition;
      let currentLocation = this.state.currentLocation;

      if (result.experience.length > 0) {
        let experience = result.experience[0];

        if (experience.employer) {
          currentStatus = 'at ' + experience.employer.name;
        }

        if (experience.position) {
          currentPosition = experience.position.name;
        }

        if (experience.location) {
          currentLocation = experience.location.name;
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
        about: result.about,
      });
    } else if (result.msg !== undefined) {
      this.setState({ evalLoaded: true });
      Actions.evalPageMain({ select: 'mentee' });
    }
  }

  componentDidMount() {
    if (this.props.myProfile) {
      UserUtil.getMyProfile(this.onReqestCallback.bind(this));
    } else {
      UserUtil.getOthersProfile(this.onReqestCallback.bind(this), this.props._id);
    }

  }

  // Receive props befofe completly changed
  componentWillReceiveProps(props) {
    if (props.myProfile) {
      UserUtil.getMyProfile(this.onReqestCallback.bind(this));
    } else {
      UserUtil.getOthersProfile(this.onReqestCallback.bind(this), this.props._id);
    }
  }

  sendRequest() {
    Actions.requestPage({ id: this.state.id });
  }

  toggleAbout() {
    if (this.state.isAboutDisplayed) {
      this.shrink();
      Actions.refresh({ hideNavBar: false });
      this.setState({ isAboutDisplayed: false, width: 0, height: 0 });
    } else {
      this.grow();
      Actions.refresh({ hideNavBar: true });
      this.setState({ isAboutDisplayed: true, width: WIDTH, height: HEIGHT });
    }
  }

  grow() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
        }
      ).start(),
    ]);
  }

  shrink() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
        }
      ).start(),
    ]);
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

  // Render User profile
  renderUserProfile() {
    const connect = () => this.sendRequest();
    let connectButton;
    let connectBtnText = '';
    const ConnectStatus = {
      DISCONNECTED: 0,
      PENDING: 1,
      CONNECTED: 2,
    };

    if (this.state.statusAsMentee === ConnectStatus.CONNECTED
        || this.state.statusAsMentor === ConnectStatus.CONNECTED) {
      connectBtnText = 'WAITING...';
    } else if (this.state.statusAsMentee === ConnectStatus.DISCONNECTED
        && this.state.statusAsMentor === ConnectStatus.DISCONNECTED) {
      connectBtnText = 'CONNECT';
    } else if (this.state.statusAsMentee === ConnectStatus.PENDING
            || this.state.statusAsMentor === ConnectStatus.PENDING) {
      connectBtnText = 'CONNECTED';
    }

    if (connectBtnText !== '') {
      connectButton = (
        <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
          locations={[0, 0.75]}
          colors={['#07e4dd', '#44acff']}>
          <TouchableOpacity onPress={connect}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{connectBtnText}</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      );
    }

    let about = null;

    if (this.state.isAboutDisplayed) {
      about = (
        <Animated.View style={[styles.aboutDetail, {
              width: this.state.width,
              height: this.state.height,
              opacity: this.state.opacity,
            },
            ]}>
          <View style={styles.aboutDetailContainer}>
            <Text style={styles.aboutDetailTitle}>About</Text>
            <Text style={styles.aboutDetailContent}>{this.state.about}</Text>
          </View>
          <TouchableOpacity onPress={this.toggleAbout.bind(this)}>
            <Image style={styles.cancelButton}
                   source={require('../../resources/cancel-icon.png')}/>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <View style={{
        justifyContent: 'space-between',
        flexDirection: 'column',
        flex: 1,
      }}>
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
            tabBarUnderlineStyle={styles.tabBarUnderline}
            renderTabBar={() => <ScrollableTabBar/>}
          >
            <UserOverview tabLabel='OVERVIEW' id={this.state.id}
                          toggleAbout={this.toggleAbout.bind(this)}/>
            <UserCareer tabLabel='CAREER' id={this.state.id}/>
          </ScrollableTabView>
        </ScrollView>
        <View style={styles.btn}>
          {connectButton}
        </View>
        {about}
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  positionText: {
    fontSize: 14,
    marginTop: 30,
    color: '#ffffff',
  },
  currentLocationText: {
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
  buttonContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonText: {
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
    fontFamily: 'SFUIText-Bold',
    fontSize: 12,
  },
  tabBarUnderline: {
    backgroundColor: '#44acff',
    borderBottomColor: '#44acff',
    height: 2,
    width: WIDTH / 12.5,
    marginLeft: WIDTH / 12,
  },
  aboutDetail: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
  },
  aboutDetailContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    marginTop: 150,
    marginLeft: 50,
    marginRight: 50,
  },
  aboutDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  aboutDetailContent: {
    color: 'white',
    paddingTop: 10,
    fontSize: 14,
  },
  cancelButton: {
    alignSelf: 'center',
    marginBottom: 70,
  },
});

module.exports = UserProfile;
