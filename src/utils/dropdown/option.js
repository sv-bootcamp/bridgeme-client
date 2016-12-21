
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
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
    marginLeft: 20,
    fontSize: 14,
    justifyContent: 'flex-start',
  },
  icon: {
    marginTop: 5,
    marginRight: 16,
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
          <Icon name={icon} size={20} style={styles.icon}/>
        </View>
    );
  }
}

Option.propTypes = {
  children: React.PropTypes.string.isRequired,
};

module.exports = Option;
