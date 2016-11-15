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
      expertise: '',
      personality: '',
      loaded: false,
    };
  }

  componentWillMount() {

    //TODO: will be updated with real data
    this.setState({
      about: 'Always happy to talk',
      expertise: '# motivation # prefered_skill',
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
        size='small'
        />
    );
  }

  renderRow() {
    return (
      <View style={styles.container}>
        <Text style ={styles.about}>{this.state.about}</Text>
        <Text style ={styles.expertise}>{this.state.expertise}</Text>
        <Text style ={styles.personality}>{this.state.personality}</Text>
        <View style={styles.seperator}></View>
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return this.renderRow();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  about: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    marginBottom: 5,
    color: '#2e3031',
  },
  position: {
    fontSize: 14,
    color: '#2e3031',
  },
  expertise: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 12,
    marginBottom: 5,
    color: '#a6aeae',
  },
  personality: {
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
