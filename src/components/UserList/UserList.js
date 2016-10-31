import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Row from './Row';
import { Actions } from 'react-native-router-flux';
import ErrorMeta from '../../utils/ErrorMeta';
import ServerUtil from '../../utils/ServerUtil';
import CardScroll from './CardScroll';

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

    // Refresh dataSource
    this.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result.slice()),
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

  renderCardView() {
    return (
      <CardScroll
        dataSource={this.state.dataSource}
         renderRow={this.renderRow}
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

    return this.renderCardView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
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
