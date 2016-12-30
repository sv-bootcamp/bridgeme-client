import React, { PropTypes, Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';

export default class CardScroll extends Component {
  constructor(props) {
    super(props);
    this.resetListView = null;
    this.resetPrevListView = null;
    this.previewOffset = 0;
    this.controlScroll = this.controlScroll.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.renderView = this.renderView.bind(this);
    this.bias = 0;
    this.state = {
      showPreview: props.showPreview,
      scrollBegin: 0,
    };
  }

  componentDidMount() {
    this.reset();
  }

  componentWillReceiveProps() {
    this.reset();
  }

  // Reset card page
  reset() {
    const { initialIdx, previewImageSize, width } = this.props;
    this.resetListView.scrollTo({ x: initialIdx * width, animated: false });
    if (this.resetPrevListView !== null) {
      this.resetPrevListView.scrollTo({
        x: ((initialIdx - 2) * previewImageSize) + this.bias,
        animated: false,
      });
    }
  }

  // Control preview page and next page
  controlScroll(e) {
    const event = e.nativeEvent;
    const interval = Dimensions.get('window').width - (dimensions.widthWeight * 57);

    let rate = event.contentOffset.x / interval
    - Math.floor(event.contentOffset.x / interval);
    let moveTo;
    if (rate <= 0.25 || rate >= 0.75) {
      moveTo = (Math.round(event.contentOffset.x / interval));
    } else {
      moveTo = (event.contentOffset.x - this.state.scrollBegin >= 0) ?
      (Math.ceil(event.contentOffset.x / interval)) :
      (Math.floor(event.contentOffset.x / interval));
    }

    if (moveTo > this.props.dataSource._cachedRowCount - 1) {
      moveTo -= 1;
    }

    this.resetListView.scrollTo({
      x: moveTo * interval,
      y: 0,
      animated: true,
    });

  }

  // Control preview page and next page
  controlScrollBegin(e) {
    const event = e.nativeEvent;
    this.state.scrollBegin = event.contentOffset.x;
  }

  renderView(row) {
    const {
      width,
      height,
      imageStyle,
      previewImageSize,
      getImageSourceFromDataSource,
    } = this.props;
    let imageHeight = height;
    if (this.state.showPreview) {
      imageHeight -= previewImageSize;
    }

    return (
      <Image
        style={
          [imageStyle, { width, height: imageHeight },
        ]}
        source={getImageSourceFromDataSource(row.image)}
        resizeMode="contain"
      />
    );
  }

  renderScrollComponent(props) {
    return React.cloneElement(
      this.props.renderScrollComponent(props),
      {
        horizontal: true,
        pagingEnabled: false,
        directionalLockEnabled: true,
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        automaticallyAdjustContentInsets: true,
        enableEmptySections: true,
        ...props,
      },
    );
  }

  render() {
    return (
      <ListView
        renderScrollComponent={this.renderScrollComponent}
        onScrollBeginDrag={this.controlScrollBegin.bind(this)}
        onScrollEndDrag={this.controlScroll.bind(this)}
        initialListSize={5}
        dataSource={this.props.dataSource}
        style={styles.listView}
        enableEmptySections
        renderRow={this.props.renderRow.bind(this)}
        ref={(comp) => { this.resetListView = comp; }}
      />
    );
  }
}

CardScroll.propTypes = {
  dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
  initialIdx: PropTypes.number,
  showPreview: PropTypes.bool,
  previewImageSize: PropTypes.number,
  renderScrollComponent: PropTypes.func,
  style: View.propTypes.style,
  imageStyle: View.propTypes.style,
  width: PropTypes.number,
  height: PropTypes.number,
  getImageSourceFromDataSource: PropTypes.func,
};

CardScroll.defaultProps = {
  initialIdx: 0,
  showPreview: true,
  previewImageSize: 80,
  renderScrollComponent: (props) => {
    const style = styles.contentContainerStyle;
    return <ScrollView contentContainerStyle={style} {...props} />;
  },

  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  getImageSourceFromDataSource: row => row,
};

const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dimensions.widthWeight * 10,
    paddingVertical: HEIGHT / 10,
    flex: 1,
  },
  listView: {
    backgroundColor: 'transparent',
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: ((dimensions.heightWeight * 74) + 20) - (45 * (1 - dimensions.heightWeight)),
      },
      android: {
        marginTop: dimensions.heightWeight * 74,
      },
    }),
  },
  contentContainerStyle: {
    paddingLeft: dimensions.widthWeight * 36,
    paddingRight: dimensions.widthWeight * 36,
  },
});
