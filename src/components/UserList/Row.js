import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

class Row extends Component {
  constructor(props) {
    super(props);

    // Current location and skills will be changed with real data later.
    this.state = {
      profileImage: '',
      name: '',
      job: '',
      position: 'Employer',
      currentJob: '',
      currentLocation: 'San Jose, CA, USA',
      skills: ['# Motivation', '# prefered_skill', '# freelance'],
    };
  }

  componentWillMount() {

    // Skills will be updated later
    let skills = this.state.skills;

    this.setState({
      profileImage: this.getProfileImage(),
      name: this.getName(),
      currentJob: this.getCurrentJob(),
      currentLocation: this.getCurrentLocation(),
      skills: skills,
    });
  }

  getCurrentJob() {
    let job = this.state.job;
    let position = this.state.position;

    if (this.props.dataSource.work.length > 0) {
      job = this.props.dataSource.work[0].employer.name;
      if (this.props.dataSource.work[0].position) {
        position = this.props.dataSource.work[0].position.name;
      }

      return position + ' at ' + job;
    }
  }

  getProfileImage() {
    if (this.props.dataSource.profile_picture) {
      return this.props.dataSource.profile_picture;
    } else {
      return '../../resources/btn_connect_2x.png';
    }
  }

  getName() {
    if (this.props.dataSource.name) {
      return this.props.dataSource.name;
    } else {
      return this.state.name;
    }
  }

  getCurrentLocation() {
    if (this.props.dataSource.location) {
      return this.props.dataSource.location;
    } else {
      return this.state.currentLocation;
    }
  }

  render() {
    let profileId = { _id: this.props.dataSource._id };
    const goToUserProfile = () => Actions.userProfile(profileId);

    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={styles.rowView}>
            <Image style={styles.photo}
                   source={{ uri: this.state.profileImage }}/>
             <Image style={styles.bookmarkIcon}
                    source={require('../../resources/icon-bookmark.png')}/>
            <View style={styles.userInformation}>
              <Text style={styles.name}>{this.state.name}</Text>
              <Text style={styles.job}> {this.state.currentJob}</Text>
              <Text style={styles.location}> {this.state.currentLocation}</Text>
              <Text style={styles.skillTitle}>I CAN HELP YOU WITH</Text>
              <Text style={styles.skill}>{this.state.skills}</Text>
            </View>
            <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
                locations={[0, 0.75]}
                colors={['#07e4dd', '#44acff']}>
            <TouchableWithoutFeedback>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>CONNECT</Text>
              </View>
            </TouchableWithoutFeedback>
            </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const CARD_PREVIEW_WIDTH = 10;
const CARD_MARGIN = 10;
const CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + 10 + CARD_PREVIEW_WIDTH) * 2;
const CARD_HEIGHT = Dimensions.get('window').height - 180;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  rowView: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    marginTop: 100,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      height: 1,
      width: 0.3,
    },
    ...Platform.select({
      ios: {
        marginTop: 100,
      },
      android: {
        marginTop: 90,
      },
    }),
  },
  bookmarkIcon: {
    position: 'absolute',
    zIndex: 1,
    right: 20,
    top: 20,
  },
  photo: {
    height: 182,
    width: CARD_WIDTH,
    borderRadius: 2,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    paddingLeft: 25,
  },
  name: {
    fontFamily: 'opensans',
    fontSize: 22,
    margin: 10,
    color: '#2e3031',
    fontWeight: 'bold',
  },
  job: {
    fontFamily: 'opensans',
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10,
    color: '#2e3031',
  },
  location: {
    fontFamily: 'opensans',
    fontSize: 14,
    marginLeft: 10,
    color: '#2e3031',
  },
  skillTitle: {
    fontFamily: 'opensans',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
    color: '#a6aeae',
  },
  skill: {
    fontFamily: 'opensans',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 10,
    color: '#2e3031',
  },
  connectBtnStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 170,
    height: 45,
    left: CARD_WIDTH / 2 - 85,
    marginBottom: 25,
    borderRadius: 121,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'opensans',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
});

module.exports = Row;
