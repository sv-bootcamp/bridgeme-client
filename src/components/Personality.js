import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Slider,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Personality extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ScrollView style={styles.scroll}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let’s figure out your
              personality !</Text>
            <Text>Drag each point to express youself.</Text>
          </View>
          <View style={styles.sliderTitle}>
            <Text>Extroverts</Text>
            <Text>Introverts</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Sensors</Text>
            <Text>Intuitives</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Feelers</Text>
            <Text>Thinkers</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Judgers</Text>
            <Text>Precievers</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Speaker</Text>
            <Text>Listener</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Energetic</Text>
            <Text>Quite</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Unexacting</Text>
            <Text>Perfectionist</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
            minimumValue={0}
            step={1}
          />
          <View style={styles.sliderTitle}>
            <Text>Traditional</Text>
            <Text>Free Thinking</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => this.setState({ value: value })}
            maximumValue={4}
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
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  slider: {
    flex: 1,
    margin: 30,
  },
  linearGradient: {
    height: 50,
    borderRadius: 50,
    margin: 30,
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
  sliderTitle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
  },
  titleContainer: {
    alignItems: 'center',
    margin: 50,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
  },
});

module.exports = Personality;
