import React, { Component } from 'react';
import {
 Alert,
 StyleSheet,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from 'react-native';

class FindPassStep extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let onChangeText = (text) => {
      this.props.onChangeText(text);
    };

    return (

      //  Render the screen on View.
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            ref="1"
            returnKeyType={this.props.isFinal ? 'next' : 'done'}
            secureTextEntry={this.props.isFinal}
            placeholder={this.props.inputHint}
            onChangeText={onChangeText}
            placeholderTextColor="#d8d8d8"
            underlineColorAndroid="#efeff2"
            onSubmitEditing={() => this.focusNextField('2')} />
        </View>
        {this.props.isFinal ? this.renderInput() : this.renderButton()}
      </View>
    );
  }

  renderButton() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.props.buttonText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderInput() {
    let onChangeText = (text) => {
      this.props.onChangeText2(text);
    };

    return (
      <View style={styles.inputContainer2}>
        <TextInput
          style={styles.input}
          ref="2"
          secureTextEntry={this.props.isFinal}
          placeholder={this.props.inputHint2}
          onChangeText={onChangeText}
          placeholderTextColor="#d8d8d8"
          underlineColorAndroid="#efeff2" />
      </View>
    );
  }

  focusNextField(refNo) {
    if (!this.props.isFinal) return;
    this.refs[refNo].focus();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  titleContainer: {
    //marginTop: 101,
  },
  title: {
    color: '#2e3031',
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 161,
  },
  input: {
    width: 251,
    height: 45,
    marginLeft: 18,
    marginRight: 18,
    borderColor: '#efeff2',
    borderWidth: 1,
  },
  inputContainer2: {
    marginTop: 30,
  },
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    width: 240,
    height: 45,
    borderWidth: 1,
    borderColor: '#44acff',
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#44acff',
    fontSize: 16,
  },
});

module.exports = FindPassStep;
