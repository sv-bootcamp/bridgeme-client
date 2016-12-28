const React = require('react');
const ReactNative = require('react-native');
const {
  Dimensions,
  StyleSheet,
  Text,
  View,
} = ReactNative;
const Button = require('./Button');

class DefaultTabBar extends Component {
  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (<Button
      style={{ flex: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle,]}>
        <Text style={[{ color: textColor, fontWeight, }, textStyle,]}>
          {name}
        </Text>
      </View>
    </Button>);
  }

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 0.5,
      backgroundColor: 'navy',
      bottom: -0.5,
    };

    const tabUnderlineFullWidthStyle = {
      position: 'absolute',
      width: WIDTH,
      height: 0.5,
      borderColor: '#f0f0f2',
      borderBottomWidth: 1,
      bottom: 0,
      zIndex: -1,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ],
      outputRange: [this.props.leftOffset,  (containerWidth / 2) - this.props.rightOffset, ],
    });

    return (
      <View>
        <View
          style={[
            styles.tabs,
            { backgroundColor: this.props.backgroundColor, },
            this.props.style,
            ]}>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage);
          })}
          <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
        </View>
        <View style={tabUnderlineFullWidthStyle} />
      </View>
    );
  }
}

DefaultTabBar.propTypes = {
  goToPage: React.PropTypes.func,
  activeTab: React.PropTypes.number,
  containerWidth: React.PropTypes.number,
  leftOffset: React.PropTypes.number,
  rightOffset: React.PropTypes.number,
  tabs: React.PropTypes.array,
  backgroundColor: React.PropTypes.string,
  activeTextColor: React.PropTypes.string,
  inactiveTextColor: React.PropTypes.string,
  textStyle: Text.propTypes.style,
  tabStyle: View.propTypes.style,
  style: View.propTypes.style,
  renderTab: React.PropTypes.func,
  underlineStyle: View.propTypes.style,
};

DefaultTabBar.defaultProps = {
  activeTextColor: 'navy',
  inactiveTextColor: 'black',
  backgroundColor: null,
};

const WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#f0f0f2',
  },
});

module.exports = DefaultTabBar;
