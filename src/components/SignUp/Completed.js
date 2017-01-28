import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import { Actions, Scene, }  from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';

class Completed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: 'Your profile information has been\nsuccessfully completed.',
    };
  }

  onNextBtnPressed() {
    UserUtil.getMyProfile(this.onGetProfileCallback.bind(this));
  }

  onGetProfileCallback(profile, error) {
    if (error) {
      alert('Sever error(Profile)! Please sign in again.');
    } else if (profile) {
      Actions.main({ me: profile });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style ={styles.body}>
          <Image style={{
            width: dimensions.widthWeight * 130,
            height: dimensions.heightWeight * 130,
          }}
            source={require('../../resources/img-completed.png')}/>
          <Text style={styles.infoText}>{this.state.msg}</Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress = {this.onNextBtnPressed.bind(this)} >
            <LinearGradient style={styles.btnStyle}
              start={{ x: 0.9, y: 0.5 }} end={{ x: 0.0, y: 0.5 }} locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}>
              <Text style={styles.buttonText}>READY TO START</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

    </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  body: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
  },
  btnStyle: {
    height: dimensions.heightWeight * 45,
    width: dimensions.heightWeight * 230,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: dimensions.fontWeight * 16,
    textAlign: 'center',
    color: '#2e3031',
    marginTop: dimensions.heightWeight * 40,
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
  },
  labelStyle: {
    height: dimensions.heightWeight * 50,
    justifyContent: 'center',
    borderBottomColor: '#efeff2',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});

module.exports = Completed;
