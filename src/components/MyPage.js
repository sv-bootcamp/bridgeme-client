import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ServerUtil from '../utils/ServerUtil';

class MyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      trueSwitchIsOn: true,
      falseSwitchIsOn: false,
      profileImage: '../resources/profile-img.png',
      name: '',
      currentStatus: '',
      currentPosition: '',
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {
    if (result.msg) {

      // When setting mentor mode is done
      ServerUtil.getRequestSetting();
    } else if (typeof result.result === 'boolean') {

      // When getting mentor mode is done
      this.setState({ trueSwitchIsOn: result.result });
    } else if (result._id) {

      // When user profile request is done
      let currentStatus = this.state.currentStatus;
      let currentPosition = this.state.currentPosition;

      if (result.work.length > 0) {
        const work = result.work[0];

        if (work.employer) currentStatus = work.employer.name;
        if (work.position) currentPosition = work.position.name;
      } else if (result.education.length > 0) {
        const education = result.education[result.education.length - 1];

        if (education.school) currentStatus = education.school.name;
        if (education.concentration.length > 0) currentPosition = education.concentration[0].name;
      }

      this.setState({
        name: result.name,
        profileImage: result.profile_picture,
        currentStatus: currentStatus,
        currentPosition: currentPosition,
        loaded: true,
      });
    }
  }

  onRequestFail(error) {
    alert(error);
  }

  componentDidMount() {
    ServerUtil.getMyProfile();
    ServerUtil.getRequestSetting();
  }

  onValueChange(value) {
    this.setState({ trueSwitchIsOn: value });
    ServerUtil.setRequestSetting(value);
  }

  signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Actions.login();
    } catch (error) {
      alert('ERROR: Try again');
    }
  };

  render() {
    const defaultProfileImage = require('../resources/profile-img.png');
    const facebookProfileImage = { uri: this.state.profileImage };

    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image style={styles.profileImage}
                 source={this.state.loaded ? facebookProfileImage : defaultProfileImage}/>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              {this.state.name}
            </Text>
            <Text ellipsizeMode ='tail' numberOfLines={1}>
              {this.state.currentPosition} at {this.state.currentStatus}
            </Text>
            <TouchableWithoutFeedback onPress={() => Actions.userProfile({ myProfile: true })}>
              <View>
                <Text style={styles.linkText}>
                  View Profile
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <TouchableOpacity style={styles.menu}>
          <Image source={require('../resources/page-1.png')} />
          <Text style={styles.menuText}>Edit my profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Image source={require('../resources/for-you-icon-line.png')} />
          <Text style={styles.menuText}>Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menu, { justifyContent: 'space-between' }]}>
          <View style={styles.receiveRequest}>
            <Image source={require('../resources/icon-request.png')} />
            <Text style={styles.menuText}>Recieve a request</Text>
          </View>
          <Switch
            style={styles.switchButton}
            onValueChange={this.onValueChange.bind(this)}
            value={this.state.trueSwitchIsOn}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.signOut}>
          <Image source={require('../resources/icon-logout.png')} />
          <Text style={styles.menuText}>Log out</Text>
        </TouchableOpacity>
        <View style={{ flex: 3 }}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  userInfo: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#efeff2',
    paddingLeft: 20,
  },
  menuText: {
    marginLeft: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#efeff2',
  },
  infoTextContainer: {
    flex: 1,
    height: 70,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  infoText: {
    color: '#2e3031',
    fontSize: 18,
    fontWeight: '500',
  },
  linkText: {
    color: '#557bfc',
  },
  receiveRequest: {
    flexDirection: 'row',
  },
  switchButton: {
    marginRight: 20,
  },
});

module.exports = MyPage;
