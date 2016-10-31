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

    this.state = {
      values: [],
      sliderTitle: [
        ['Extroverts', 'Introverts'],
        ['Sensors', 'Intuitives'],
        ['Feelers', 'Thinkers'],
        ['Judgers', 'Percievers'],
        ['Speaker', 'Listener'],
        ['Energetic', 'Quite'],
        ['Unexacting', 'Perfectionist'],
        ['Traditional', 'Free Thinking'],
      ],
    };
  }

  render() {

    let slidersWithTitle = this.state.sliderTitle.map((currentValue, index) => (
        <View key={index}>
          <View style={styles.sliderTitle}>
            <Text style={{ color: '#757b7c' }}>{currentValue[0]}</Text>
            <Text style={{ color: '#757b7c' }}>{currentValue[1]}</Text>
          </View>
          <Slider
            style={styles.slider}
            onValueChange={(value) => {
              let newValues = this.state.values.slice();
              newValues[index] = value;
              this.setState({ values: newValues });
            }}

            maximumValue={4}
            minimumValue={0}
            step={1}
          />
        </View>
      )
    );
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let’s figure out your personality !</Text>
          <Text style={{ color: '#2e3031' }}>Drag each point to express youself.</Text>
        </View>
        {slidersWithTitle}
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
    justifyContent: 'center',
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
    color: '#2e3031',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
});

module.exports = Personality;
