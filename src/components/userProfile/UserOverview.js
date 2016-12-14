import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';

class UserOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      about: '',
      expertise: [],
      personality: [],
      score: [],
      loaded: false,
      needEllipsize: false,
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      this.setState({
        id: result._id,
        about: result.about,
        loaded: true,
        about: result.about,
        expertise: result.expertise.slice()
          .map((value) => value.select)
          .sort((a, b) => a.length - b.length),
        personality: result.personality.slice()
          .map((value) => value.option),
        score: result.personality.slice()
          .map((value) => value.score),
        about: result.about,
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
          <View onLayout={ (event) => {
            const { height } = event.nativeEvent.layout;
            const HEIGHT_OF_TWO_LINES = 33;

            if (height > HEIGHT_OF_TWO_LINES) {
              this.setState({ needEllipsize: true });
            }
          }}
          >
            <Text style={{ marginRight: 45 }} ellipsizeMode={'tail'} numberOfLines={2}>
              {this.state.about}
            </Text>
          </View>
          {this.state.needEllipsize ?
            (<TouchableOpacity onPress={this.props.toggleAbout}>
              <Text style={styles.expandText}>
                Read more
              </Text>
            </TouchableOpacity>) : null}
        </View>
    );
  }

  renderMyExpertise() {
    const CHARACTER_WIDTH = 9;
    const LINE_PADDING = 30;
    const TAG_RECTANGLE_SIZE = 50;
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
      if (lineSize + itemSize > WIDTH - LINE_PADDING) {
        lineSize = 0;
        lineCount++;
        newArray[lineCount] = [];
      }

      newArray[lineCount].push(originArray[i]);
      lineSize += itemSize + TAG_RECTANGLE_SIZE;
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            personalityArray.map((value, index) =>
              (
                <Text
                  key={index}
                  style={[fontStyle[scoreArray[index]], styles.personality]}>
                  {value}
                </Text>
              ))
          }
        </View>
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a6aeae',
    marginBottom: 23,
  },
  about: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 16,
    color: '#2e3031',
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
    fontSize: 14,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  personality: {
    marginBottom: 5,
    marginRight: 5,
    height: 30,
  },
  expandText: {
    color: '#a6aeae',
    fontSize: 10,
    marginTop: 15,
  },
});

module.exports = UserOverview;
