import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  ListView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import UserUtil from '../../utils/UserUtil';
import Row from './Row';
import Text from '../Shared/UniText';

class Bookmark extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      isRefreshing: false,
      isEmpty: false,
    };
  }

  onRequestCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      this.onRequestSuccess(result);
    }
  }

  onRequestSuccess(result) {
    this.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    });

    const bookmarked = result.slice();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(bookmarked),
      loaded: true,
      isRefreshing: false,
      isEmpty: bookmarked.length === 0,
    });
  }

  componentDidMount() {
    UserUtil.getBookmarkList(this.onRequestCallback.bind(this));
  }

  // Receive props befofe completely changed
  componentWillReceiveProps(props) {
    UserUtil.getBookmarkList(this.onRequestCallback.bind(this));
  }

  // Render loading page while fetching bookmark lists.
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size='small'
      />
    );
  }

  renderRow(rowData) {
    return <Row dataSource={rowData} me={this.props.me}/>;
  }

  renderBookmarked() {
    if (this.state.isEmpty)
      return (
        <View style={styles.container}>
          <Image source={require('../../resources/bookmark_onboarding.png')}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bookmark someone!</Text>
          </View>
        </View>
      );
    else {
      return (
        <ListView
          style={styles.listView}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
      );
    }
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderBookmarked();
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#efeff2',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.heightWeight * 20,
    paddingHorizontal: dimensions.widthWeight * 20,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionName: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: dimensions.heightWeight * 62,
  },
  title: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 20,
    textAlign: 'center',
    marginBottom: dimensions.heightWeight * 10,
  },
});

module.exports = Bookmark;
