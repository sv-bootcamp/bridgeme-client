import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  View,
} from 'react-native';
import commonStyles from './Styles';
import Text from '../Shared/UniText';

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

  render() {
    return this.renderEdit();
  }

  renderEdit() {
    return (
      <View style={styles.view}>
        <TextInput
          style={[styles.text, styles.input]}
          defaultValue={this.state.defaultValue}
          underlineColorAndroid="rgba(255, 255, 255, 0)"
          onEndEditing={() => this.reflctInput()}
          onChangeText={
            (text) => {
              this.state.defaultValue = text;
              this.props.onChangeText(this.props.propName, text);
            }
          } />
      </View>
    );
  }

  // When you finish editing, this component is changed into none edit mode.
  reflctInput() {
    this.setState({ editMode: false });
  }

}

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
});

module.exports = EditForm;
