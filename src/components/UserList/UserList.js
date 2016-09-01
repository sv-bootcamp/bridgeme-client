import React, { Component } from 'react';
import {
 StyleSheet,
 Text,
 View,
 Navigator,
 Image,
 ListView,
} from 'react-native';
import Header from './Header';
import Footer from './Footer';
import Row from './Row';

const API_KEY = '73b19491b83909c7e07016f4bb4644f9:2:60667290';
const QUERY_TYPE = 'hardcover-fiction';
const API_STEM = 'http://api.nytimes.com/svc/books/v3/lists';
const ENDPOINT = `${API_STEM}/${QUERY_TYPE}?response-format=json&api-key=${API_KEY}`;

class UserList extends Component {
  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 != row2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows([1, 2, 3, 4, 5]),
    };
  }

  componentDidMount() {
    this._refreshData();
  }

  _renderRow(rowData) {
    return <Row />;
  }

  // Refresh listview
  _refreshData() {
    fetch(ENDPOINT)
      .then((response) => response.json())
      .then((rjson) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rjson.results.books),
        });
      });
  }

  render() {
    return (
      <View Style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={()=> <Header />}
          renderRow={this._renderRow}
          renderFooter={()=> <Footer />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: {
    flex: 1,
    fontSize: 12,
    padding: 30,
    borderWidth: 1,
    borderColor: 'grey',
  },
});

module.exports = UserList;
