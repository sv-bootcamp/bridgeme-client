import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

class Row extends Component {
  propTypes: {
    photoURL: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <View style={styles.row}>
        <Image style={styles.photo} source={{ uri: this.props.photoURL }}></Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  photo: {
    flex: 1,
    height: 150,
    resizeMode: 'contain'
  }
});

module.exports = Row;
