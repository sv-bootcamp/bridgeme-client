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
      email: '',
      loaded: false,
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

  }

  onRequestSuccess(result) {
    this.setState({
      id: result._id,
      profileImage: result.profile_picture,
      name: result.name,
      email: result.email,
      loaded: true,
    });
  }

  onRequestFail(error) {
    console.log(error);
    if (error.code != ErrorMeta.ERR_NONE) {
      alert(err.msg);
    }
  }

  componentDidMount() {
    ServerUtil.getOthersProfile(this.props._id);
  }

  sendRequest() {

    // TODO: Replace with server data
    ServerUtil.sendMentoringRequest(this.state.id,  'I');
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
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image style={styles.profileImage}
              source={{ uri: this.state.profileImage }} />
        <View style={styles.profileUserInfo}>

          {/* Below mock data will be replaced with real data */}
          <Text style={styles.name}>{this.state.name}</Text>
          <Text >Google | Software engineer</Text>
          <Text>Havard University | Computer Science</Text>
          <Text>San Francisco CA, USA</Text>
        </View>
        <View style={styles.profileUserExperice}>
          <Text style={styles.experience}>Experience</Text>
        </View>
        <TouchableHighlight style={styles.connectButton} onPress={this.sendRequest}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableHighlight>
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
    marginTop: 70,
    fontSize: 17,
    fontWeight: 'bold',
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
    top: 70,
    left: width / 2 - 50,
    zIndex: 100,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileUserInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
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
