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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ExperienceList from './ExperienceList';
import ServerUtil from '../../utils/ServerUtil';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    ServerUtil.initCallback(this.onRequestSuccess, this.onRequestFail);
  }

  onRequestSuccess(result) {
    console.log(result);
  }

  onRequestFail(error) {
    console.log(error);
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  sendRequest() {

    // TODO: Replace with server data
    ServerUtil.sendMentoringRequest('57d2425450087213d506f56d','I');
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image style={styles.profileImage}
              source={require('../../resources/btn_connect_1x.png')} />
        <View style={styles.profileUserInfo}>

          {/* Below mock data will be replaced with real data */}
          <Text style={styles.name}>Name</Text>
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
});

module.exports = UserProfile;
