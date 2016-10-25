import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  CameraRoll,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import FileUploader from './FileUploader';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class MyPic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,
      source: require('../../resources/default_profile.png'),
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
    let _source = this.state.isDefault ? this.state.source : { uri: this.state.uri };

    return (
      <View style={styles.profileImageView}>
        <TouchableWithoutFeedback onPress={showPicker}>
          <Image style={styles.profileImage}
                 source={_source} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  showPicker() {
    ImagePicker.showImagePicker(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let _uri = (Platform.OS === 'ios') ?
                    response.uri.replace('file://', '') :
                    response.uri;

        let _source = {
          uri: _uri,
          isStatic: true,
        };

        console.log(response);

        FileUploader.upload({
            filename: response.fileName, // require, file name
            filepath: response.path, // require, file absoluete path
            filetype: response.type,
        });

        //this.props.readyUploadImage(response);

        this.setState({
          isDefault: true,
          source: _source,
        });
      }
    });
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
});

module.exports = MyPic;
