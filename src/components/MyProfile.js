import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
} from 'react-native';

class MyProfile extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>My Profile</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

module.exports = MyProfile;
