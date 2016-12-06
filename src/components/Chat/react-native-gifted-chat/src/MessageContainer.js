import React from 'react';

import {
  Image,
  ListView,
  Row,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../Shared/UniText';

import shallowequal from 'shallowequal';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1.hash !== r2.hash),
    });

    const messagesData = this.prepareMessages(props.messages);
    this.state = {
      dataSource: dataSource.cloneWithRows(messagesData.blob, messagesData.keys),
      remainSpace: 0,
      opponentInfo: props.opponentInfo,
    };
  }

  prepareMessages(messages) {
    return {
      keys: messages.map(m => m._id),
      blob: messages.reduce((o, m, i) => {
        const previousMessage = messages[i + 1] || {};
        const nextMessage = messages[i - 1] || {};

        // add next and previous messages to hash to ensure updates
        const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id;
        o[m._id] = {
          ...m,
          previousMessage,
          nextMessage,
          hash: md5(toHash),
        };
        return o;
      }, {}),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }

    if (!shallowequal(this.state, nextState)) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }

    const messagesData = this.prepareMessages(nextProps.messages);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(messagesData.blob, messagesData.keys),
      opponentInfo: nextProps.opponentInfo,
    });
  }

  getExperienceInfo(user) {
    let experienceInfo = '';
    if (user) {
      if (user.experience && user.experience.length > 0) {
        if (user.experience[0].position && user.experience[0].employer) {
          experienceInfo = `${user.experience[0].position.name} at ` +
            `${user.experience[0].employer.name}`;
        } else {
          if (user.experience[0].position) {
            experienceInfo = user.experience[0].position.name;
          } else if (user.experience[0].employer) {
            experienceInfo = user.experience[0].employer.name;
          }
        }
      }
    }

    return experienceInfo;
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }

    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }

      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }

    return null;
  }

  scrollTo(options) {
    this._invertibleScrollViewRef.scrollTo(options);
  }

  renderRow(message, sectionId, rowId) {
    if (!message._id && message._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(message));
    }

    if (!message.user) {
      console.warn('GiftedChat: `user` is missing for message', JSON.stringify(message));
      message.user = {};
    }

    const messageProps = {
      ...this.props,
      key: message._id,
      currentMessage: message,
      previousMessage: message.previousMessage,
      nextMessage: message.nextMessage,
      position: message.user._id === this.props.user._id ? 'right' : 'left',
    };
    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }

    return <Message {...messageProps}/>;
  }

  renderScrollComponent(props) {
    const invertibleScrollViewProps = this.props.invertibleScrollViewProps;
    return (
      <InvertibleScrollView
        {...props}
        {...invertibleScrollViewProps}
        ref={component => this._invertibleScrollViewRef = component}
      />
    );
  }

  onMessageContentSizeChange(contentWidth, contentHeight) {
    this.messageContentHeight = contentHeight;
    this.refreshRemainSpace();
  }

  onMessageContainerOnLayout(event) {
    this.messageContainerHeight = event.nativeEvent.layout.height;
    this.refreshRemainSpace();
  }

  refreshRemainSpace() {
    this.setState({ remainSpace: this.messageContainerHeight - this.messageContentHeight });
  }

  renderIfRemainSpaceisBiggerThanHeaderSize() {
    if (this.state.remainSpace > 0) {
      return this.renderHeader();
    }

    return null;
  }

  renderIfRemainSpaceisSmallerThanHeaderSize() {
    if (this.state.remainSpace < 0) {
      return this.renderHeader();
    }

    return null;
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Image style={styles.photo}
                 source={
                   { uri: this.state.opponentInfo ? this.state.opponentInfo.profile_picture : '' }
                 }
          />
          <View style={styles.userInformation}>
            <Text style={styles.name}>
              {this.state.opponentInfo ? this.state.opponentInfo.name : ''}
            </Text>
            <Text style={styles.experience}>
              {this.getExperienceInfo(this.state.opponentInfo)}
            </Text>
            <Text style={styles.connectMessage}>
              You are connected now.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View ref='container'
            style={{ flex: 1 }}
            onLayout={this.onMessageContainerOnLayout.bind(this)}
      >
        {this.renderIfRemainSpaceisBiggerThanHeaderSize()}
        <ListView
          enableEmptySections={true}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
          initialListSize={20}
          pageSize={20}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderFooter}
          renderFooter={this.renderIfRemainSpaceisSmallerThanHeaderSize.bind(this)}
          renderScrollComponent={this.renderScrollComponent}
          onContentSizeChange={this.onMessageContentSizeChange.bind(this)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  headerContainer: {
    height: 100,
  },
  headerRow: {
    height: 100,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#efeff2',
  },
  photo: {
    height: 70,
    width: 70,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 35,
  },
  userInformation: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  name: {
    lineHeight: 15,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 24,

  },
  experience: {
    lineHeight: 12,
    fontSize: 12,
    paddingTop: 8,
    color: '#a6aeae',
  },
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: React.PropTypes.array,
  user: React.PropTypes.object,
  renderFooter: React.PropTypes.func,
  renderMessage: React.PropTypes.func,
  onLoadEarlier: React.PropTypes.func,
};
