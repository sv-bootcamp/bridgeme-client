import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import Text from '../Shared/UniText';

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
          <TouchableWithoutFeedback key={tab} onPress={() => this.props.goToPage(i)}>
            <View style={styles.tab}>
              <Image
                style={styles.iconStyle}
                source={this.props.activeTab === i ? this.tabIconsBlue[i] : this.tabIconsGray[i]}/>
            </View>
          </TouchableWithoutFeedback>
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: dimensions.heightWeight * 10,
  },
  tabs: {
    height: dimensions.heigthWeight * 45,
    flexDirection: 'row',
    paddingTop: dimensions.heightWeight * 10,
    backgroundColor: '#fbfbfb',
    borderWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#d6dada',
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconStyle: {
    width: dimensions.widthWeight * 26,
    height: dimensions.heightWeight * 26,
    resizeMode: 'contain',
  },
});

module.exports = TabBar;
