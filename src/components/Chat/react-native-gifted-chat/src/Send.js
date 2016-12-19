import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SendBird from 'sendbird';
import Text from '../../../Shared/UniText';
import MatchUtil from '../../../../utils/MatchUtil';

export default class Send extends React.Component {
  render() {
    if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
              if (SendBird().getConnectionState() === 'OPEN') {
                this.props.onSend({ text: this.props.text.trim() }, true);
              } else {
                alert('Please check Network state.');
              }
            }
          }
        >
          <Image style={[styles.sendButton, this.props.textStyle]}
                 source={require('../../../../resources/send-active.png')}/>
        </TouchableOpacity>
      );
    }

    return <Image style={[styles.sendButton, this.props.textStyle]}
                  source={require('../../../../resources/send-inactive.png')}/>;
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      Actions.pop();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    marginRight: 15,
    marginBottom: 7,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},

  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  label: React.PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
