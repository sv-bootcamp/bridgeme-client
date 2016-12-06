import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

class UniText extends Component {
  constructor(props) {
    super(props);
    const style = StyleSheet.flatten(this.props.style);
    if (!style) return;
    if (Platform.OS === 'ios') {
      if (style.fontWeight === 'bold') {
        this.defaultFont = {
          fontFamily: 'SFUIText-Bold',
        };
      } else {
        this.defaultFont = {
          fontFamily: 'SFUIText-Regular',
        };
      }
    } else {
      this.defaultFont = {
        fontFamily: 'SFUIText',
      };
    }
  }

  render() {
    return (
      <Text style={[this.defaultFont, this.props.style]}>{this.props.children}</Text>
    );
  }
}

UniText.propTypes = {
  style: Text.propTypes.style,
};

module.exports = UniText;
