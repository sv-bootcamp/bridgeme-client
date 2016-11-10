import React, { Component } from 'react';
import {
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import Row from './Row';

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
    });
  }

  renderRow(rowData) {
    return <Row dataSource={rowData} onSelect={this.onRequestSuccess.bind(this)}/>;
  }

  render() {
    return (
      <ListView
        style={styles.listView}
        dataSource = {this.state.dataSource}
        renderRow  = {this.renderRow.bind(this)}
        enableEmptySections={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#F5FCFF',
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
});
module.exports = NewRequests;
