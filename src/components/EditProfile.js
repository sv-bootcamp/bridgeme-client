import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

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
      rightTitle: 'SAVE',
      rightButtonTextStyle: {
        color: '#44acff',
      },
    };

    return (
      <View style={[styles.container]}>
        <TouchableOpacity style={styles.menu}
                          onPress={() => Actions.generalInfo(fromEditProps)}>
          <Text style={styles.menuText}>General information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
                          onPress={() => Actions.careerInfo(fromEditProps)}>
          <Text style={styles.menuText}>Career background</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
                          onPress={() => Actions.expertInfo(fromEditProps)}>
          <Text style={styles.menuText}>My expertise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}
                          onPress={() => Actions.personality(fromEditProps)}>
          <Text style={styles.menuText}>My personality</Text>
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
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  menu: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#efeff2',
  },
  menuText: {
    fontFamily: 'SFUIText-Regular',
    color: '#2e3031',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 15,
    marginLeft: 30,
  },
});

module.exports = EditProfile;