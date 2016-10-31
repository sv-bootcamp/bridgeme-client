import React, { PropTypes, Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class CardScroll extends Component {
  static propTypes = {
    dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    initialIdx: PropTypes.number,
    showPreview: PropTypes.bool,
    previewImageSize: PropTypes.number,
    renderScrollComponent: PropTypes.func,
    style: View.propTypes.style,
    previewContainerStyle: View.propTypes.style,
    imageStyle: View.propTypes.style,
    previewImageStyle: View.propTypes.style,
    width: PropTypes.number,
    height: PropTypes.number,
    getImageSourceFromDataSource: PropTypes.func,
    sizeOfPrevNext: PropTypes.number,
    pageWidth: PropTypes.number,
    inactiveCardScale: PropTypes.number,
    inactiveCardOpacity: PropTypes.number,
  };

  static defaultProps = {
    initialIdx: 0,
    showPreview: true,
    previewImageSize: 80,
    renderScrollComponent: (props) => <ScrollView {...props}/>,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    getImageSourceFromDataSource: (row) => row,
    inactiveCardScale: 0.9,
    inactiveCardOpacity: 1,
  };

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

    if (this.props.showPreview === true && Platform.OS === 'ios') {
      const newShowPreview = event.zoomScale <= 1;
      if (this.state.showPreview !== newShowPreview) {
        this.setState({ showPreview: newShowPreview });
      }

      if (!newShowPreview) {
        return;
      }
    }

    if (this.resetPrevListView !== null) {
      const layoutWidth = event.layoutMeasurement.width;
      const currentIndex = Math.floor((event.contentOffset.x + (0.5 * layoutWidth)) / layoutWidth);
      const newPreviewOffset = ((currentIndex - 2) * this.props.previewImageSize) + this._bias;
      if (this.previewOffset !== newPreviewOffset) {
        this.resetPrevListView.scrollTo({ x: newPreviewOffset });
        this.previewOffset = newPreviewOffset;
      }
    }
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
        pagingEnabled: true,
        maximumZoomScale: 3.0,
        directionalLockEnabled: true,
        showsVerticalScrollIndicator: false,
        showsHorizontalScrollIndicator: false,
        ...props,
      });
  }

  render() {
    return (
      <ListView
        renderScrollComponent={this.renderScrollComponent}
        initialListSize={5}
        onScroll={this.controlScroll}
        dataSource={this.props.dataSource}
        style={styles.listView}
        renderRow={this.props.renderRow.bind(this)}
        ref={comp => {
          this.resetListView = comp;
          return;
        }
      }
      />
    );
  }
}

const CARD_PREVIEW_WIDTH = 10;
const CARD_MARGIN = 25;
const CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;
const CARD_HEIGHT = Dimensions.get('window').height - 200;
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: HEIGHT / 10,
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  previewListView: {
    marginTop: 2,
    paddingTop: 2,
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
});
