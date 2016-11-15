import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

class OnBoardingPage extends Component {
  constructor(props) {
    super(props);
  }

  onPressLogInButton() {

    ///Todo : Make to go create page.
    Actions.login();
  }

  onPressGetStartedButton() {

    ///Todo : Make to go login page.
    Actions.login();
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <LinearGradient style={styles.getStartedBtnStyle} start={[0.9, 0.5]} end={[0.0, 0.5]}
          locations={[0, 0.75]}
          colors={['#07e4dd', '#44acff']}>
          <TouchableWithoutFeedback onPress={this.onPressGetStartedButton}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>GET STARTED</Text>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
        <Text style={styles.footerText}>Do you have an account already?
          <Text style={styles.logInText}onPress={this.onPressLogInButton}>  Log in</Text>
        </Text>
        
      </View>
    );
  }

  renderDot() {
    return (
      <View style={{
        backgroundColor: '#d6dada',
        width: 7,
        height: 7,
        borderRadius: 4,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 3,
        marginBottom: 3,
      }} />
    );
  }

  renderActiveDot() {
    return (
      <View style={{
        backgroundColor: '#a6aeae',
        width: 7,
        height: 7,
        borderRadius: 4,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 3,
        marginBottom: 3,
      }} />
    );
  }

  render() {
    return (
      <View style={styles.onboardingView}>
        <Swiper loop={false}
          height={SWIPER_HEIGHT}
          dot={this.renderDot()}
          activeDot={this.renderActiveDot()}>
          <View>
            <Image style={styles.image} source={require('../../resources/onboarding1.png')}/>
          </View>
          <View>
            <Image style={styles.image} source={require('../../resources/onboarding2.png')}/>
          </View>
          <View>
            <Image style={styles.image} source={require('../../resources/onboarding3.png')}/>
          </View>
        </Swiper>
        {this.renderFooter()}
      </View>

    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const IMAGE_HEIGHT = WINDOW_WIDTH * 1.36;
const SWIPER_HEIGHT = IMAGE_HEIGHT + 40;

const styles = StyleSheet.create({
  onboardingView: {
    flexDirection: 'column',
  },
  image: {
    width: WINDOW_WIDTH,
    height: IMAGE_HEIGHT,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: WINDOW_HEIGHT - SWIPER_HEIGHT,
  },
  getStartedBtnStyle: {
    justifyContent: 'center',
    width: 270,
    height: 45,
    borderRadius: 100,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'SFUIText-Bold',
    fontSize: 16,
    color: '#ffffff',
    alignSelf: 'center',
  },
  footerText: {
    fontFamily: 'SFUIText-Regular',
    color: '#a6aeae',
    fontSize: 12,
    marginBottom: 30,
  },
  logInText: {
    color: '#44acff',
  },
});

module.exports = OnBoardingPage;
