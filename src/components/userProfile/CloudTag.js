import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Text from '../Shared/UniText';
import { dimensions } from '../Shared/Dimensions';

export default class CloudTag extends Component {

  constructor(props) {
    super(props);
    const colorList = ['#cdd2d2', '#757b7c', '#2e3031'];

    this.TagCloud = this.orderData().map((item, key) => {
      const tagContainerStyle = {
        paddingLeft: dimensions.widthWeight * this.getRandomHorizontalPadding(),
        paddingTop: dimensions.heightWeight * this.getRandomVerticalPadding(),
        paddingRight: dimensions.widthWeight * this.getRandomHorizontalPadding(),
        paddingBottom: dimensions.heightWeight * this.getRandomVerticalPadding(),
      };

      const tagStyle = {
        fontSize: dimensions.heightWeight * (12 + (item.point * 4)),
        color: colorList[item.point],
      };

      return (
        <View key={key} style={tagContainerStyle}>
          <Text style={tagStyle}>{item.title}</Text>
        </View>
      );
    });
  }

  orderData() {
    let result = [];
    let tagList = this.props.tagList;
    tagList.sort((a, b) => {
      if (a.point === b.point) return 0;
      else return a.point > b.point ? -1 : 1;
    });

    const maxPoint = tagList[0].point;
    let switchFlag = true;
    tagList.map((item, key) => {
      if (maxPoint === item.point) {
        result.push(item);
        return;
      }

      if (switchFlag) {
        result.unshift(item);
        switchFlag = false;
      } else {
        result.push(item);
        switchFlag = true;
      }
    });

    return result;
  }

  getRandomVerticalPadding() {
    return Math.floor(Math.random() * 30);
  }

  getRandomHorizontalPadding() {
    return Math.floor(Math.random() * 20) + 5;
  }

  render() {
    let cloudTagStyle = [styles.cloudTagContainer];
    if (this.props.width) {
      cloudTagStyle.push({ width: this.props.width });
    }

    return (
      <View style={styles.container}>
        <View style={cloudTagStyle}>
          {this.TagCloud}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingRight: dimensions.widthWeight * 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
