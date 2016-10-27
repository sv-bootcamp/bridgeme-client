import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';
import commonStyles from './Styles';

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
    if (this.state.editMode) {
      return this.renderEdit();
    } else {
      return this.renderView();
    }
  }

  renderEdit() {
    return (
      <View>
        <TextInput
          style={[styles.text, styles.input]}
          defaultValue={this.state.defaultValue}
          underlineColorAndroid="#a6aeae"
          autoFocus={true}
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

  reflctInput() {
    this.setState({ editMode: false });
  }

  renderView() {
    let defaultValue = this.state.defaultValue;

    return (
      <View style={[commonStyles.flexR, styles.view]}>
        <View style={commonStyles.editL}>
          <Text style={styles.text}>{defaultValue}</Text>
        </View>
        <View style={commonStyles.editR}>
          <TouchableWithoutFeedback onPress={() => this.toggleEdit()}>
            <Image style={commonStyles.editBtn}
                   source={require('../../resources/icon-detail-edit.png')} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  toggleEdit() {
    this.setState({
      editMode: !this.state.editMode,
    });
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
    paddingBottom: 10.5,
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
  },
});

module.exports = EditForm;
