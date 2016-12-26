import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { dimensions } from '../../components/Shared/Dimensions';
import Option from './option';

const window = Dimensions.get('window');

const SELECT = 'SELECT';

const styles = StyleSheet.create({
  container: {
    borderColor: '#efeff2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

class Select extends Component {
  constructor(props) {
    super(props);

    this.pageX = 0;
    this.pageY = 0;

    let defaultValue = props.defaultValue;

    if (!defaultValue) {
      if (Array.isArray(props.children)) {
        defaultValue = props.children[0].props.children;
      } else {
        defaultValue = props.children.props.children;
      }
    }

    this.state = {
      value: defaultValue,
      show: true,
    };
  }

  reset() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }

  currentPosition(pageX, pageY) {
    this.pageX = pageX;
    this.pageY = pageY + this.props.height;
  }

  onPress() {
    const {
      index,
      optionListRef,
      children,
      onSelect,
      width,
      height,
    } = this.props;
    if (!children.length) {
      return false;
    }

    if (this.props.onPress)
      this.props.onPress();

    let show = optionListRef(index).getShowState();

    if (this.state.show !== show) {
      this.setState({
        show: show,
      });
    }

    optionListRef(index).show(children, this.state.value, this.pageX, this.pageY, width, height,
      (item, value=item) => {
      if (item) {
        onSelect(value, index);
        this.state.value = item;
      }

      this.setState({
        show: optionListRef(index).getShowState(),
      });
    });
  }

  render() {
    const {
      clear,
      optionListRef,
      width,
      height,
      children,
      defaultValue,
      style,
      styleOption,
      styleText,
      activate,
      value,
      pressed,
    } = this.props;
    const dimensions = { width, height };

    let bgColor = (activate) ? '#ffffff' : '#fafafa';
    if (value) this.state.value = value;
    if (clear) this.state.value = '';
    let active = (pressed !== undefined) ? !pressed && activate : activate;
    return (
      <TouchableWithoutFeedback disabled={!active} onPress={this.onPress.bind(this)}>
        <View ref={SELECT}
          style={[styles.container, style, dimensions, { backgroundColor: bgColor }]}>
          <Option style={ styleOption } styleText={ styleText }
            value={this.state.value} show={this.state.show} defaultValue={defaultValue}>
            {this.state.value}
          </Option>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Select.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  optionListRef: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
};

Select.defaultProps = {
  width: dimensions.widthWeight * 100,
  height: dimensions.heightWeight * 40,
  onSelect: () => { },
};

module.exports = Select;
