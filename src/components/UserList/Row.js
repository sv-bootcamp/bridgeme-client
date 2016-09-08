import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Row extends Component {
  render() {
    return (

      // TODO: will be replaced with data from backend
      <TouchableHighlight onPress={Actions.userProfile}>
        <View style={styles.row}>
            <Image style={styles.photo}
                   source={{ uri: this.props.dataSource.profile_picture }}/>
            <View style={styles.imageSeperator}></View>
            <View style={styles.userInformation}>
              <Text style={styles.name}>{this.props.dataSource.name}</Text>
              <Text style={styles.job}>Job</Text>
              <Text style={styles.education}>Education</Text>
            </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#f7f7f9',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
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
