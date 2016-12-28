import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { dimensions } from './Shared/Dimensions';
import Text from './Shared/UniText';

class EditProfile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const fromEditProps = {
      me: this.props.me,
      backButtonImage: leftButtonGrey,
      type: ActionConst.PUSH,
      fromEdit: true,
      rightButtonTextStyle: {
        color: '#44acff',
      },
    };

    return (
      <View style={[styles.container]}>
        <TouchableOpacity style={styles.menu}
          onPress={() => Actions.generalInfo(fromEditProps)}>
          <View style={styles.innerContainer}>
            <Text style={styles.menuText}>General information</Text>
            <Image
              style={styles.image}
              source={require('../resources/indicator_right.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
          onPress={() => Actions.careerInfo(fromEditProps)}>
          <View style={styles.innerContainer}>
            <Text style={styles.menuText}>Career background</Text>
            <Image
              style={styles.image}
              source={require('../resources/indicator_right.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
          onPress={() => Actions.expertInfo(fromEditProps)}>
          <View style={styles.innerContainer}>
            <Text style={styles.menuText}>My expertise</Text>
            <Image
              style={styles.image}
              source={require('../resources/indicator_right.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
          onPress={() => Actions.personality(fromEditProps)}>
          <View style={styles.innerContainer}>
            <Text style={styles.menuText}>My personality</Text>
            <Image
              style={styles.image}
              source={require('../resources/indicator_right.png')}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const leftButtonGrey = require('../resources/icon-arrow-left-grey.png');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  menu: {
    height: dimensions.heightWeight * 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#efeff2',
  },
  innerContainer: {
    height: dimensions.fontWeight * 14,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  menuText: {
    position: 'absolute',
    left: dimensions.widthWeight * 30,
    color: '#2e3031',
    fontSize: dimensions.fontWeight * 14,
  },
  image: {
    position: 'absolute',
    right: dimensions.widthWeight * 15,
    height: dimensions.heightWeight * 18,
    resizeMode: 'contain',
  },
});

module.exports = EditProfile;
