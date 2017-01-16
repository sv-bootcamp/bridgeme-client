import React, { Component } from 'react';
import {
  Alert,
  Animated,
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DefaultTabBar from '../Activity/DefaultTabBar';
import Text from '../Shared/UniText';
import UserCareer from './UserCareer';
import UserOverview from './UserOverview';
import UserUtil from '../../utils/UserUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import PatternBackground from '../../resources/pattern.png';
import CancelIcon from '../../resources/cancel-icon.png';
import BookmarkWhite from '../../resources/icon-bookmark.png';
import BookmarkGrey from '../../resources/icon-bookmark-grey.png';
import BookmarkFill from '../../resources/icon-bookmark-fill.png';
import ArrowLeftWhite from '../../resources/icon-arrow-left-white.png';
import ArrowLeftGrey from '../../resources/icon-arrow-left-grey.png';

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      profileImage: '',
      name: '',
      currentStatus: '',
      currentLocation: '',
      statusAsMentee: '',
      statusAsMentor: '',
      loaded: false,
      navBarFlag: false,
      isAboutDisplayed: false,
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
      activeNavigationBar: false,
      bookmarked: false,
      tabIndex: 0,
    };
  }

  getProfileImage(status) {
    if (!status.profile_picture) {
      return PatternBackground;
    }

    if (status.profile_picture_large) {
      return { uri: status.profile_picture_large };
    }

    return { uri: status.profile_picture };
  }

  getCurrentStatus(status) {
    let currentTask;
    let location;

    if (status.experience.length > 0) {
      location = status.experience[0].employer.name;
      if (status.experience[0].position) {
        currentTask = status.experience[0].position.name;
      } else {
        return location;
      }

      return currentTask + ' at ' + location;
    } else if (status.education.length > 0) {
      const lastIndex = status.education.length - 1;
      const education = status.education[lastIndex];

      if (education.school) {
        location = education.school.name;
        if (education.concentration.length > 0) {
          currentTask = education.concentration[0].name;
        } else {
          return location;
        }

        return currentTask + ' at ' + location;
      }
    }

    return 'No current status';
  }

  getCurrentLocation(status) {
    return status.location || '';
  }

  onRequestSuccess(result) {
    // Check result code: profile Request/mentor request
    if (result._id) {
      let statusAsMentee = this.state.statusAsMentee;
      let statusAsMentor = this.state.statusAsMentor;

      if (result.relation !== undefined) {
        statusAsMentee = result.relation.asMentee;
        statusAsMentor = result.relation.asMentor;
      }

      this.setState({
        id: result._id,
        profileImage: this.getProfileImage(result),
        name: result.name,
        currentStatus: this.getCurrentStatus(result),
        currentLocation: this.getCurrentLocation(result),
        about: result.about,
        expertise: result.expertise,
        personality: result.personality,
        education: result.education,
        experience: result.experience,
        loaded: true,
        statusAsMentee,
        statusAsMentor,
        bookmarked: result.bookmarked,
      });
    }
  }

  onReqestCallback(result, error) {
    if (error) {
      Alert.alert('UserProfile', error);
    } else if (result) {
      this.onRequestSuccess(result);
    }
  }

  componentDidMount() {
    if (this.props.myProfile) {
      UserUtil.getMyProfile(this.onReqestCallback.bind(this));
    } else {
      UserUtil.getOthersProfile(this.onReqestCallback.bind(this), this.props._id);
    }
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
        { toValue: 1 },
      ).start(),
    ]);
  }

  shrink() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        { toValue: 0 },
      ).start(),
    ]);
  }

  getConnectButtonText() {
    let connectBtnText = '';
    const ConnectStatus = {
      DISCONNECTED: 0,
      PENDING: 1,
      CONNECTED: 2,
    };

    if (this.state.statusAsMentee === ConnectStatus.CONNECTED
        || this.state.statusAsMentor === ConnectStatus.CONNECTED) {
      connectBtnText = 'WAITING';
    } else if (this.state.statusAsMentee === ConnectStatus.DISCONNECTED
        && this.state.statusAsMentor === ConnectStatus.DISCONNECTED) {
      connectBtnText = 'CONNECT';
    } else if (this.state.statusAsMentee === ConnectStatus.PENDING
            || this.state.statusAsMentor === ConnectStatus.PENDING) {
      connectBtnText = 'CONNECTED';
    }

    return connectBtnText;
  }

  sendRequest() {
    Actions.requestPage({ id: this.state.id, me: this.props.me });
  }

  getConnectButton() {
    const connect = () => this.sendRequest();
    const connectBtnText = this.getConnectButtonText();
    let ConnectButton = null;

    if (connectBtnText !== '') {
      ConnectButton = (
        <LinearGradient
          style={styles.connectBtnStyle}
          start={[0.9, 0.5]}
          end={[0.0, 0.5]}
          locations={[0, 0.75]}
          colors={['#07e4dd', '#44acff']}
        >
          <TouchableOpacity onPress={connect}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{connectBtnText}</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      );
    }

    if (connectBtnText === 'WAITING') {
      ConnectButton = (
        <View style={[styles.connectBtnStyle, { backgroundColor: '#a6aeae' }]}>
          <View style={styles.buttonContainer}>
            <View style={{ paddingTop: 10, marginRight: 5 }}>
              <Icon name="clock-o" size={15} color="white" />
            </View>
            <Text style={styles.buttonText}>{connectBtnText}</Text>
          </View>
        </View>
      );
    }

    return ConnectButton;
  }

  getAbout() {
    if (this.state.isAboutDisplayed) {
      return (
        <Animated.View
          style={[styles.aboutDetail, {
            width: this.state.width,
            height: this.state.height,
            opacity: this.state.opacity,
          },
          ]}
        >
          <TouchableOpacity
            onPress={this.toggleAbout.bind(this)}
            style={{ flex: 1 }}
          >
            <View style={styles.aboutDetailContainer}>
              <Text style={styles.aboutDetailTitle}>About</Text>
              <Text style={styles.aboutDetailContent}>{this.state.about}</Text>
            </View>
            <TouchableOpacity onPress={this.toggleAbout.bind(this)}>
              <Image
                style={styles.cancelButton}
                source={CancelIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return null;
  }

  handleScroll(event) {
    const scrollMaxY = event.nativeEvent.contentSize.height -
                       event.nativeEvent.layoutMeasurement.height;
    let opacity = event.nativeEvent.contentOffset.y / scrollMaxY;

    if (event.nativeEvent.contentOffset.y < 25) {
      opacity = 0;
    } else if (event.nativeEvent.contentOffset.y > scrollMaxY - 25) {
      opacity = 1;
    }
    const customNavVarStyle = [
      styles.customNavBar,
      { opacity },
    ];
    this.navBar.setNativeProps({ style: customNavVarStyle });

    if (opacity === 0 || opacity === 1) {
      this.setState({ navBarFlag: opacity });
    }
  }

  getProfileView() {
    const overviewProps = {
      about: this.state.about,
      expertise: this.state.expertise,
      personality: this.state.personality,
    };

    const careerProps = {
      education: this.state.education,
      experience: this.state.experience,
    };

    return (
      <ScrollableTabView
        initialPage={0}
        tabBarTextStyle={styles.tabBarText}
        tabBarInactiveTextColor={'#a6aeae'}
        tabBarActiveTextColor={'#2e3031'}
        tabBarUnderlineStyle={styles.tabBarUnderline}
        renderTabBar={() => (
          <DefaultTabBar
            style={{
              marginLeft: dimensions.widthWeight * 50,
              marginRight: dimensions.widthWeight * 50,
            }}
            containerWidth={WIDTH - (dimensions.widthWeight * 100)}
            leftOffset={dimensions.widthWeight * 22}
            rightOffset={dimensions.widthWeight * 28}
          />
        )}
      >
        <UserOverview
          tabLabel="OVERVIEW"
          {...overviewProps}
          toggleAbout={this.toggleAbout.bind(this)}
        />
        <UserCareer
          tabLabel="CAREER"
          {...careerProps}
        />
      </ScrollableTabView>
    );
  }

  onRequestCallbackWithUpdate(result, error) {
    if (error) {
      Alert.alert('Error on Bookmark', error);
    } else if (result) {
      this.setState({ bookmarked: !this.state.bookmarked });
    }
  }

  setBookmark() {
    if (this.state.bookmarked) {
      UserUtil.bookmarkOff(this.onRequestCallbackWithUpdate.bind(this), this.state.id);
    } else {
      UserUtil.bookmarkOn(this.onRequestCallbackWithUpdate.bind(this), this.state.id);
    }
  }

  getWhiteNavBar() {
    return (
      <View
        ref={(component) => { this.navBar = component; }}
        style={[styles.customNavBar, { opacity: 0 }]}
      >
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
            setTimeout(() => Actions.refresh(), 20);
          }}
        >
          <View style={{ alignItems: 'flex-start' }}>
            <Image
              style={styles.customNavBarLeft}
              source={ArrowLeftGrey}
            />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: 'SFUIText-Regular',
              fontWeight: 'bold',
              color: '#2e3031',
              marginBottom: dimensions.widthWeight * 12.2,
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => this.setBookmark()}>
          <View style={{ alignItems: 'flex-end' }}>
            {
              this.props.myProfile ? null : (
                <Image
                  style={styles.customNavBarRight}
                  source={this.state.bookmarked ? BookmarkFill : BookmarkGrey}
                />
              )
            }
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  getTransparentNavBar() {
    return (
      <View
        style={[
          styles.customNavBar,
          {
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Image
            style={styles.customNavBarLeft}
            source={ArrowLeftWhite}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {
            this.props.myProfile ? null : (
              <Image
                style={styles.customNavBarRight}
                source={this.state.bookmarked ? BookmarkFill : BookmarkWhite}
              />
            )
          }
        </View>
      </View>
    );
  }

  // Render User profile
  renderUserProfile() {
    const TransparentNavBar = this.getTransparentNavBar();
    const WhiteNavBar = this.getWhiteNavBar();
    const Profile = this.getProfileView();
    const ConnectButton = this.getConnectButton();
    const About = this.getAbout();

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        { TransparentNavBar }
        { WhiteNavBar }
        <ScrollView
          bounces={false}
          scrollEventThrottle={16}
          onScroll={this.handleScroll.bind(this)}
        >
          <StatusBar
            backgroundColor={this.state.navBarFlag ? 'black' : 'transparent'}
            barStyle={this.state.navBarFlag ? 'dark-content' : 'light-content'}
            networkActivityIndicatorVisible={false}
          />
          <LinearGradient
            style={styles.profileImgGradient}
            start={[0.0, 0.25]}
            end={[0.5, 1.0]}
            colors={['#546979', '#08233a']}
          >
            <Image
              style={styles.profileImage}
              source={this.state.profileImage}
            />
          </LinearGradient>
          <View style={styles.profileUserInfo}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {this.state.name}
            </Text>
            <Text style={styles.positionText}>{this.state.currentStatus}</Text>
            <Text style={styles.currentLocationText}>{this.state.currentLocation}</Text>
          </View>
          { Profile }
        </ScrollView>
        <View style={styles.btn}>
          {ConnectButton}
        </View>
        {About}
      </View>
    );
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size="small"
      />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderUserProfile();
  }
}

const styles = StyleSheet.create({
  customNavBar: {
    backgroundColor: '#fbfbfb',
    paddingTop: 0,
    top: 0,
    ...Platform.select({
      ios: {
        height: dimensions.heightWeight * 64,
      },
      android: {
        height: dimensions.heightWeight * 54,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d6dada',
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  customNavBarLeft: {
    width: dimensions.widthWeight * 25,
    height: dimensions.heightWeight * 19.8,
    marginLeft: dimensions.widthWeight * 10,
    marginBottom: dimensions.widthWeight * 12.2,
  },
  customNavBarRight: {
    width: dimensions.widthWeight * 23,
    height: dimensions.heightWeight * 21,
    marginRight: dimensions.widthWeight * 10,
    marginBottom: dimensions.widthWeight * 12.2,
  },
  name: {
    fontSize: dimensions.fontWeight * 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  positionText: {
    fontSize: dimensions.fontWeight * 14,
    marginTop: dimensions.heightWeight * 10,
    color: '#ffffff',
  },
  currentLocationText: {
    fontSize: dimensions.fontWeight * 14,
    marginTop: dimensions.heightWeight * 5,
    color: '#ffffff',
  },
  profileImage: {
    alignItems: 'stretch',
    opacity: 0.4,
    height: HEIGHT * 0.4,
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
    top: dimensions.heightWeight * 155,
    marginLeft: dimensions.widthWeight * 45,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  btn: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  connectBtnStyle: {
    alignItems: 'stretch',
    height: dimensions.heightWeight * 45,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: dimensions.fontWeight * 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
    paddingTop: dimensions.heightWeight * 10,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    marginTop: dimensions.heightWeight * 5,
    marginBottom: dimensions.heightWeight * 5,
    marginLeft: dimensions.widthWeight * 5,
    marginRight: dimensions.widthWeight * 5,
    height: dimensions.heightWeight * 150,
    paddingVertical: dimensions.heightWeight * 15,
    paddingHorizontal: dimensions.widthWeight * 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  tabBarText: {
    marginTop: 10,
    backgroundColor: 'transparent',
    fontFamily: 'SFUIText-Bold',
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
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
    marginTop: dimensions.heightWeight * 150,
    marginLeft: dimensions.widthWeight * 50,
    marginRight: dimensions.widthWeight * 50,
  },
  aboutDetailTitle: {
    fontSize: dimensions.fontWeight * 22,
    fontWeight: '700',
    color: 'white',
  },
  aboutDetailContent: {
    color: 'white',
    paddingTop: dimensions.heightWeight * 10,
    fontSize: dimensions.fontWeight * 14,
  },
  cancelButton: {
    alignSelf: 'center',
    marginBottom: dimensions.heightWeight * 70,
  },
});

module.exports = UserProfile;
