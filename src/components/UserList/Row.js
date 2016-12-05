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

    this.state = {
      profileImage: '',
      name: '',
      currentStatus: '',
      currentLocation: '',
      expertise: [],
    };
  }

  componentWillMount() {
    this.setState({
      profileImage: this.getProfileImage(),
      name: this.getName(),
      currentStatus: this.getCurrentStatus(),
      currentLocation: this.getCurrentLocation(),
      expertise: this.props.dataSource.expertise.slice()
        .map((value) => value.select)
        .sort((a, b) => a.length - b.length),
    });
  }

  getCurrentStatus() {
    let currentTask;
    let location;

    if (this.props.dataSource.experience.length > 0) {
      location = this.props.dataSource.experience[0].employer.name;
      if (this.props.dataSource.experience[0].position) {
        currentTask = this.props.dataSource.experience[0].position.name;
      }
    }

    return currentTask + ' at ' + location;
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

  renderMyExpertise() {
    const CHARACTER_WIDTH = 10;
    const LINE_PADDING = 10;
    const originArray = this.state.expertise;
    const newArray = [[]];
    let lineSize = 0;
    let lineCount = 0;

    for (let i = 0; i < originArray.length; i++) {
      if (originArray[i].includes('(')) {
        originArray[i] = originArray[i].substring(0, originArray[i].indexOf('('));
      }

      const itemSize = originArray[i].length * CHARACTER_WIDTH;

      // Check to see if current line has exceed device width
      if (lineSize + itemSize > CARD_WIDTH - LINE_PADDING) {
        lineSize = 0;
        lineCount++;
        newArray[lineCount] = [];
      }

      newArray[lineCount].push(originArray[i]);
      lineSize += itemSize;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>MY EXPERTISE </Text>
          {
            newArray.map((value, index) =>
              (<View key={index} style={{ flexDirection: 'row' }}>
                {
                  value.map((value, index) =>
                    (<View key={index} style={styles.tagRectangle}>
                      <Text style={styles.tagText}>
                        {value}
                      </Text>
                    </View>))
                }
              </View>))
          }
      </View>
    );
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
        elevation: 10,
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
              {this.renderMyExpertise()}
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
const WIDTH = Dimensions.get('window').width;
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
  sectionContainer: {
    marginTop: 20,
    marginLeft: 30,
    paddingBottom: 20,
  },
  sectionName: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 10,
    color: '#a6aeae',
    marginBottom: 10,
  },
  tagRectangle: {
    backgroundColor: '#f0f0f2',
    borderRadius: 25,
    height: 27,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 5,
    marginBottom: 5,
    justifyContent: 'center',
  },
  tagText: {
    color: '#2e3031',
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    backgroundColor: 'transparent',
    textAlign: 'center',
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
