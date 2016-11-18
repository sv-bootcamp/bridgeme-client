import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FindPassword from './FindPassword';
import UserUtil from '../../utils/UserUtil';

class InputEmailAddr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  render() {
    let onChangeText = (text) => this.onChangeText(text);
    let requestSecretCode = () => this.requestSecretCode();

    return (
      <FindPassword
        title="Please input your email address"
        inputHint="Email"
        buttonText="Send Code"
        isFinal={false}
        onChangeText={onChangeText}
        onPress={requestSecretCode} />
    );
  }

  onChangeText(text) {
    this.state.email = text;
  }

  requestSecretCode() {
    let emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(this.state.email)) {
      UserUtil.reqeustSecretCode(this.onRequestSecretCodeCallback.bind(this), this.state.email);
    } else {
      Alert.alert(
        'Forgot password',
        'Please input your correct email.',
      );
    }
  }

  onRequestSecretCodeCallback(result, error) {
    if (error) {
      if (error.msg) {
        Alert.alert(
          'Forgot password',
          'Please check email address that you inputted.',
        );
      }
    } else if (result) {
      Actions.inputSecretCode({
        secretCode: result.secretCode,
        email: this.state.email,
      });
    }
  }
}

module.exports = InputEmailAddr;
