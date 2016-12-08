import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: '#2e3031',
    fontSize: 16,
  },
  input: {
    height: 48,
    margin: 0,
    padding: 0,
  },
  view: {
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
  },
  editView: {
    borderBottomWidth: 1,
    borderBottomColor: '#a6aeae',
  },
});

// A form component for single input
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      defaultValue: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      defaultValue: props.defaultValue,
    });
  }

  // When you finish editing, this component is changed into none edit mode.
  reflectInput() {
    this.editView.setNativeProps({ style: styles.view });
    this.setState({ editMode: false });
  }

  renderEdit() {
    return (
      <View
        ref={(component) => { this.editView = component; }}
        style={styles.view}
      >
        <TextInput
          style={[styles.text, styles.input]}
          defaultValue={this.state.defaultValue}
          underlineColorAndroid="rgba(255, 255, 255, 0)"
          onFocus={() => {
            this.editView.setNativeProps({ style: styles.editView });
          }}
          onEndEditing={() => this.reflectInput()}
          onChangeText={
            (text) => {
              this.state.defaultValue = text;
              this.props.onChangeText(this.props.propName, text);
            }
          }
        />
      </View>
    );
  }

  render() {
    return this.renderEdit();
  }
}

module.exports = EditForm;
