import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    ScrollView,
    Image,
    TouchableHighlight,
    Dimensions,
    ListView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ExperienceList from './ExperienceList';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      profileImage: '../../resources/btn_connect_2x.png',
      name: '',
      currentWork: 'Silicon Valley Bootcamp',
      position: 'Software Engineer',
      location: 'San Jose, CA',
      loaded: false,
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {

    // Check result code: profile Request/mentor request
    if (result._id) {
      let currentWork = this.state.currentWork;
      let position = this.state.position;
      let location = this.state.location;

      if (result.work.length > 0) {
        let lastIndex = result.work.length - 1;
        let work = result.work[lastIndex];

        if (work.employer)
          currentWork = work.employer.name;

        if (work.position)
          position = work.position.name;

        if (work.location)
          location = work.location.name;
      }

      this.setState({
        id: result._id,
        profileImage: result.profile_picture,
        name: result.name,
        currentWork: currentWork,
        position: position,
        location: location,
        loaded: true,
      });
    } else if (result.msg) {
      console.log(result.msg);
    }
  }

  onRequestFail(error) {
    console.log(error);
    if (error.code != ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  componentDidMount() {
    if (this.props.myProfile)
      ServerUtil.getMyProfile();
    else
      ServerUtil.getOthersProfile(this.props._id);
  }

  sendRequest() {
    ServerUtil.sendMentoringRequest(this.state.id, 'I love ya');
  }

  renderLoadingView() {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>User List</Text>
            <View style={styles.container}>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, { height: 80 }]}
                    size="large"
                />
            </View>
        </View>
    );
  }

  renderUserProfile() {
    const connect = () => this.sendRequest();
    let editButton;
    let connectButton;

    // Since we display these buttons by condition,
    // initialize with dummy text component.
    editButton = connectButton = (<Text></Text>);

    if (this.props.myProfile) {
      editButton = (

        // TODO: Replace below text with button
        <Text style={styles.edit}>Edit</Text>
      );
    } else {
      connectButton = (
        <TouchableHighlight style={styles.connectButton} onPress={connect}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableHighlight>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image style={styles.profileImage}
              source={{ uri: this.state.profileImage }} />
        <View style={styles.profileUserInfo}>
          {editButton}
          <Text style={styles.name}>{this.state.name}</Text>
          <Text style={styles.positionText}>
            {this.state.currentWork} | {this.state.position}
          </Text>
            <Text style={styles.positionText}>{this.state.location}</Text>

        </View>
        <View style={styles.profileUserExperice}>
          <Text style={styles.experience}>Experience</Text>
          {editButton}
        </View>
        {connectButton}
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
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  name: {
    marginTop: 60,
    fontSize: 17,
    fontWeight: 'bold',
  },
  positionText: {
    fontSize: 13,
    marginTop: 4,
    color: '#546979',
  },
  edit: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  experience: {
    fontSize: 15,
    color: '#546979',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  scroll: {
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
  profileImage: {
    position: 'absolute',
    top: 20,
    left: width / 2 - 50,
    zIndex: 100,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileUserInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: 70,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#f7f7f9',
  },
  profileUserExperice: {
    flex: 2,
    margin: 10,
    backgroundColor: '#f7f7f9',
    padding: 15,
  },
  connectButton: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#1ecfe2',
    borderRadius: 2,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'OpenSans',
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    flexDirection: 'column',
    paddingTop: 25,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});

module.exports = UserProfile;
