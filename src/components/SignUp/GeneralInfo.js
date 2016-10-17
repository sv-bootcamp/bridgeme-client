import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';

class GeneralInfo extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>Name</Text>
          <TextInput />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {

  },
});

module.exports = GeneralInfo;
