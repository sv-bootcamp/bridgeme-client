import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  ListView,
} from 'react-native';

import Row from './Row';
import Header from './Header';

class UserList extends Component {
  constructor(props) {
    super(props);

    // Method 'rowHasChanged' must be implemented to use listview.
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {

      // Initialize with mock data for testing listview.
      dataSource: dataSource.cloneWithRows([1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5,1, 2, 3, 4, 5]),
    };
  }

  componentDidMount() {
    this._refreshData();
  }

  _renderRow(rowData) {
    return <Row />;
  }

  // Refresh listview.
  _refreshData() {

    // TODO: Get user list via fetch API
    // fetch(ENDPOINT)
    //   .then((response) => response.json())
    //   .then((rjson) => {
    //     this.setState({
    //       dataSource:
    // this.state.dataSource.cloneWithRows(rjson.results),
    //     });
    //   });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={()=> <Header />}
        renderRow={this._renderRow}
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
  tab: {
    flex: 1,
  },
});

module.exports = UserList;
