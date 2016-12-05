import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.tabIconsGray = [];
    this.tabIconsBlue = [];

    this.tabIconsGray.push(require('../../resources/icon-home-solid_gray.png'));
    this.tabIconsGray.push(require('../../resources/icon-line_gray.png'));
    this.tabIconsGray.push(require('../../resources/icon-activity_gray.png'));
    this.tabIconsGray.push(require('../../resources/icon-chat_gray.png'));
    this.tabIconsGray.push(require('../../resources/icon-profile_gray.png'));

    this.tabIconsBlue.push(require('../../resources/icon-home-solid_blue.png'));
    this.tabIconsBlue.push(require('../../resources/icon-line_blue.png'));
    this.tabIconsBlue.push(require('../../resources/icon-activity_blue.png'));
    this.tabIconsBlue.push(require('../../resources/icon-chat_blue.png'));
    this.tabIconsBlue.push(require('../../resources/icon-profile_blue.png'));
  }

  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) =>
          <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
            <Image
              source={this.props.activeTab === i ? this.tabIconsBlue[i] : this.tabIconsGray[i]}/>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

TabBar.propTypes = {
  goToPage: React.PropTypes.func,
  activeTab: React.PropTypes.number,
  tabs: React.PropTypes.array,
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 10,
    borderWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#d6dada',
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

module.exports = TabBar;
