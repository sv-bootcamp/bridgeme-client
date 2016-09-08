import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  ListView,
  Platform,
} from 'react-native';

import Row from './Row';
import Header from './Header';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../../utils/ErrorMeta';
import ServerUtil from '../../utils/ServerUtil';

class UserList extends Component {
  constructor(props) {
    super(props);

    ServerUtil.initCallback(
      (result) => this.onServerSuccess(result),
      (error) => this.onServerFail(error));

    // Method 'rowHasChanged' must be implemented to use listview.
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  onServerSuccess(result) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result),
    });
  }

  onServerFail(error) {
    if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }

    Actions.login();
  }

  componentDidMount() {
    ServerUtil.getMentorList();
  }

  renderRow(rowData) {
    return <Row dataSource={rowData}/>;
  }

  render() {
    return (
      <ListView style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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

module.exports = UserList;
