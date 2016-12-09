import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../components/Shared/UniText';

let PropTypes = React.PropTypes;

class CheckBox extends Component {

  constructor(props) {
    super(props);
  }

  getIcon() {
    if (this.props.checked)
      return (<Icon name={'md-checkmark'} color={'#44acff'} size={20} />);
    else
      return;
  }

  render() {
    let backColor = this.props.checked  ? '#fafafa' : '#ffffff';

    const { iconStyle, labelStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, { backgroundColor: backColor }]}
        onPress={() => this.onUpdate()}
        underlayColor={this.props.underlayColor}>
        <View style={styles.wrapper}>
          <View style={[styles.iconContainer, iconStyle]}>
            {this.getIcon()}
          </View>
          <View style={[styles.labelContainer, labelStyle]}>
            <Text allowFontScaling={false} style={[styles.label]}>
              {this.props.label}
            </Text>
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

};

var styles = StyleSheet.create({
  container: {
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderColor: 'black',
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2e3031',
  },
});

const checkBox = new CheckBox;
module.exports = CheckBox;
