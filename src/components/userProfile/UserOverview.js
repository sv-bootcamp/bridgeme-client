import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';

class UserOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      about: 'No data',
      expertise: [],
      personality: [],
      score: [],
      loaded: false,
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      this.setState({
        id: result._id,
        loaded: true,
        expertise: result.expertise.slice()
          .map((value) => value.select)
          .sort((a, b) => a.length - b.length),
        personality: result.personality.slice()
          .map((value) => value.option),
        score: result.personality.slice()
          .map((value) => value.score),
      });
    }
  }

  componentDidMount() {
    UserUtil.getOthersProfile(this.onRequestCallback.bind(this), this.props.id);
  }

  // Receive props befofe completely changed
  componentWillReceiveProps(props) {
    UserUtil.getOthersProfile(this.onRequestCallback.bind(this), this.props.id);
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='small'
      />
    );
  }

  renderAbout() {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>About</Text>
        <Text>{this.state.about}</Text>
      </View>
    );
  }

  renderMyExpertise() {
    const CHARACTER_WIDTH = 10;
    const LINE_PADDING = 10;
    const originArray = this.state.expertise;
    const newArray = [[]];
    let lineSize = 0;
    let lineCount = 0;

    for (let i = 0; i < originArray.length; i++) {
      const itemSize = originArray[i].length * CHARACTER_WIDTH;

      // Check to see if current line has exceed device width
      if (lineSize + itemSize > WIDTH - LINE_PADDING) {
        lineSize = 0;
        lineCount++;
        newArray[lineCount] = [];
      }

      newArray[lineCount].push(originArray[i]);
      lineSize += itemSize;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>My expertise</Text>
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

  renderPersonality() {
    const personalityArray = this.state.personality;
    const scoreArray = this.state.score;

    const fontStyle = [
      {
        color: '#cdd2d2',
        fontSize: 12,
      },
      {
        color: '#757b7c',
        fontSize: 16,
      },
      {
        color: '#2e3031',
        fontSize: 20,
      },
    ];
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>Personality</Text>
        {
          personalityArray.map((value, index) =>
            (<View key={index} style={{ flexDirection: 'row' }}>
              <Text style={[fontStyle[scoreArray[index]], styles.personality]}>{value}</Text>
            </View>))
        }
      </View>
    );
  }

  // Render User profile
  renderOverview() {
    return (
      <View>
        {this.renderAbout()}
        {this.renderMyExpertise()}
        {this.renderPersonality()}
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderOverview();
  }
}

// Get device size
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 20,
    marginLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f2',
    paddingBottom: 20,
  },
  sectionName: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 12,
    color: '#a6aeae',
    marginBottom: 10,
  },
  tagRectangle: {
    backgroundColor: '#f0f0f2',
    borderRadius: 25,
    height: 38,
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  tagText: {
    color: '#2e3031',
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  personality: {
    marginBottom: 5,
  },
});

module.exports = UserOverview;
