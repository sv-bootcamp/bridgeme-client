import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FindPassword from './FindPassword';

class FindPassStep2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  render() {
    let onChangeText = (text) => this.onChangeText(text);
    let checkSecretCode = () => this.checkSecretCode();

    return (
      <FindPassword
        title="Please input your code"
        inputHint="Code"
        buttonText="Find password"
        isFinal={false}
        onChangeText={onChangeText}
        onPress={checkSecretCode} />
    );
  }

  onChangeText(text) {
    this.state.code = text;
  }

  checkSecretCode() {
    if (this.state.code == this.props.secretCode) {
      Actions.findPassStep3({
        code: this.state.code,
        email: this.props.email,
      });
      return;
    }

    Alert.alert(
      'Forgot password',
      'Please input code you received from your email.',
    );
  }
}

module.exports = FindPassStep2;
