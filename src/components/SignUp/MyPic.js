import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { dimensions } from '../Shared/Dimensions';
import ImagePicker from 'react-native-image-picker';

const deviceWidth = Dimensions.get('window').width;
const options = {
  maxWidth: deviceWidth,
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
      uri: this.state.uri || props.uri,
      isDefault: false,
    });
  }

  showPicker() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
      } else {
        const uri = (Platform.OS === 'ios') ?
                    response.uri.replace('file://', '') :
                    response.uri;

        const source = {
          uri,
          isStatic: true,
        };

        this.props.readyUploadImage(response);

        this.setState({
          isDefault: true,
          source,
          uri,
        });
      }
    });
  }

  render() {
    const showPicker = () => this.showPicker();

    if (!this.state.uri) {
      return null;
    }

    const myPic = { uri: this.state.uri };

    return (
      <View style={styles.profileImageView}>
        <Image style={styles.profileImage} source={myPic} />
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={showPicker}>
            <Image
              style={styles.editImage}
              source={require('../../resources/icon-edit-pic.png')}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileImageView: {
    alignItems: 'center',
    marginTop: dimensions.heightWeight * 40,
    marginRight: dimensions.widthWeight * 40,
  },
  profileImage: {
    height: dimensions.fontWeight * 110,
    width: dimensions.fontWeight * 110,
    borderRadius: dimensions.fontWeight * 55,
  },
  overlay: {
    height: dimensions.fontWeight * 110,
    width: dimensions.fontWeight * 110,
    borderRadius: dimensions.fontWeight * 55,
    position: 'absolute',
    top: 0,
    left: (deviceWidth / 2) - dimensions.widthWeight * 95,
    backgroundColor: 'rgba(46, 48, 48, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editImage: {
    height: dimensions.heightWeight * 23,
    width: dimensions.widthWeight * 25,
  },
});

module.exports = MyPic;
