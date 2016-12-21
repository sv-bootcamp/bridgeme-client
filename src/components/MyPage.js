import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import UserUtil from '../utils/UserUtil';
import Text from './Shared/UniText';

class MyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      trueSwitchIsOn: true,
      falseSwitchIsOn: false,
      name: '',
      currentStatus: '',
      profileImage: '',
      icons: [
        require('../resources/page-1.png'),
        require('../resources/for-you-icon-line.png'),
        require('../resources/icon-request.png'),
        require('../resources/icon-logout.png'),
      ],
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      Alert.alert('My Profile', error);
    } else if (result) {
      if (result.msg) {

        // When setting mentor mode is done
        UserUtil.getRequestSetting(this.onRequestCallback.bind(this));
      } else if (typeof result.result === 'boolean') {

        // When getting mentor mode is done
        this.setState({ trueSwitchIsOn: result.result });
      } else if (result._id) {
        this.setState({
          name: result.name,
          profileImage: this.getProfileImage(result),
          currentStatus: this.getCurrentStatus(result),
          loaded: true,
        });
      }
    }
  }

  componentDidMount() {
    UserUtil.getMyProfile(this.onRequestCallback.bind(this));
    UserUtil.getRequestSetting(this.onRequestCallback.bind(this));
  }

  getProfileImage(status) {
    if (status.profile_picture) {
      return { uri: status.profile_picture };
    }

    return require('../resources/pattern.png');
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

  onValueChange(value) {
    this.setState({ trueSwitchIsOn: value });
    UserUtil.setRequestSetting(this.onRequestCallback.bind(this), value);
  }

  signOut() {
    try {
      UserUtil.signOut((result, error) => {
        let keys = ['token', 'filter'];
        AsyncStorage.multiRemove(keys, () => { Actions.login(); });
      });
    } catch (error) {
      Alert.alert('My Profile', error);
    }
  }

  onEditButtonPress() {
    Actions.editProfile({ me: this.props.me });
  }

  render() {
    if (!this.state.profileImage) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image
            style={styles.profileImage}
            source={this.state.profileImage}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              {this.state.name}
            </Text>
            <Text ellipsizeMode="tail" numberOfLines={1}>
              {this.state.currentStatus}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => Actions.userProfile({ myProfile: true, direction: 'horizontal' })}>
              <View>
                <Text style={styles.linkText}>
                  View Profile
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.menu, { borderTopWidth: 1 }]}
          onPress={this.onEditButtonPress.bind(this)}
        >
          <Image source={this.state.icons[0]} />
          <Text style={styles.menuText}>Edit my profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Image source={this.state.icons[1]} />
          <Text style={styles.menuText}>Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menu, { justifyContent: 'space-between' }]}>
          <View style={styles.receiveRequest}>
            <Image source={this.state.icons[2]} />
            <Text style={styles.menuText}>Recieve a request</Text>
          </View>
          <Switch
            style={styles.switchButton}
            onValueChange={this.onValueChange.bind(this)}
            value={this.state.trueSwitchIsOn}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu} onPress={this.signOut}>
          <Image source={this.state.icons[3]} />
          <Text style={styles.menuText}>Log out</Text>
        </TouchableOpacity>
        <View style={{ flex: 3 }} />
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
    borderBottomWidth: 1,
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
    color: '#44acff',
  },
  receiveRequest: {
    flexDirection: 'row',
  },
  switchButton: {
    marginRight: 20,
  },
});

module.exports = MyPage;
