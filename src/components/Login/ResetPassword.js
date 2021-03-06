import React, { Component } from 'react';
import { Alert, Text, TouchableWithoutFeedback, } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FindPassword from './FindPassword';
import UserUtil from '../../utils/UserUtil';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password1: undefined,
      password2: undefined,
    };
  }

  render() {
    let onChangePassword1 = (text) => this.onChangePassword1(text);
    let onChangePassword2 = (text) => this.onChangePassword2(text);
    let resetPassword = () => this.resetPassword();

    return (
      <FindPassword
        title="Reset your password."
        inputHint="New password"
        inputHint2="Confirm password"
        isFinal={true}
        onChangeText={onChangePassword1}
        onChangeText2={onChangePassword2}
        onPress={resetPassword} />
    );
  }

  componentDidMount() {
    Actions.refresh({
      rightTitle: 'Save',
      onRight: () => this.resetPassword(),
    });
  }

  onChangePassword1(text) {
    this.state.password1 = text;
  }

  onChangePassword2(text) {
    this.state.password2 = text;
  }

  resetPassword() {
    if (this.state.password1 === undefined) {
      Alert.alert(
        'Forgot password',
        'Please input your password.',
      );
    } else if (this.state.password2 === undefined) {
      Alert.alert(
        'Forgot password',
        'Please input your password for comparison.',
      );
    } else if (this.state.password1 !== this.state.password2) {
      Alert.alert(
        'Forgot password',
        'Please input your password correctly',
      );
    } else {
      UserUtil.resetPassword(this.onResetPasswordCallback.bind(this),
                            this.props.email, this.state.password1, this.props.code);
    }
  }

  onResetPasswordCallback(result, error) {
    if (error) {
      Alert.alert(
        'Forgot password',
        error.msg,
      );
    } else if (result) {
      Alert.alert(
        'Forgot password',
        'Change password successfully!',
      );
      Actions.login();
    }
  }
}

module.exports = ResetPassword;
