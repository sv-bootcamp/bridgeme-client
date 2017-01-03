import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';

class Tournament extends Component {
  constructor(props) {
    super(props);

    // TODO: isRefreshing is for refresh control will be added shortly
    this.state = {
        step: 0,
      };
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(props) {
    console.log(props);
  }

  onPressStartedButton() {
    console.log('onPressStartedButton');
  }

  renderNumOfPeople() {
    return (
      <View>
      </View>
    );
  }

  renderArea() {
    return (
      <View>
      </View>
    );
  }

  renderRestart() {
    return (
      <View>
        <Text style={styles.restartText}>
          {'Let’s start a new tournament.'}
        </Text>
        <Image
          style={styles.restartText}
          src={require('../../resources/bg-tournament-restart.png')}/>
        <TouchableOpacity
          activated={false}
          onPress={this.onPressStartedButton}>
          <LinearGradient style={styles.startedBtnStyle}
            start={[0.9, 0.5]}
            end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{'START'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
  );
  }

  render() {

    let renderStep = [];
    renderStep.push(this.renderRestart.bind(this));
    renderStep.push(this.renderArea.bind(this));
    renderStep.push(this.renderNumOfPeople.bind(this));

    return (
      <View style={styles.container}>

        <View>
          <Text style={styles.restartText}>
            {'Let’s start a new tournament.'}
          </Text>
          <Image
            style={styles.restartText}
            src={require('../../resources/bg-tournament-restart.png')}/>
          <TouchableOpacity
            activated={false}
            onPress={this.onPressStartedButton}>
            <LinearGradient style={styles.startedBtnStyle}
              start={[0.9, 0.5]}
              end={[0.0, 0.5]}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{'START'}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartText: {
    marginTop: dimensions.heightWeight * 80,
    fontSize: dimensions.fonttWeight * 18,
  },
  startedBtnStyle: {
    justifyContent: 'center',
    width: dimensions.widthWeight * 270,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
    marginBottom: dimensions.heightWeight * 10,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: dimensions.fontWeight * 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
});

module.exports = Tournament;
