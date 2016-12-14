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
    marginTop: 40,
    marginRight: 40,
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  overlay: {
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
