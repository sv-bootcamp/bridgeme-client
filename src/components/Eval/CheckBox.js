import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

let PropTypes = React.PropTypes;

class CheckBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let checkBoxImage = this.props.checked ?
                        this.props.checkedImage :
                        this.props.uncheckedImage;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onUpdate()}
        underlayColor={this.props.underlayColor}>
        <View style={styles.wrapper}>
          <Image
            style={styles.checkbox}
            source={checkBoxImage} />
          <View style={styles.labelContainer}>
            <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onUpdate() {
    this.props.onUpdate(
      this.props.answerIdx,
      this.props.optionIdx,
      this.props.freeForm,
      this.props.checked);
  }

}

CheckBox.defaultProps = {
  checkedImage: require('../../resources/checkbox_checked.png'),
  uncheckedImage: require('../../resources/checkbox_unchecked.png'),
  underlayColor: '#ffffffff',
};

var styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  labelContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: '#546979',
  },
});

const checkBox = new CheckBox;
module.exports = CheckBox;
