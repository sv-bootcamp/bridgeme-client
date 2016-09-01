import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Navigator,
    Text,
} from 'react-native';

class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>All Lists</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbfbfc',
    borderBottomColor: '#dfdfdf',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    marginTop: 15,
    color: '#546979',
  },
});

module.exports = Header;
