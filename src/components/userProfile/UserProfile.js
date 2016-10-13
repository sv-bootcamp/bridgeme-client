import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ServerUtil from '../../utils/ServerUtil';
import ErrorMeta from '../../utils/ErrorMeta';
import ExperienceRow from './ExperienceRow';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      profileImage: '../../resources/btn_connect_2x.png',
      name: '',
      currentStatus: '',
      currentPosition: '',
      currentLocation: '',
      loaded: false,
      evalLoaded: false,
      connectPressed: false,
      dataBlob: {},
      statusAsMentee: '',
      statusAsMentor: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };

    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));
  }

  onRequestSuccess(result) {

    // Check result code: profile Request/mentor request
    if (result._id) {
      let currentStatus = this.state.currentStatus;
      let currentPosition = this.state.currentPosition;
      let currentLocation = this.state.currentLocation;

      let sectionIDs = ['Experience', 'Education'];

      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        }),
        dataBlob: {},
      });

      if (result.work.length > 0) {
        let work = result.work[0];

        if (work.employer) {
          currentStatus = work.employer.name;
        }

        if (work.position) {
          currentPosition = work.position.name;
        }

        if (work.location) {
          currentLocation = work.location.name;
        }
      } else if (result.education.length > 0) {
        let lastIndex = result.education.length - 1;
        let education = result.education[lastIndex];

        if (education.school) {
          currentStatus = education.school.name;
        }

        if (education.concentration.length > 0) {
          currentPosition = education.concentration[0].name;
        }
      }

      this.state.dataBlob[sectionIDs[0]] = result.work.slice();
      this.state.dataBlob[sectionIDs[1]] = result.education.slice().reverse();

      let statusAsMentee = this.state.statusAsMentee;
      let statusAsMentor = this.state.statusAsMentor;

      if (result.relation !== undefined) {
        statusAsMentee = result.relation.asMentee;
        statusAsMentor = result.relation.asMentor;
      }

      this.setState({
        id: result._id,
        profileImage: result.profile_picture,
        name: result.name,
        currentStatus: currentStatus,
        currentPosition: currentPosition,
        currentLocation: currentLocation,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.state.dataBlob, sectionIDs),
        loaded: true,
        isRefreshing: false,
        statusAsMentee: statusAsMentee,
        statusAsMentor: statusAsMentor,
      });
    } else if (result.msg !== undefined) {
      this.setState({ evalLoaded: true });
      Actions.evalPageMain({ select: 'mentee' });
    }
  }

  onRequestFail(error) {
    if (error.code != ErrorMeta.ERR_NONE) {
      Alert.alert(error.msg);
    }
  }

  componentDidMount() {
    if (this.props.myProfile) {
      ServerUtil.getMyProfile();
    } else {
      ServerUtil.getOthersProfile(this.props._id);
    }
  }

  // Receive props befofe completly changed
  componentWillReceiveProps(props) {
    ServerUtil.initCallback(
      (result) => this.onRequestSuccess(result),
      (error) => this.onRequestFail(error));

    if (props.myProfile) {
      ServerUtil.getMyProfile();
    } else {
      ServerUtil.getOthersProfile(props._id);
    }
  }

  // Send mentor request
  sendRequest() {
    ServerUtil.sendMentoringRequest(this.state.id, 'Mentor request');
    this.setState({
      status: 2,
      connectPressed: true,
    });
  }

  // Render loading page while fetching user profiles
  renderLoadingView() {
    return (
      <View style={styles.header}>
        <ActivityIndicator
          animating={!this.state.loaded}
          style={[styles.activityIndicator]}
          size="large"
        />
        <Text style={styles.headerText}>Loading...</Text>
      </View>
    );
  }

  // Render loading page while fetching eval page
  renderLoadingEval() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Loading survey page...</Text>
        <ActivityIndicator
          animating={!this.state.evalLoaded}
          style={[styles.activityIndicator]}
          size="large"
        />
      </View>
    );
  }

  // Render User profile
  renderUserProfile() {
    const connect = () => this.sendRequest();
    let editButton;
    let connectButton;

    // Since we display these buttons by condition,
    // initialize with dummy text component.
    editButton = connectButton = (<Text></Text>);

    if (this.props.myProfile) {
      editButton = (

        // TODO: Replace below text with button
        <Text style={styles.edit}>Edit</Text>
      );
    } else {
      if (this.state.statusAsMentee === 2 || this.state.statusAsMentor === 2) {
        connectButton = (
          <TouchableHighlight style={styles.waitingButton}>
            <Text style={styles.buttonText}>Waiting...</Text>
          </TouchableHighlight>
        );
      } else if (this.state.statusAsMentee === 0 && this.state.statusAsMentor === 0) {
        connectButton = (
          <TouchableHighlight style={styles.connectButton} onPress={connect}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableHighlight>
        );
      } else if (this.state.statusAsMentee === 1 || this.state.statusAsMentor === 1) {
        connectButton = (
          <TouchableHighlight style={styles.waitingButton}>
            <Text style={styles.buttonText}>Connected</Text>
          </TouchableHighlight>
        );
      }
    }

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image style={styles.profileImage}
                 source={{ uri: this.state.profileImage }} />
          <View style={styles.profileUserInfo}>
            {editButton}
            <Text adjustsFontSizeToFit={true}
              style={styles.name}>{this.state.name}</Text>
            <Text adjustsFontSizeToFit={true}
               style={styles.positionText}>
              {this.state.currentStatus} | {this.state.currentPosition}
            </Text>
            <Text style={styles.positionText}>{this.state.currentLocation}</Text>

          </View>
          <View style={styles.profileUserExperice}>
            {editButton}
            <ListView
              showsVerticalScrollIndicator={false}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              enableEmptySections={true}
              renderSectionHeader = {this.renderSectionHeader}
            />
          </View>
        </ScrollView>
        {connectButton}
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>{sectionID}</Text>
      </View>
    );
  }

  renderRow(rowData) {
    return <ExperienceRow dataSource={rowData}/>;
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    } else if (this.state.connectPressed) {
      return this.renderLoadingEval();
    }

    return this.renderUserProfile();
  }
}

// Get device size
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  name: {
    marginTop: height / 10,
    fontSize: 17,
    fontWeight: 'bold',
  },
  positionText: {
    fontSize: 13,
    marginTop: 7,
    color: '#546979',
  },
  edit: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  experienceText: {
    fontSize: 15,
    color: '#546979',
    marginBottom: 10,
  },
  educationText: {
    fontSize: 15,
    color: '#546979',
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  scroll: {
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
  profileImage: {
    position: 'absolute',
    top: height / 40,
    left: width / 2 - 50,
    zIndex: 100,
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileUserInfo: {
    flex: 1.3,
    alignItems: 'center',
    marginTop: height / 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#f7f7f9',
  },
  profileUserExperice: {
    flex: 2.5,
    margin: 10,
    backgroundColor: '#f7f7f9',
    padding: 15,
  },
  connectButton: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#1ecfe2',
    borderRadius: 2,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
  },
  waitingButton: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#979797',
    borderRadius: 2,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'opensans',
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 20,
    color: '#0e417a',
    marginTop: 300,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5,
  },
});

module.exports = UserProfile;
