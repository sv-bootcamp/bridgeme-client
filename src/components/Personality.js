import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Slider,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Personality extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Slider
          style={styles.slider}
          onValueChange={(value) => this.setState({ value: value })}
          maximumValue={5}
          minimumValue={0}
          step={1}
        />
        <TouchableOpacity style={{ alignSelf: 'stretch' }}>
          <LinearGradient
            start={[0.9, 0.5]} end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}
            style={styles.linearGradient}>
            <Text style={styles.buttonText}>
              DONE
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  slider: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
  },
  linearGradient: {
    height: 50,
    borderRadius: 50,
    margin: 10,
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

module.exports = Personality;
