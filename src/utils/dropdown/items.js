import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Text from '../../components/Shared/UniText';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    height: 120,
    width: 100, //TODO: this needs to be dynamic
  },
  container: {
    position: 'absolute',
    borderColor: '#efeff2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
  },
});

class Items extends Component {
  constructor(props) {
    super(props);
  }

  renderItems(item) {
    let backColor = (item.props.children === this.props.selected) ? '#fafafa' : '#ffffff';
    let textColor = (item.props.children === this.props.selected) ? '#2e3031' : '#a6aeae';

    return (
        <View style={{ padding: 10, backgroundColor: backColor }}>
          <Text style={{ marginLeft: 10, color: textColor, fontSize: 14 }}>
            {item.props.children}
          </Text>
        </View>
    );
  }

  render() {
    const { items, positionX, positionY, show, onPress, width, height } = this.props;

    if (!show) {
      return null;
    }

    const renderedItems = React.Children.map(items, (item) =>
        <TouchableWithoutFeedback onPress={() => onPress(item.props.children, item.props.value) }>
          {this.renderItems(item)}
        </TouchableWithoutFeedback>
    );

    let h = (items.length > 3) ? height * 3 + height / 4 : height * items.length;
    return (
      <View style={[styles.container, { width: width, top: positionY, left: positionX }]}>
        <ScrollView
          style={{ width: width - 2, height: h }}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}
          bounces={false}>
          {renderedItems}
        </ScrollView>
      </View>
    );
  }
}

Items.propTypes = {
  positionX: React.PropTypes.number,
  positionY: React.PropTypes.number,
  show: React.PropTypes.bool,
  onPress: React.PropTypes.func,
};

Items.defaultProps = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
  show: false,
  onPress: () => {},
};

module.exports = Items;
