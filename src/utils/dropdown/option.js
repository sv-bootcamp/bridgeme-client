
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { dimensions } from '../../components/Shared/Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../../components/Shared/UniText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: dimensions.heightWeight * 20,
    fontSize: dimensions.fontWeight * 14,
    justifyContent: 'flex-start',
  },
  icon: {
    marginTop: dimensions.heightWeight * 5,
    marginRight: dimensions.widthWeight * 16,
    color: '#cdd2d2', justifyContent: 'flex-end',
  },
});

class Option extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { defaultValue, style, styleText, value, show } = this.props;

    let icon = show ? 'md-arrow-dropdown' : 'md-arrow-dropup';
    let fontColor = (value === defaultValue) ? '#a6aeae' : '#2e3031';

    return (
        <View style={styles.container}>
          <Text style={[styles.text, { color: fontColor }]}>
            {this.props.children}
          </Text>
          <Icon name={icon} size={dimensions.fontWeight * 20} style={styles.icon}/>
        </View>
    );
  }
}

Option.propTypes = {
  children: React.PropTypes.string.isRequired,
};

module.exports = Option;
