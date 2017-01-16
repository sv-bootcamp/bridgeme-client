import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import CloudTag from './CloudTag';
import Text from '../Shared/UniText';

// Get device size
const WIDTH = Dimensions.get('window').width;

class UserOverview extends Component {
  constructor(props) {
    super(props);

    this.changeState();
  }

  changeState() {
    const expertise = this.props.expertise.slice()
      .map(value => value.select)
      .sort((a, b) => a.length - b.length);

    this.state = {
      expertise,
      needEllipsize: false,
    };
  }

  getReadMore() {
    if (this.state.needEllipsize) {
      return (
        <TouchableOpacity onPress={this.props.toggleAbout}>
          <Text style={styles.expandText}>
            Read more
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  }

  renderAbout() {
    const ReadMore = this.getReadMore();

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>About</Text>
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            const HEIGHT_OF_TWO_LINES = dimensions.heightWeight * 33;

            if (height > HEIGHT_OF_TWO_LINES) {
              this.setState({ needEllipsize: true });
            }
          }}
        >
          <Text
            style={{
              marginRight: dimensions.widthWeight * 45,
              fontSize: dimensions.fontWeight * 14,
            }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {this.props.about}
          </Text>
        </View>
        { ReadMore }
      </View>
    );
  }

  renderMyExpertise() {
    const CHARACTER_WIDTH = 9;
    const LINE_PADDING = dimensions.widthWeight * 30;
    const TAG_RECTANGLE_SIZE = 50;
    const originArray = this.state.expertise;
    const newArray = [[]];
    let lineSize = 0;
    let lineCount = 0;

    for (let i = 0; i < originArray.length; i += 1) {
      if (originArray[i].includes('(')) {
        originArray[i] = originArray[i].substring(0, originArray[i].indexOf('('));
      }

      const itemSize = originArray[i].length * CHARACTER_WIDTH;

      // Check to see if current line has exceed device width
      if (lineSize + itemSize > WIDTH - LINE_PADDING) {
        lineSize = 0;
        lineCount += 1;
        newArray[lineCount] = [];
      }

      newArray[lineCount].push(originArray[i]);
      lineSize += itemSize + TAG_RECTANGLE_SIZE;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>My expertise</Text>
        {
          newArray.map((value, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              {
                value.map((innerValue, innerIndex) => (
                  <View key={innerIndex} style={styles.tagRectangle}>
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

  renderPersonality() {
    const tagList = [];
    this.props.personality.map((item) => {
      tagList.push({ title: item.option, point: item.score });
    });

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionName}>Personality</Text>
        <CloudTag tagList={tagList} />
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderAbout()}
        {this.renderMyExpertise()}
        {this.renderPersonality()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: dimensions.heightWeight * 20,
    marginLeft: dimensions.widthWeight * 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f2',
    paddingBottom: dimensions.heightWeight * 20,
  },
  sectionName: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
    marginBottom: dimensions.heightWeight * 23,
  },
  tagRectangle: {
    backgroundColor: '#f0f0f2',
    borderRadius: 25,
    height: dimensions.heightWeight * 38,
    paddingBottom: dimensions.heightWeight * 10,
    paddingTop: dimensions.heightWeight * 10,
    paddingLeft: dimensions.widthWeight * 20,
    paddingRight: dimensions.widthWeight * 20,
    marginRight: dimensions.widthWeight * 10,
    marginBottom: dimensions.heightWeight * 10,
    justifyContent: 'center',
  },
  tagText: {
    color: '#2e3031',
    fontSize: 14,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  expandText: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 10,
    marginTop: dimensions.heightWeight * 15,
  },
});

module.exports = UserOverview;
