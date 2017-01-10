import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class CloudTag extends Component {

  constructor(props) {
    super(props);

    this.TagCloud = this.orderData().map((item, key) => {
      const tagContainerStyle = {
        paddingLeft: this.getRandomPadding(item.point),
        paddingTop: this.getRandomPadding(item.point) / 2,
        paddingRight: this.getRandomPadding(item.point),
        paddingBottom: this.getRandomPadding(item.point) / 2,
      };

      const tagStyle = {
        fontSize: 12 + (item.point * 3),
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

  getRandomPadding(point) {
    return Math.floor(Math.random() * 10) * (point + 1);
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
