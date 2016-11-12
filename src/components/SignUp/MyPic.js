import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  maxWidth: 110,
};

// Profile image Component
// User can change this image from camera or local images.
class MyPic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      source: require('../../resources/profile-img.png'),
      uri: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      isDefault: false,
      uri: props.uri,
    });
  }

  render() {
    let showPicker = () => this.showPicker();
    let source = this.state.source;
    if (!this.state.isDefault && this.state.uri !== undefined) {
      source = { uri: this.state.uri };
    }

    return (
      <View style={styles.profileImageView}>
        <Image style={styles.profileImage} source={source} />
        <View style={styles.overay}>
          <TouchableWithoutFeedback onPress={showPicker}>
            <Image style={styles.editImage}
                   source={require('../../resources/icon-edit-pic.png')} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  showPicker() {
    ImagePicker.showImagePicker(options, (response)  => {
      if (response.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
      } else {
        let uri = (Platform.OS === 'ios') ?
                    response.uri.replace('file://', '') :
                    response.uri;

        let source = {
          uri: uri,
          isStatic: true,
        };

        this.props.readyUploadImage(response);

        this.setState({
          isDefault: true,
          source: source,
        });
      }
    });
  }

}

const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  profileImageView: {
    alignItems: 'center',
    marginTop: 40,
    marginRight: 40,
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  overay: {
    height: 110,
    width: 110,
    borderRadius: 55,
    position: 'absolute',
    top: 0,
    left: (deviceWidth / 2) - 95,
    backgroundColor: 'rgba(46, 48, 48, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editImage: {
    height: 23,
    width: 25,
  },
});

module.exports = MyPic;
