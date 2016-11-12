import React, { Component } from 'react';
import {
  BackAndroid,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment/min/moment.min';

export default class Row extends Component {
  constructor(props) {
    super(props);

    if (props.dataSource.members[0].userId == props.myId) {
      this.me = props.dataSource.members[0];
      this.opponent = props.dataSource.members[1];
    } else {
      this.me = props.dataSource.members[1];
      this.opponent = props.dataSource.members[0];
    }

    this.goToChat = this.goToChat.bind(this);
    this.state = {
      channel: props.dataSource,
      me: this.me,
      opponent: this.opponent,
      lastMessageInfo: props.dataSource.lastMessage,
      unreadCount: props.dataSource.unreadMessageCount,
    };
  }

  componentWillReceiveProps(props) {
    if (props.dataSource.members[0].userId == props.myId) {
      this.me = props.dataSource.members[0];
      this.opponent = props.dataSource.members[1];
    } else {
      this.me = props.dataSource.members[1];
      this.opponent = props.dataSource.members[0];
    }

    this.setState({
      channel: props.dataSource,
      me: this.me,
      opponent: this.opponent,
      lastMessageInfo: props.dataSource.lastMessage,
      unreadCount: props.dataSource.unreadMessageCount,
    });
  }

  goToChat() {
    Actions.chatPage({
      title: this.state.opponent.nickname,
      me: this.state.me,
      opponent: this.state.opponent,
      channel: this.state.channel,
    });
  }

  renderUnreadCount() {
    if (this.state.unreadCount != 0) {
      return (
        <View style={styles.unreadCountContainer}>
          <Text style={styles.unreadCountText}>
            {this.state.unreadCount}
          </Text>
        </View>
      );
    }

    return null;
  }

  getTimestamp() {
    const createdAt = this.state.lastMessageInfo.createdAt;
    return this.state.lastMessageInfo ?
      (
        moment(Date.now()).startOf('day').isSame(moment(createdAt).startOf('day')) ?
        moment(createdAt).format('LT') :
        moment(createdAt).format('MMM DD')
      )
      : '';
  }

  render() {
    return (
      <TouchableHighlight underlayColor='lightgray' onPress={this.goToChat}>
        <View style={styles.row}>
          <Image style={styles.photo}
                 source={{ uri: this.state.opponent.profileUrl }}/>
          <View style={styles.userInformation}>
            <View style={styles.leftSection}>
              <Text style={styles.name}>
                {this.state.opponent.nickname}
              </Text>
              <Text style={styles.lastMessage}>
                {this.state.lastMessageInfo ? this.state.lastMessageInfo.message : ''}
              </Text>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.rightTopSection}>
                <Text style={styles.lastTimestamp}>
                  {this.getTimestamp()}
                </Text>
                <Image
                  style={styles.onboardingImage}
                  source={require('../../resources/indicator_right.png')}
                />
              </View>
              {this.renderUnreadCount()}
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  photo: {
    height: 40,
    width: 40,
    margin: 15,
    borderRadius: 20,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
    borderColor: '#e3e3e3',
  },

  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    lineHeight: 14,
    height: 16,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 18,
    color: '#494b4c',

  },
  lastMessage: {
    lineHeight: 12,
    height: 14,
    fontSize: 12,
    marginTop: 6,
    fontWeight: 'normal',
    color: '#a6aeae',
  },
  rightSection: {
    width: 120,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  rightTopSection: {
    marginTop: 10,
    flexDirection: 'row',
  },
  lastTimestamp: {
    fontSize: 10,
    paddingRight: 10,
    lineHeight: 10,
    fontWeight: 'normal',
    color: '#a6aeae',
  },
  unreadCountContainer: {
    width: 31,
    height: 20,
    marginTop: 17,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fd5b52',
  },
  unreadCountText: {
    fontSize: 12,
    color: '#ffffff',
    letterSpacing: -0.3,
    backgroundColor: 'transparent',
  },
});
