import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

class Row extends Component {
  render() {
    return (
      <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: 'http://lorempixel.com/64/64/cats/' }} />
          <View style={styles.imageSeperator}></View>
          <View style={styles.userInformation}>

            {/* Below Texts are mock data.
             They'll be replaced with real data from backend */}
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
    height: 80,
    width: 80,
    margin: 15,
    borderRadius: 40,
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
    marginLeft: 28,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  job: {
    fontSize: 13,
    marginTop: 5,
  },
  education: {
    fontSize: 13,
    marginTop: 5,
  },
});

module.exports = Row;
