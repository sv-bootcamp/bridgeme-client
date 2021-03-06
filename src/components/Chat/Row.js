import React, { Component } from 'react';
import {
  BackAndroid,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import moment from 'moment/min/moment.min';
import Text from '../Shared/UniText';

export default class Row extends Component {
  constructor(props) {
    super(props);
    if (props.dataSource.members[0].userId == props.me._id) {
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

    if (props.dataSource.members[0].userId == props.me._id) {
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
    if (this.state.lastMessageInfo) {
      const createdAt = this.state.lastMessageInfo.createdAt;
      return moment(Date.now()).startOf('day').isSame(moment(createdAt).startOf('day')) ?
        moment(createdAt).format('LT') :
        moment(createdAt).format('MMM DD');
    }
  }

  render() {
    if (!this.opponent) {
      return null;
    }

    const profileId = { _id: this.state.opponent.userId, me: this.props.me };
    const goToUserProfile = () => Actions.userProfile(profileId);

    return (
      <TouchableWithoutFeedback underlayColor='white' onPress={this.goToChat}>
        <View style={styles.row}>
          <TouchableWithoutFeedback underlayColor='white' onPress={goToUserProfile}>
            <Image style={styles.photo}
                   source={{ uri: this.state.opponent.profileUrl }}/>
          </TouchableWithoutFeedback>
          <View style={styles.userInformation}>
            <View style={styles.leftSection}>
              <Text style={styles.name}>
                {this.state.opponent.nickname}
              </Text>
              <Text ellipsizeMode={'tail'} numberOfLines = {1}  style={styles.lastMessage}>
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
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    height: 75,
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
    borderBottomWidth: 1,
    borderColor: '#f0f0f2',
  },

  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 18,
    color: '#494b4c',
  },
  lastMessage: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 18,
    fontWeight: 'normal',
    color: '#a6aeae',
  },
  rightSection: {
    width: 90,
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
