import React, { PropTypes, Component } from 'react';
import {
  Image,
  ListView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        .map(value => value.select)
        .sort((a, b) => a.length - b.length),
      pending: this.props.dataSource.pending,
    });
  }

  getCurrentStatus() {
    let currentTask;
    let location;

    if (this.props.dataSource.experience.length > 0) {
      location = this.props.dataSource.experience[0].employer.name;
      if (this.props.dataSource.experience[0].position) {
        currentTask = this.props.dataSource.experience[0].position.name;
      } else {
        return location;
      }

      return currentTask + ' at ' + location;
    } else if (this.props.dataSource.education.length > 0) {
      const lastIndex = this.props.dataSource.education.length - 1;
      const education = this.props.dataSource.education[lastIndex];

      if (education.school) {
        location = education.school.name;
        if (education.concentration.length > 0 && education.concentration[0].name !== '') {
          currentTask = education.concentration[0].name;
        } else {
          return location;
        }

        return currentTask + ' at ' + location;
      }
    }

    return 'No current status';
  }

  getProfileImage() {
    if (this.props.dataSource.profile_picture) {
      return { uri: this.props.dataSource.profile_picture_large ?
        this.props.dataSource.profile_picture_large : this.props.dataSource.profile_picture };
    }

    return require('../../resources/pattern.png');
  }

  getName() {
    if (this.props.dataSource.name) {
      return this.props.dataSource.name;
    }

    return this.state.name;
  }

  getCurrentLocation() {
    if (this.props.dataSource.location) {
      return this.props.dataSource.location;
    }

    return this.state.currentLocation;
  }

  renderMyExpertise() {
    const CHARACTER_WIDTH = dimensions.widthWeight * 10;
    const LINE_PADDING = dimensions.widthWeight * 15;
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
      if (lineCount < 2) {
        if (lineSize + itemSize > CARD_WIDTH - LINE_PADDING) {
          lineSize = 0;
          lineCount++;
          newArray[lineCount] = [];
        } else {
          newArray[lineCount].push(originArray[i]);
          lineSize += itemSize;
        }
      }
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.sectionName}>MY EXPERTISE{'\t'}</Text>
          <View style={styles.expertiseSeparator} />
        </View>
        {
            newArray.map((value, index) =>
              (<View key={index} style={{ flexDirection: 'row' }}>
                {
                  value.map((innerValue, innerIndex) =>
                    (<View key={innerValue} style={styles.tagRectangle}>
                      <Text style={styles.tagText}>
                        {innerValue}
                      </Text>
                    </View>))
                }
              </View>))
          }
      </View>
    );
  }

  sendRequest() {
    Actions.requestPage({ id: this.props.dataSource._id, me: this.props.dataSource.me });
  }

  render() {
    const profileId = { _id: this.props.dataSource._id, me: this.props.dataSource.me };
    const goToUserProfile = () => Actions.userProfile(profileId);
    const connect = () => this.sendRequest();
    const viewStyle = [
      styles.rowView,
      {
        marginRight: this.props.dataSource.last ? 0 : dimensions.widthWeight * 15,
        elevation: 10,
      },
    ];

    let connectButton = null;

    if (this.state.pending) {
      connectButton = (
        <View style={[styles.connectBtnStyle, { backgroundColor: '#a6aeae' }]}>
          <View style={styles.buttonContainer}>
            <View style={{ marginRight: 5, alignItems: 'center' }}>
              <Icon name="clock-o" size={15} color="white" />
            </View>
            <Text style={styles.buttonText}>WAITING</Text>
          </View>
        </View>
      );
    } else {
      connectButton = (
        <TouchableOpacity onPress={connect}>
          <LinearGradient
            style={styles.connectBtnStyle}
            start={[0.9, 0.5]}
            end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}
          >
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>CONNECT</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={viewStyle}>
          <Image
            style={styles.photo}
            source={this.state.profileImage}
          />
          <Image
            style={styles.bookmarkIcon}
            source={require('../../resources/icon-bookmark.png')}
          />
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text numberOfLines={1} style={styles.job}> {this.state.currentStatus}</Text>
            <Text style={styles.location}> {this.state.currentLocation}</Text>
            {this.renderMyExpertise()}
          </View>
          <View style={styles.connectBtnContainer}>
            {connectButton}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const CARD_MARGIN = dimensions.widthWeight * 15;
const CARD_WIDTH = dimensions.widthWeight * 303;
const CARD_HEIGHT = dimensions.heightWeight * 498;
const styles = StyleSheet.create({
  rowView: {
    flex: 1,
    backgroundColor: '#fff',
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
    justifyContent: 'center',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        height: CARD_HEIGHT,
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
    right: dimensions.widthWeight * 20,
    top: dimensions.heightWeight * 20,
  },
  photo: {
    height: dimensions.heightWeight * 182,
    width: dimensions.widthWeight * 303,
    borderRadius: 2,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: dimensions.fontWeight * 22,
    fontWeight: 'bold',
    marginTop: dimensions.heightWeight * 25,
    marginLeft: dimensions.widthWeight * 25,
    color: '#2e3031',
  },
  job: {
    fontSize: dimensions.fontWeight * 14,
    marginTop: dimensions.heightWeight * 10,
    marginLeft: dimensions.widthWeight * 25,
    marginRight: CARD_WIDTH * 0.082,
    color: '#2e3031',
  },
  location: {
    fontSize: dimensions.fontWeight * 14,
    marginTop: dimensions.heightWeight * 5,
    marginLeft: dimensions.widthWeight * 25,
    marginBottom: dimensions.heightWeight * 10,
    color: '#2e3031',
  },
  sectionContainer: {
    marginTop: dimensions.heightWeight * 20,
    marginLeft: dimensions.widthWeight * 25,
    paddingBottom: dimensions.heightWeight * 20,
  },
  sectionName: {
    fontSize: dimensions.fontWeight * 10,
    fontWeight: 'bold',
    color: '#a6aeae',
    marginBottom: dimensions.heightWeight * 15,
  },
  expertiseSeparator: {
    borderBottomWidth: 1,
    width: dimensions.widthWeight * 167,
    marginBottom: dimensions.heightWeight * 10,
    alignSelf: 'center',
    borderColor: '#d6dada',
  },
  tagRectangle: {
    backgroundColor: '#f0f0f2',
    borderRadius: dimensions.fontWeight * 25,
    height: dimensions.heightWeight * 27,
    paddingBottom: dimensions.heightWeight * 6,
    paddingTop: dimensions.heightWeight * 6,
    paddingLeft: dimensions.widthWeight * 15,
    paddingRight: dimensions.widthWeight * 15,
    marginRight: dimensions.widthWeight * 10,
    marginBottom: dimensions.heightWeight * 10,
    justifyContent: 'center',
  },
  tagText: {
    color: '#2e3031',
    fontSize: dimensions.fontWeight * 12,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  connectBtnContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  connectBtnStyle: {
    width: dimensions.heightWeight * 170,
    height: dimensions.widthWeight * 45,
    marginBottom: dimensions.heightWeight * 25,
    borderRadius: dimensions.fontWeight * 121,
    justifyContent: 'center',
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
  },
});

module.exports = Row;
