import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ListView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class MyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: true,
      trueSwitchIsOn: true,
      falseSwitchIsOn: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Image style={styles.profileImage}
                 source={{ uri: 'http://lorempixel.com/1024/1024/cats' }} />

          <View style={styles.infoText}>
            <Text style={{
              color: '#2e3031',
              fontSize: 18,
              fontWeight: '500',
            }}>
              Stacy Kim
            </Text>
            <Text>
              UI/UX Desginer at bridge.me
            </Text>
            <TouchableWithoutFeedback onPress={() => Actions.userProfile({ myProfile: true })}>
              <View>
                <Text style={{ color: '#557bfc' }}>
                  View Profile
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <TouchableOpacity style={styles.menu}>
          <Image source={require('../resources/page-1@3x.png')} />
          <Text>  Edit my profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Image source={require('../resources/for-you-icon-line@3x.png')} />
          <Text>  Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          flex: 1,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#efeff2',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 20,
        }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../resources/icon-bookmark@3x.png')} />
            <Text>  Recieve a request</Text>
          </View>
          <Switch
            onValueChange={(value) => this.setState({ trueSwitchIsOn: value })}
            value={this.state.trueSwitchIsOn} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Image source={require('../resources/icon-logout@3x.png')} />
          <Text>  Log out</Text>
        </TouchableOpacity>
        <View style={{ flex: 3 }}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
  },
  userInfo: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#efeff2',
    paddingLeft: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#efeff2',
  },
  infoText: {
    height: 70,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
});

module.exports = MyPage;
