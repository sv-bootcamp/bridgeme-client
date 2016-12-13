import React, { Component } from 'react';
import {
  AppState,
  NetInfo,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { GiftedChat } from './react-native-gifted-chat';
import FcmUtil from '../../utils/FcmUtil';
import SendBird from 'sendbird';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';

class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      channel: null,
      isTyping: false,
    };

    this.isConnected = false;
    this.me = this.props.me;
    this.opponent = this.props.opponent;
    this.lastTyping = null;
    this.renderFooter = this.renderFooter.bind(this);

    this.sb = new SendBird({
      appId: SendBird().getApplicationId(),
    });
    this.ChannelHandler = new this.sb.ChannelHandler();
    this.ChannelHandler.onMessageReceived = this.onMessageReceived.bind(this);
    this.ChannelHandler.onTypingStatusUpdated = this.onTypingStatusUpdated.bind(this);
    this.ChannelHandler.onReadReceiptUpdated = this.onReadReceiptUpdated.bind(this);
  }

  componentDidMount() {
    this.initChatPage(() => {
      NetInfo.isConnected.fetch().then(isConnected => {
        this.isConnected = isConnected;
      });

      NetInfo.isConnected.addEventListener('change', this.onConnectionStateChange.bind(this));
    });
  }

  componentWillReceiveProps(nextProps = {}) {
    if (this.props.opponent === nextProps.opponent) {
      return;
    }

    this.setState({
      messages: [],
      channel: null,
      opponentInfo: undefined,
      isTyping: false,
    });
    this.me = nextProps.me;
    this.opponent = nextProps.opponent;
    this.initChatPage();
  }

  componentWillUnmount() {
    this.sb.removeChannelHandler('ChatPage');
  }

  initChatPage(callback) {
    UserUtil.getOthersProfile(this.onOpponentInfoRequest.bind(this), this.opponent.userId);
    this.connectSendBird((user, error) => {
      if (user) {
        this.refreshChatPage(callback);
      } else {
        alert('Please check Network status.');
        Actions.pop();
      }
    });
  }

  refreshChatPage(callback) {
    const userIds = [this.me.userId, this.opponent.userId];
    this.sb.GroupChannel.createChannelWithUserIds(
      userIds, true, '', '', '', function (channel, error) {
        if (!error) {
          this.setState({
            channel: channel,
          });
          this.state.channel.createPreviousMessageListQuery()
            .load(200, false, function (messageList, error) {
              if (error) {
                alert(JSON.stringify(error));
              } else {
                this.convertSendBirdListToGiftedChatList(messageList, (nMessageList) => {
                  this.setState({
                    messages: nMessageList,
                  });
                  this.state.channel.markAsRead();
                  if (typeof callback === 'function') {
                    callback();
                  }
                });
              }
            }.bind(this));
        }
      }.bind(this));
  }

  connectSendBird(callback) {
    this.sb.connect(this.me.userId, (user, error) => {
      this.sb.removeChannelHandler('ChatPage');
      this.sb.addChannelHandler('ChatPage', this.ChannelHandler);

      if (callback) {
        callback(user, error);
      }
    });
  }

  appendSendBirdMessage(SendBirdMessage) {
    this.setState((previousState) =>
      ({
        messages: GiftedChat.append(
          previousState.messages,
          this.convertSendBirdMsgToGiftedChatMsg(SendBirdMessage)),
      })
    );
  }

  convertSendBirdMsgToGiftedChatMsg(SendBirdMessage) {
    return {
      _id: SendBirdMessage.messageId,
      text: SendBirdMessage.message,
      createdAt: SendBirdMessage.createdAt,
      user: {
        _id: SendBirdMessage.sender.userId,
        name: SendBirdMessage.sender.nickname,
        avatar: SendBirdMessage.sender.profileUrl,
      },
    };
  }

  convertSendBirdListToGiftedChatList(SendBirdMessageList, callback) {
    let itemsProcessed = 0;
    let giftedChatMessageList = [];

    SendBirdMessageList.forEach((SendBirdMessage, index, array) => {
      giftedChatMessageList.unshift(this.convertSendBirdMsgToGiftedChatMsg(SendBirdMessage));
      itemsProcessed++;
      if (itemsProcessed === array.length) {
        callback(giftedChatMessageList);
      }
    });
  }

  onMessageReceived(channel, userMessage) {

    if (channel.url == this.state.channel.url) {
      this.appendSendBirdMessage(userMessage);
      channel.markAsRead();
    } else {
      Vibration.vibrate();
      FcmUtil.presentLocalChatNotification(userMessage);
    }
  }

  onTypingStatusUpdated(channel) {
    if (channel.url === this.state.channel.url) {
      if (channel.isTyping() && SendBird().getConnectionState() === 'OPEN') {
        this.setState({
          isTyping: true,
        });
        this.lastTyping = Date.now();
        setTimeout(()=> {
          if (this.lastTyping + 1000 < Date.now()) {
            this.setState({
              isTyping: false,
            });
          }
        }, 1500);
      }
    }
  }

  onReadReceiptUpdated(channel) {

    //Todo : Implement mark as read feature.
  }

  onConnectionStateChange(isConnected) {
    this.isConnected = isConnected;
    if (this.isConnected) {
      this.initChatPage(() => {
      });
    } else {
      this.sb.removeChannelHandler('ChatPage');
      this.sb.disconnect();
    }
  }

  onOpponentInfoRequest(result, error) {
    if (error) {
      alert(JSON.stringify(error));
    } else if (result) {
      this.setState({
        opponentInfo: result,
      });
    }
  }

  onSend(messages = []) {
    if (this.sb.getConnectionState() === 'OPEN') {
      this.setState((previousState) =>
        ({ messages: GiftedChat.append(previousState.messages, messages) })
      );
      this.state.channel.sendUserMessage(messages[0].text, '', function (message, error) {
        if (error) {
          alert(JSON.stringify(error));
        }
      }.bind(this));
    }
  }

  renderFooter() {
    if (this.state.isTyping) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.opponentInfo.name} is typing.
          </Text>
        </View>
      );
    }

    return null;
  }

  render() {
    return (
      <GiftedChat
        style={styles.container}
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        channel={this.state.channel}
        user={{
          _id: this.me.userId,
        }}
        opponentInfo={this.state.opponentInfo}
        renderFooter={this.renderFooter}
        loadEarlier
        isLoadingEarlier
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

module.exports = ChatPage;
