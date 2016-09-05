import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
} from 'react-native';
import {
  Actions,
} from 'react-native-router-flux';

class UserProfile extends Component {
  render() {
    return (
      <View style={{ margin: 100 }}>
        <Text>Show Profile page</Text>
      </View>
    );
  }
}

module.exports = UserProfile;
