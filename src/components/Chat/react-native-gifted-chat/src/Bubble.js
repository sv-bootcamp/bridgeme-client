import React from 'react';
import {
  Clipboard,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MessageText from './MessageText';
import MessageImage from './MessageImage';
import Time from './Time';

export default class Bubble extends React.Component {
  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  handleBubbleToNext() {
    if (
      this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet
        .flatten(
          [
            styles[this.props.position].containerToNext,
            this.props.containerToNextStyle[this.props.position],
          ]);
    }

    return null;
  }

  handleBubbleToPrevious() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return StyleSheet.flatten(
        [
          styles[this.props.position].containerToPrevious,
          this.props.containerToPreviousStyle[this.props.position],
        ]);
    }

    return null;
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }

      return <MessageText {...messageTextProps}/>;
    }

    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }

      return <MessageImage {...messageImageProps}/>;
    }

    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }

      return <Time {...timeProps}/>;
    }

    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }

    return null;
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context);
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          'Copy Text',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
          }
        });
      }
    }
  }

  renderIfRight() {
    if (this.props.position === 'right') {
      return this.renderTime();
    }
  }

  renderIfLeft() {
    if (this.props.position === 'left') {
      return this.renderTime();
    }
  }

  render() {
    return (

      <View style={
        [styles[this.props.position].container, this.props.containerStyle[this.props.position]]}
      >
        <View style = {{ flexDirection: 'row' }}>
          {this.renderIfRight()}
        <View style={[
          styles[
          this.props.position].wrapper,
          this.props.wrapperStyle[this.props.position],
        ]}>
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
            {...this.props.touchableProps}
          >
            <View>
              {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageText()}
            </View>
          </TouchableWithoutFeedback>
        </View>
          {this.renderIfLeft()}
        </View>
      </View>

    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      maxWidth: WINDOW_WIDTH - 120,
      borderRadius: 16,
      backgroundColor: '#f0f0f0',
      marginRight: 5,
      minHeight: 20,
      marginTop:3,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      maxWidth: WINDOW_WIDTH - 80,
      borderRadius: 16,
      backgroundColor: '#44acff',
      marginLeft: 5,
      minHeight: 20,
      marginTop:3,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
  }),
};

Bubble.contextTypes = {
  actionSheet: React.PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  isSameUser: () => {},

  isSameDay: () => {},

  position: 'left',
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  touchableProps: React.PropTypes.object,
  onLongPress: React.PropTypes.func,
  renderMessageImage: React.PropTypes.func,
  renderMessageText: React.PropTypes.func,
  renderCustomView: React.PropTypes.func,
  renderTime: React.PropTypes.func,
  isSameUser: React.PropTypes.func,
  isSameDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  wrapperStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  containerToNextStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  containerToPreviousStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
};
