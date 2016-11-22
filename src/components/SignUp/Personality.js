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
import UserUtil from '../../utils/UserUtil';
import Progress from '../Shared/Progress';
import { Personalites } from './SignUpMETA';
import { Actions, Scene, }  from 'react-native-router-flux';

class Personality extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [],
      sliderTitle: Personalites,
    };
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.completed({me: this.props.me});
      }
    }
  }

  componentDidMount() {
    let values = new Array(this.state.sliderTitle.length);
    values.fill(0, 0, values.length);
    this.setState({ values: values });

    if(this.props.fromEdit)
      Actions.refresh({ rightTitle: 'SAVE', onRight: this.sendRequest.bind(this) });
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
        <View key={index} style ={{ flex: 1 }} >
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

    let submitButton = null;

    if(!this.props.fromEdit)
      submitButton = (
        <View style={{ flex: 1, marginTop: 50, }}>
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
        <Progress level={4} step={4} />
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {'Let’s figure out your\npersonality !'}
              </Text>
              <Text style={{ color: '#2e3031', fontSize: 12, }}>
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
    fontFamily: 'SFUIText-Bold',
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
