import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class OverviewRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      about: '',
      keyword: '',
      personality: '',
      loaded: false,
    };
  }

  componentWillMount() {

    //TODO: will be updated with real data
    this.setState({
      about: 'Always happy to talk',
      keyword: '# motivation # prefered_skill',
      personality: 'Listener active',
      loaded: true,
    });
  }

  // Render loading page
  renderLoadingView() {
    return (
      <ActivityIndicator
        animating={!this.state.loaded}
        style={[styles.activityIndicator]}
        size="large"
        />
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else {
      return (
        <View style={styles.container}>
          <Text style ={styles.name}>{this.state.about}</Text>
          <Text style ={styles.period}>{this.state.keyword}</Text>
          <Text style ={styles.period}>{this.state.personality}</Text>
          <View style={styles.seperator}></View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  name: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginBottom: 5,
    color: '#2e3031',
  },
  position: {
    fontSize: 14,
    color: '#2e3031',
  },
  period: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    marginBottom: 5,
    color: '#a6aeae',
  },
  seperator: {
    alignItems: 'stretch',
    borderWidth: 1,
    height: 2,
    borderColor: '#efeff2',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

module.exports = OverviewRow;
