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

    this.defaultFont = {
      fontFamily: 'SFUIText-Regular',
      fontWeight: 'normal',
    };

    if (style.fontFamily) {
      this.defaultFont.fontFamily = style.fontFamily;
      this.defaultFont.fontWeight = style.fontWeight;
    } else {
      if (style.fontWeight === 'bold' || Number(style.fontWeight) >= 700) {
        this.defaultFont.fontFamily = 'SFUIText-Bold';
      } else if (Number(style.fontWeight) >= 600) {
        this.defaultFont.fontFamily = 'SFUIText-Semibold';
      } else if (Number(style.fontWeight) >= 400) {
        this.defaultFont.fontFamily = 'SFUIText-Regular';
      } else if (Number(style.fontWeight) >= 200) {
        this.defaultFont.fontFamily = 'SFUIText-Light';
      } else if (Number(style.fontWeight) >= 100) {
        this.defaultFont.fontFamily = 'SFUIText-Ultrathin';
      } else {
        this.defaultFont.fontFamily = 'SFUIText-Regular';
      }

      if (Platform.OS === 'ios' && style.fontWeight)
        this.defaultFont.fontWeight = style.fontWeight;
    }
  }

  render() {
    return (
      <Text style={[this.props.style, this.defaultFont]}>{this.props.children}</Text>
    );
  }
}

UniText.propTypes = {
  style: Text.propTypes.style,
};

module.exports = UniText;
