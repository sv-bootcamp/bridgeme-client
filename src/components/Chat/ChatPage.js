import React, { Component } from 'react';
import {
  AsyncStorage,
  ListView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { GiftedChat }  from './react-native-gifted-chat';
import SendBird from 'sendbird';
import ServerUtil from '../../utils/ServerUtil';

class ChatPage extends Component {
  constructor(props) {
    super(props);

    this.sb = SendBird();
    this.lastTyping = null;
    this.renderFooter = this.renderFooter.bind(this);

    this.ChannelHandler = new this.sb.ChannelHandler();
    this.ChannelHandler.onMessageReceived = this.onMessageReceived.bind(this);
    this.ChannelHandler.onTypingStatusUpdated = this.onTypingStatusUpdated.bind(this);
    this.ChannelHandler.onReadReceiptUpdated = this.onReadReceiptUpdated.bind(this);

    this.state = {
      messages: [],
      channel: props.channel,
      isTyping: false,
    };
  }

  componentDidMount() {
    this.initChatPage(this.props.me, this.props.opponent);
  }

  componentWillReceiveProps(nextProps = {}) {
    if (this.props.opponent === nextProps.opponent) {
      return;
    }

    this.setState({
      messages: [],
      isTyping: false,
    });
    this.initChatPage(nextProps.me, nextProps.opponent);
  }

  componentWillUnmount() {
    if (this.state.channel) {
      this.sb.removeChannelHandler(this.state.channel.url);
    }
  }

  onMessageReceived(channel, userMessage) {
    if (channel.url == this.state.channel.url) {
      this.appendSendBirdMessage(userMessage);
      channel.markAsRead();
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
    console.log('ChannelHandler.onReadReceiptUpdated: ', channel);
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

  initChatPage(me, opponent) {
    if (SendBird().getConnectionState() === 'OPEN') {
      if (this.state.channel) {
        this.sb.removeChannelHandler(this.state.channel.url);
      }

      this.setState({
        messages: [],
        channel: null,
      });

      const userIds = [me.userId, opponent.userId];

      ServerUtil.initCallback(
        (result) => this.onServerSuccess(result),
        (error) => this.onServerFail(error));
      ServerUtil.getOthersProfile(opponent.userId);

      this.sb.GroupChannel.createChannelWithUserIds(
        userIds, true, '', '', '', function (channel, error) {
          if (error) {
            throw new Error();
          } else {
            this.setState({
              channel: channel,
            });
            this.sb.addChannelHandler(this.state.channel.url, this.ChannelHandler);
            this.state.channel.createPreviousMessageListQuery()
              .load(200, false, function (messageList, error) {
                if (error) {
                  throw new Error(error);
                } else {
                  this.convertSendBirdListToGiftedChatList(messageList, (nMessageList) => {
                    this.setState({
                      messages: nMessageList,
                    });
                    this.state.channel.markAsRead();
                  });
                }
              }.bind(this));
          }
        }.bind(this));
    } else {
      alert('Please check Network status.');
      Actions.pop();
    }
  }

  onServerSuccess(opponentInfo) {
    this.setState({
      opponentInfo: opponentInfo,
    });
  }

  onServerFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  onSend(messages = []) {
    if (SendBird().getConnectionState() === 'OPEN') {
      this.setState((previousState) =>
        ({ messages: GiftedChat.append(previousState.messages, messages) })
      );
      this.state.channel.sendUserMessage(messages[0].text, '', function (message, error) {
        if (error) {
          throw new Error();
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
          _id: this.props.me.userId,
        }}
        opponentInfo={this.state.opponentInfo}
        loadEarlier={true}
        renderFooter={this.renderFooter}
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
