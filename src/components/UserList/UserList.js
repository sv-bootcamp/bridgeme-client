import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Row from './Row';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import CardScroll from './CardScroll';
import Text from '../Shared/UniText';
import MatchUtil from '../../utils/MatchUtil';

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

    AsyncStorage.getItem('filter', (error, result) => {
      if (result) {
        MatchUtil.getMentorList(this.onServerCallback.bind(this), JSON.parse(result));
      } else {
        MatchUtil.getMentorList(this.onServerCallback.bind(this));
      }
    });
  }

  // Refresh data
  onRefresh() {
    this.setState({ isRefreshing: true });

    AsyncStorage.getItem('filter', (error, result) => {
      if (result) {
        MatchUtil.getMentorList(this.onServerCallback.bind(this), JSON.parse(result));
      } else {
        MatchUtil.getMentorList(this.onServerCallback.bind(this));
      }
    });
  }

  onServerCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result.length !== 0) {

      // Refresh dataSource
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
      });
      result[result.length - 1].last = true;
      result.map((value) => {
        value.me = this.props.me;
        return value;
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(result.slice()),
        loaded: true,
        isRefreshing: false,
      });
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('filter', (error, result) => {
      if (result) {
        MatchUtil.getMentorList(this.onServerCallback.bind(this), JSON.parse(result));
      } else {
        MatchUtil.getMentorList(this.onServerCallback.bind(this));
      }
    });
  }

  componentWillReceiveProps(props) {
    AsyncStorage.getItem('filter', (error, result) => {
      if (result) {
        MatchUtil.getMentorList(this.onServerCallback.bind(this), JSON.parse(result));
      } else {
        MatchUtil.getMentorList(this.onServerCallback.bind(this));
      }
    });
  }

  renderRow(rowData, sectionID, rowID) {
    rowData['rowID'] = rowID;
    return <Row dataSource={rowData}/>;
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
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: dimensions.heightWeight * 250,
  },
  headerText: {
    fontSize: dimensions.fontWeight * 20,
    color: '#0e417a',
  },
});

module.exports = UserList;
