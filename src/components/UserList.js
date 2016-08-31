import React, { Component } from 'react';
import {
 StyleSheet,
 Text,
 View,
 Navigator,
 Image,
 ListView,
} from 'react-native';

class UserList extends Component {

  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 != row2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(['1', '2', '3']),
    };
  }

  _renderRow(rowData) {
    return <Text style={styles.row}>{rowData}</Text>;
  }

  render() {
    return (
      <View Style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
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
