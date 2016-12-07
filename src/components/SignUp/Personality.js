import React, { Component } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import Progress from '../Shared/Progress';
import { Personalites } from './SignUpMETA';
import { Actions, Scene, }  from 'react-native-router-flux';
import Slider from 'react-native-slider';

class Personality extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [],
      sliderTitle: Personalites,
      needRefresh: true,
    };
    UserUtil.getPersonality(this.onGetPersonalityCallback.bind(this));
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.completed({ me: this.props.me });
      }
    }
  }

  onGetPersonalityCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result.length !== 0) {
      const values = this.state.values.slice();

      for (let i = 0, sliderIndex = 0; i < result.length; i += 2, sliderIndex++) {

        // 0 means it has no direction
        if (result[i].score === 0) {
          continue;
        } else {
          const direction = this.findDirection(result[i].option);
          values[sliderIndex] = result[i].score *= direction;
          i--;
        }
      }

      this.setState({ values: values });
    }
  }

  /**
   * Return -1 if given personality is from left side, or return 1
   * if given personality is from right side.
   * @param {string} option - given personality
   * @returns {number} The direction. if nothing matches, return 0
   */
  findDirection(option) {
    for (let options of Personalites) {
      if (options[0] === option) {
        return -1;
      } else if (options[1] === option) {
        return 1;
      } else {
        continue;
      }
    }

    return 0;
  }

  componentDidMount() {
    let values = new Array(this.state.sliderTitle.length);
    values.fill(0, 0, values.length);
    this.setState({ values: values });

    if (this.props.fromEdit)
      Actions.refresh({ rightTitle: 'Save', onRight: this.sendRequest.bind(this) });
  }

  componentWillReceiveProps(props) {
    if (props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
        rightTitle: 'Save',
        onRight: this.sendRequest.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        },
      });
      this.setState({ needRefresh: false });
    }
  }

  sendRequest() {
    const personality = [];

    for (let i = 0; i < this.state.values.length; i++) {
      const value = this.state.values[i];

      // If user set default value(0), add both of personalities
      if (this.state.values[i] === 0) {
        for (let title of this.state.sliderTitle[i]) {
          personality.push({
            option: title,
            score: value,
          });
        }
      } else {
        personality.push({
          option: this.state.sliderTitle[i][value > 0 ? 1 : 0],
          score: Math.abs(value),
        });
      }
    }

    UserUtil.editPersonality(this.onUploadCallback.bind(this), personality);
  }

  render() {
    let slidersWithTitle = this.state.sliderTitle.map((currentValue, index) => (
        <View key={index} style ={{ flex: 1, backgroundColor: 'transparent' }} >
          <View style={styles.sliderTitle}>
            <Text style={{ color: '#757b7c' }}>{currentValue[0]}</Text>
            <Text style={{ color: '#757b7c' }}>{currentValue[1]}</Text>
          </View>
          <Slider
            style={styles.slider}
            trackStyle={sliderStyle.track}
            thumbStyle={sliderStyle.thumb}
            minimumTrackTintColor='#44acff'
            maximumValue={2}
            minimumValue={-2}
            step={1}
            value={this.state.values[index]}
            onValueChange={(value) => {
              let newValues = this.state.values.slice();
              newValues[index] = value;
              this.setState({ values: newValues });
            }}

          />
        </View>
      )
    );

    let submitButton = null;

    if (!this.props.fromEdit)
      submitButton = (
        <View style={{ flex: 1, marginTop: 50, marginBottom: 80 }}>
          <TouchableOpacity onPress={this.sendRequest.bind(this)}>
            <LinearGradient
              start={[0.9, 0.5]} end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}
              style={styles.linearGradient}>
              <Text style={styles.buttonText}>
                NEXT
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>);

    return (
      <View style={styles.container}>
        {this.props.fromEdit ? null : (<Progress level={4} step={4} />)}
        <ScrollView contentContainerStyle={{ marginTop: 50 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {'Let’s figure out your\npersonality !'}
              </Text>
              <Text style={{ color: '#2e3031', fontSize: 12, marginBottom: 51 }}>
                Drag each point to express youself.
              </Text>
            </View>
            <View style={styles.body}>
              {slidersWithTitle}
              {submitButton}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const sliderStyle = StyleSheet.create({
  track: {
    height: 1,
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    borderColor: '#44acff',
    borderWidth: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  scroll: {
    flex: 1,
    flexDirection: 'column',
  },
  slider: {
    flex: 1,
    marginTop: 10,
    marginBottom: 25,
    backgroundColor: 'transparent',
    marginLeft: 30,
    marginRight: 30,
  },
  body: {
    flex: 5,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    height: 45,
    borderRadius: 50,
    width: 230,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#2e3031',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

module.exports = Personality;
