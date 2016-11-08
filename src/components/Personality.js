import React, { Component } from 'react';
import {
  Alert,
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
import ServerUtil from '../utils/ServerUtil';
import ErrorMeta from '../utils/ErrorMeta';

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

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error)
    );
  }

  componentDidMount() {
    let values = new Array(this.state.sliderTitle.length);
    values.fill(0, 0, values.length);
    this.setState({ values: values });
  }

  sendRequest() {
    const personality = [];

    for (let [index, value] of this.state.values.entries()) {

      // If user set default value(0), add both of personalities
      if (value === 0) {
        for (let title of this.state.sliderTitle[index]) {
          personality.push({
            option: title,
            score: value,
          });
        }
      } else {
        personality.push({
          option: this.state.sliderTitle[index][value > 0 ? 1 : 0],
          score: Math.abs(value),
        });
      }
    }

    ServerUtil.editPersonality(personality);
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

            maximumValue={2}
            minimumValue={-2}
            step={1}
            value={0}
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
        <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={this.sendRequest.bind(this)}>
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
    marginTop: 15,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        marginLeft: 30,
        marginRight: 30,
      },
      android: {
        marginLeft: 15,
        marginRight: 15,
      },
    }),
  },
  linearGradient: {
    height: 45,
    borderRadius: 50,
    margin: 30,
    width: 230,
    alignSelf: 'center',
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
