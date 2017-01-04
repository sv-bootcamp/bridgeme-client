import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import Text from '../Shared/UniText';

class TournamentRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      name: '',
      position: '',
      company: '',
      currentStatus: '',
      loaded: false,
    };
  }

  getProfileImage(data) {
    let image;
    if (data.profile_picture) {
      image = { uri: data.profile_picture_small ?
        data.profile_picture_small : data.profile_picture, };
      return image;
    } else {
      image = require('../../resources/pattern.png');
      return image;
    }
  }

  getName(data) {
    if (data.name) {
      return data.name;
    } else {
      return '';
    }
  }

  render() {
    let selected = this.props.dataSource.rowFirst.selected;
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.row}>
            <Image style={[styles.photo, { opacity: selected ? 1 : 0.5 }]}
              source={this.getProfileImage(this.props.dataSource.rowFirst)}/>
            <View style={styles.userInformation}>
              <Text numberOfLines = {1} ellipsizeMode={'tail'}
                style={[styles.name,  { opacity: selected ? 1 : 0.5 }]}>
                {this.getName(this.props.dataSource.rowFirst)}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Image style={[styles.photo, { opacity: !selected ? 1 : 0.5 }]}
              source={this.getProfileImage(this.props.dataSource.rowSecond)}/>
            <View style={styles.userInformation}>
              <Text numberOfLines = {1} ellipsizeMode={'tail'}
                style={[styles.name, { opacity: !selected ? 1 : 0.5 }]}>
                {this.getName(this.props.dataSource.rowSecond)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.lineContainer}>
          <View style={styles.topContainer}>
            <View style={[styles.topBorderBox, {
              borderTopColor: selected ? '#44acff' : '#d6dada',
              borderRightColor: selected ? '#44acff' : '#d6dada',
            },
            ]}/>
          </View>
          <View style={styles.bottomContainer}>
            <View style={[styles.bottomBorderBox, {
              borderBottomColor: !selected ? '#44acff' : '#d6dada',
              borderRightColor: !selected ? '#44acff' : '#d6dada',
            },
            ]}/>
          </View>
          <View style={styles.centerBorderBox}>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    height: dimensions.heightWeight * 50,
    marginLeft: dimensions.widthWeight * 30,
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'column',
    height: dimensions.heightWeight * 100,
    width: dimensions.widthWeight * 160,
    justifyContent: 'center',
  },
  lineContainer: {
    position: 'absolute',
    right: 0,
    width: dimensions.widthWeight * 172,
    height: dimensions.heightWeight * 100,
    flex: 1,
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
  },
  topBorderBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: dimensions.widthWeight * 36.5,
    height: dimensions.heightWeight * 25,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  bottomBorderBox: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: dimensions.widthWeight * 36.5,
    height: dimensions.heightWeight * 25,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  centerBorderBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: dimensions.widthWeight * 135.5,
    height: dimensions.heightWeight * 50,
    borderBottomWidth: 1,
    borderBottomColor: '#44acff',
  },
  photo: {
    height: dimensions.fontWeight * 30,
    width: dimensions.fontWeight * 30,
    borderRadius: dimensions.fontWeight * 15,
  },
  userInformation: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: dimensions.fontWeight * 12,
    marginLeft: dimensions.widthWeight * 15,
    fontWeight: 'bold',
    color: '#2e3031',
  },
});

module.exports = TournamentRow;
