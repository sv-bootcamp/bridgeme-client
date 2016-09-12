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
      <TouchableWithoutFeedback onPress={Actions.userProfile}>
        <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: this.props.dataSource.profile_picture }}/>
          <View style={styles.userInformation}>
            <Text style={styles.name}>{this.props.dataSource.name}</Text>
          </View>
          <TouchableHighlight style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Write an Email</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  name: {
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 'normal',
  },
  job: {
    fontSize: 13,
    marginTop: 5,
  },
  education: {
    fontSize: 13,
    marginTop: 5,
  },
  connectButton: {
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#1ecfe2',
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
  },
  connectButtonText: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
  },
});

module.exports = Row;
