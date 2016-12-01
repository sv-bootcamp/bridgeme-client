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

    if (this.props.dataSource.experience.length > 0) {
      job = this.props.dataSource.experience[0].employer.name;
      if (this.props.dataSource.experience[0].position) {
        position = this.props.dataSource.experience[0].position.name;
      }

      return position + ' at ' + job;
    }
  }

  getProfileImage() {
    let image;
    if (this.props.dataSource.profile_picture) {
      image = { uri: this.props.dataSource.profile_picture };
      return image;
    } else {
      image = require('../../resources/pattern.png');
      return image;
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

  sendRequest() {
    Actions.requestPage({ id: this.props.dataSource._id });
  }

  render() {
    let profileId = { _id: this.props.dataSource._id };
    const goToUserProfile = () => Actions.userProfile(profileId);
    const connect = () => this.sendRequest();
    let viewStyle = [
      styles.rowView,
      {
        marginRight: this.props.dataSource.last ? 36 : 15,
      },
    ];

    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={viewStyle}>
          <Image style={styles.photo}
            source={this.state.profileImage}/>
          <Image style={styles.bookmarkIcon}
            source={require('../../resources/icon-bookmark.png')}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.job}> {this.state.currentJob}</Text>
            <Text style={styles.location}> {this.state.currentLocation}</Text>
            <Text style={styles.skillTitle}>I am expertised in</Text>
            <Text style={styles.skill}>{this.state.skills}</Text>
            </View>
            <View style={styles.connectBtnContainer}>
              <LinearGradient style={styles.connectBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
                locations={[0, 0.75]}
                colors={['#07e4dd', '#44acff']}>
                <TouchableWithoutFeedback onPress={connect}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>CONNECT</Text>
                  </View>
                </TouchableWithoutFeedback>
              </LinearGradient>
            </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const CARD_PREVIEW_WIDTH = 10;
const CARD_MARGIN = 15;
const CARD_WIDTH = Dimensions.get('window').width - 72;
const CARD_HEIGHT = Dimensions.get('window').height - 182;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  rowView: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
    justifyContent: 'center',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        height: CARD_HEIGHT + 10,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: {
          height: 1,
          width: 0.3,
        },
      },
      android: {
        height: CARD_HEIGHT,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .1)',
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
    height: CARD_HEIGHT / 2.73,
    width: CARD_WIDTH,
    borderRadius: 2,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  name: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 22,
    marginTop: 25,
    marginLeft: 25,
    color: '#2e3031',
  },
  job: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginTop: 25,
    marginLeft: 25,
    color: '#2e3031',
  },
  location: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginLeft: 25,
    color: '#2e3031',
  },
  skillTitle: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 25,
    marginTop: 20,
    color: '#a6aeae',
  },
  skill: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    marginLeft: 25,
    marginTop: 10,
    color: '#2e3031',
  },
  connectBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectBtnStyle: {
    width: CARD_WIDTH / 1.78,
    height: 45,
    marginBottom: CARD_HEIGHT / 20,
    borderRadius: CARD_HEIGHT / 4.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    flex: 1,
    fontFamily: 'SFUIText-Bold',
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

module.exports = Row;
