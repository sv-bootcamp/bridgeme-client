import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Row from './Row';
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
      loaded: false,
      isRefreshing: false,
    };
  }

  // Refresh data
  onRefresh() {
    ServerUtil.initCallback(
      (result) => this.onServerSuccess(result),
      (error) => this.onServerFail(error));

    this.setState({ isRefreshing: true });
    ServerUtil.getMentorList();
  }

  onServerSuccess(result) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result),
      loaded: true,
      isRefreshing: false,
    });
  }

  onServerFail(error) {

    // Check whether session expires
    if (error.code === 2) {
      Actions.login({ session: true });
    } else if (error.code !== ErrorMeta.ERR_NONE) {
      alert(error.msg);
    }
  }

  componentDidMount() {
    ServerUtil.getMentorList();
  }

  renderRow(rowData) {
    return <Row dataSource={rowData}/>;
  }

  renderLoadingView() {
    return (
        <View style={styles.header}>
          <Text style={styles.headerText}>Loading...</Text>
          <ActivityIndicator
            animating={!this.state.loaded}
            style={[styles.activityIndicator]}
            size="large"
            />
        </View>
    );
  }

  renderListView() {
    return (
      <ListView style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#1ecfe2"
            title="Loading..."
            titleColor="#0e417a"
            style={{ backgroundColor: 'transparent' }}
          />
        }
      />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderListView();
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
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 250,
  },
  headerText: {
    fontSize: 20,
    color: '#0e417a',
  },
});

module.exports = UserList;
