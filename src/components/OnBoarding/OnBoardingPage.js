import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import Text from '../Shared/UniText';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';

class OnBoardingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
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
    let btn = (this.state.index === 2) ? (
      <TouchableOpacity
        activated={false}
        onPress={this.onPressGetStartedButton}>
        <LinearGradient style={styles.getStartedBtnStyle}
          start={[0.9, 0.5]}
          end={[0.0, 0.5]}
          locations={[0, 0.75]}
          colors={['#07e4dd', '#44acff']}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ) : null;
    return (
      <View style={styles.footer}>
        {btn}
        <View>
          <Text style={styles.footerText}>Do you have an account already?
            <Text style={styles.logInText} onPress={this.onPressLogInButton}>  Log in</Text>
          </Text>
        </View>
      </View>
    );
  }

  renderDot() {
    return (
      <View style={{
        backgroundColor: '#d6dada',
        width: dimensions.fontWeight * 7,
        height: dimensions.fontWeight * 7,
        borderRadius: dimensions.fontWeight * 4,
        marginLeft: dimensions.widthWeight * 6,
        marginRight: dimensions.widthWeight * 6,
        marginTop: dimensions.heightWeight * 3,
      }} />
    );
  }

  renderActiveDot() {
    return (
      <View style={{
        backgroundColor: '#a6aeae',
        width: dimensions.fontWeight * 7,
        height: dimensions.fontWeight * 7,
        borderRadius: dimensions.fontWeight * 4,
        marginLeft: dimensions.widthWeight * 6,
        marginRight: dimensions.widthWeight * 6,
        marginTop: dimensions.heightWeight * 3,
      }} />
    );
  }

  controlScroll(event, state) {
    const idx = state.index;
    this.setState({
      index: idx,
    });
  }

  render() {
    return (
      <View style={styles.onboardingView}>
        <Swiper loop={false}
          style={styles.swipeContainer}
          height={SWIPER_HEIGHT}
          onMomentumScrollEnd={this.controlScroll.bind(this)}
          dot={this.renderDot()}
          activeDot={this.renderActiveDot()}>
          <View style={styles.imageContainer}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Image style={styles.titleImg1}
                source={require('../../resources/onboarding1_title.png')}/>
            </View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <Image style={styles.image}
                source={require('../../resources/onboarding1_img.png')}/>
            </View>
            <View style={{ flex: 0.3, justifyContent: 'center' }}/>
          </View>
          <View style={styles.imageContainer}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Image style={styles.titleImg1}
                source={require('../../resources/onboarding2_title.png')}/>
            </View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <Image style={styles.image}
                source={require('../../resources/onboarding2_img.png')}/>
            </View>
            <View style={{ flex: 0.3, justifyContent: 'center' }}/>
          </View>
          <View style={styles.imageContainer}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Image style={styles.titleImg1}
                source={require('../../resources/onboarding3_title.png')}/>
            </View>
            <View style={{ flex: 3, justifyContent: 'center' }}>
              <Image style={styles.image3}
                source={require('../../resources/onboarding3_img.png')}/>
            </View>
            <View style={{ flex: 0.3, justifyContent: 'center' }}/>
          </View>
        </Swiper>
        {this.renderFooter()}
      </View>

    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const IMAGE_HEIGHT =  WINDOW_WIDTH * 1.36;
const SWIPER_HEIGHT = WINDOW_HEIGHT - dimensions.heightWeight * 100;

const styles = StyleSheet.create({
  onboardingView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  swipeContainer: {
    ...Platform.select({
      ios: {
        paddingTop: 10,
      },
    }),
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: dimensions.heightWeight * 25,
  },
  titleImg1: {
    height: dimensions.heightWeight * 60,
    resizeMode: 'contain',
  },
  titleImg2: {
    height: dimensions.heightWeight * 60,
    resizeMode: 'contain',
    marginBottom: dimensions.heightWeight * 68,
  },
  titleImg3: {
    height: dimensions.heightWeight * 60,
    resizeMode: 'contain',
    marginBottom: dimensions.heightWeight * 52,
  },
  image: {
    width: WINDOW_WIDTH,
    resizeMode: 'contain',
  },
  image3: {
    width: dimensions.widthWeight * 311,
    resizeMode: 'contain',
  },
  footer: {
    height: dimensions.heightWeight * 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginBottom: dimensions.heightWeight * 30,
  },
  getStartedBtnStyle: {
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
  footerText: {
    height: dimensions.heightWeight * 15,
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 10,
  },
  logInText: {
    color: '#44acff',
  },
});

module.exports = OnBoardingPage;
