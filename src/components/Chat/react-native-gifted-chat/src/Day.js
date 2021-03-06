import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../Shared/UniText';

import moment from 'moment/min/moment-with-locales.min';

export default class Day extends React.Component {
  render() {
    if (!this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[this.props.wrapperStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>
              {
                moment(this.props.currentMessage.createdAt)
                .locale(this.context.getLocale()).format('ll').toUpperCase()
              }
            </Text>
          </View>
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: 12,
    fontWeight: 'normal',
    paddingBottom: 10,
    paddingTop: 10,
  },
});

Day.contextTypes = {
  getLocale: React.PropTypes.func,
};

Day.defaultProps = {
  isSameDay: () => {},

  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
};

Day.propTypes = {
  isSameDay: React.PropTypes.func,
  currentMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
