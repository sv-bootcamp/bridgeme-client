import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const deviceWidth = Dimensions.get('window').width;

// This is a progress line.
// This component receives 'level' and 'step' to define line length
class Progress extends Component {
  render() {
    let width = (deviceWidth / this.props.level) * this.props.step;

    return (
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['#44acff', '#07e4dd']}
          start={[0.0, 0.0]} end={[1.0, 1.0]}
          style={[styles.progress, { width: width }]}>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: '#efeff2',
  },
  progress: {
    height: 2,
  },
});

module.exports = Progress;
