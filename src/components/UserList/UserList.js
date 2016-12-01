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
import CardScroll from './CardScroll';
import UserUtil from '../../utils/UserUtil';

class UserList extends Component {
  constructor(props) {
    super(props);

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
    this.setState({ isRefreshing: true });
    UserUtil.getMentorList(this.onServerCallback.bind(this));
  }

  onServerCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      // Refresh dataSource
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      });

      result[result.length - 1].last = true;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(result.slice()),
        loaded: true,
        isRefreshing: false,
      });
    }
  }

  componentDidMount() {
    UserUtil.getMentorList(this.onServerCallback.bind(this));
  }

  renderRow(rowData, sectionID, rowID) {
    rowData['rowID'] = rowID;
    return <Row dataSource={rowData}/>;
  }

  renderLoadingView() {
    return (
        <View style={styles.header}>
          <ActivityIndicator
            animating={!this.state.loaded}
            style={[styles.activityIndicator]}
            size="large"
            />
          <Text style={styles.headerText}>Loading...</Text>
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
