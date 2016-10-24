import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Progress extends Component {

  render() {
    let deviceWidth = Dimensions.get('window').width;
    let _width = (deviceWidth / this.props.level) * this.props.step;

    return (
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['#44acff', '#07e4dd']}
          start={[0.0, 0.0]} end={[1.0, 1.0]}
          style={[styles.progress, { width: _width }]}>
        </LinearGradient>
      </View>
    );
  }

}

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: '#efeff2',
  },

  progress: {
    height: 2,
  },
});

module.exports = Progress;
