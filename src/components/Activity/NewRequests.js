import React, { Component } from 'react';
import {
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import NewRequestsRow from './NewRequestsRow';

class NewRequests extends Component {
  constructor(props) {
    super(props);

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      loaded: false,
      isEmpty: false,
    };
  }

  componentDidMount() {
    ServerUtil.getActivityList();
  }

  onRequestFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  onRequestSuccess(result) {
    const REQUESTED_PENDING = 2;
    const REQUESTED_ACCEPT = 1;

    let newRequests = result.requested.filter((value) => value.status === REQUESTED_ACCEPT);
    newRequests = newRequests.map((value) => value.detail[0]);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newRequests),
      loaded: true,
      isEmpty: newRequests.length === 0,
    });
  }

  renderRow(rowData, sectionID, rowID) {
    return <NewRequestsRow dataSource={rowData}
      onSelect={this.onRequestSuccess.bind(this)} id={rowID}/>;
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: 1,
          backgroundColor: '#efeff2',
          marginLeft: 70,
        }}
      />
    );
  }

  render() {
    if (this.state.isEmpty)
      return (
        <View style={styles.container}>
          <Image source={require('../../resources/chat_onboarding.png')}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Make a connection!</Text>
            <Text style={{ color: '#a6aeae', fontSize: 14, }}>
              You did not connect with anyone yet.
            </Text>
          </View>
        </View>
      );
    else
      return (
        <ListView
          style={styles.listView}
          dataSource = {this.state.dataSource}
          renderRow  = {this.renderRow.bind(this)}
          renderSeparator={this.renderSeparator}
          enableEmptySections={true}
        />
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  listView: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 62,
  },
  title: {
    color: '#a6aeae',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
});
module.exports = NewRequests;
