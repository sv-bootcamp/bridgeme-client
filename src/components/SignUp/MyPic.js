import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';

class MyPic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      source: require('../../resources/default_profile.png'),
      uri: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      uri: props.uri,
    });
  }

  render() {
    return (
      <View style={styles.profileImageView}>
        <Image style={styles.profileImage}
               source={
                 this.state.uri === '' ?
                 this.state.source :
                 { uri: this.state.uri }
               } />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  profileImageView: {
    alignItems: 'center',
    marginTop: 40,
  },

  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 50,
  },
});

module.exports = MyPic;
