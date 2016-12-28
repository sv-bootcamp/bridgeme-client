import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import Overlay from './overlay';
import Items from './items';

const window = Dimensions.get('window');

class OptionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0,
      positionX: 0,
      positionY: 0,
      items: [],
      seleted: null,
      onSelect: () => { },
    };
  }

  currentPosition(pageX, pageY) {
    this.setState({
      ...this.state,
      pageX,
      pageY,
    });
  }

  show(items, selected, positionX, positionY, width, height, onSelect) {
    let heightOptionList = (items.length > 3) ? height * 3 + height / 4 : height * (items.length);

    positionX = positionX - this.state.pageX;
    positionY = (positionY + heightOptionList < window.height) ? 0 : -heightOptionList - height;

    this.setState({
      ...this.state,
      positionX,
      positionY,
      width,
      height,
      items,
      onSelect,
      show: true,
      selected: selected,
    });
  }

  onOverlayPress() {
    const { onSelect } = this.state;
    onSelect(null, null);

    this.setState({
      ...this.state,
      show: false,
    });
  }

  onItemPress(item, value) {
    const { onSelect } = this.state;
    onSelect(item, value);
    this.setState({
      ...this.state,
      show: false,
    });
  }

  getShowState() {
    return this.state.show;
  }

  render() {
    const {
      items,
      pageX,
      pageY,
      positionX,
      positionY,
      width,
      height,
      show,
      selected,
    } = this.state;
    return (
      <View>
        <Overlay
          pageX={pageX}
          pageY={pageY}
          show={show && this.props.overlayEnable}
          onPress={ this.onOverlayPress.bind(this) }/>
        <Items
          items={items}
          positionX={positionX}
          positionY={positionY}
          width={width}
          height={height}
          show={show}
          selected={selected}
          onPress={ this.onItemPress.bind(this) }/>
      </View>
    );
  }
}

OptionList.propTypes = {

};

OptionList.defaultProps = {

};

module.exports = OptionList;
