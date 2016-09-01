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
        <Image style={styles.photo} source={{uri: 'http://lorempixel.com/64/64/cats/' }} />
        <View style={styles.imageSeperator}></View>
        <View style={styles.userInformation}>
          <Text style={styles.name}>Hyunchan Kim</Text>
          <Text style={styles.job}>software engineer</Text>
          <Text style={styles.education}>education</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#f7f7f9',
    margin: 5,
  },
  photo: {
    height: 64,
    width: 64,
    margin: 10,
    borderRadius: 32,
  },
  imageSeperator: {
    alignItems: 'center',
    marginTop: 7.5,
    marginBottom: 7.5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  userInformation: {
    flex: 7,
    margin: 10,
    flexDirection: 'column',
  },
  name: {
    fontSize: 17,
  },
  job: {
    fontSize: 13,
  },
  education: {
    fontSize: 13,
  },
});

module.exports = Row;
