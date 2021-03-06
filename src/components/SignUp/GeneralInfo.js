import React, { Component } from 'react';
import {
  Alert,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import EditForm from './EditForm';
import EduForm from './EduForm';
import MyPic from './MyPic';
import Progress from '../Shared/Progress';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import WorkForm from './WorkForm';

// List data for rendering each section.
const fieldTitles = [
  { name: 'Name' },
  { name: 'Email', disabled: true },
  { name: 'Location' },
  { name: 'About' },
  { name: 'Education', isArray: true },
  { name: 'Experience', isArray: true },
];

class GeneralInfo extends Component {
  constructor(props) {
    super(props);

    const eduDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const workDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      refreshFlag: false,
      profile: {},
      eduDataSource: eduDS.cloneWithRows([]),
      workDataSource: workDS.cloneWithRows([]),
      imageResource: null,
      needRefresh: true,
    };
  }

  setProfileData(profileData) {
    profileData.education.reverse();

    let dataLength = profileData.education.length;
    for (let i = 0; i < 2 - dataLength; i++) {
      profileData.education.unshift({
        school: { name: '' },
        type: '',
        year: { name: '' },
        start_date: '',
        end_date: '',
        concentration: [{ name: '' }],
      });
    }

    dataLength = profileData.experience.length;
    for (let i = 0; i < 2 - dataLength; i++) {
      profileData.experience.unshift({
        start_date: '',
        end_date: '',
        employer: { name: '' },
        location: { name: '' },
        position: [{ name: '' }],
      });
    }

    this.setState({
      profile: profileData,
      eduDataSource: this.state.eduDataSource.cloneWithRows(profileData.education),
      workDataSource: this.state.workDataSource.cloneWithRows(profileData.experience),
    });
  }

  // After rendering, request user profile to server
  componentDidMount() {
    if (this.props.me) {
      this.setProfileData(this.props.me);
    } else {
      UserUtil.getMyProfile(this.onGetMyProfileCallback.bind(this));
    }

    if (this.props.fromEdit) {
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.regist.bind(this),
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.regist.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        },
      });
      this.setState({ needRefresh: false });
    }
  }

  onGetMyProfileCallback(result, error) {
    if (result) {
      this.setProfileData(result);
    }

    if (error) {
      if (error.msg) {
        Alert.alert(error.msg);
      }
    }
  }

  onUploadCallback(result, error) {
    if (error) {
      Alert.alert('Profile', error);
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.careerInfo({ me: this.props.me });
      }
    }
  }

  onChangeEduInfo(parentProp, childProp, idx, text) {
    const profile = this.state.profile;
    if (parentProp === 'concentration') {
      profile.education[idx][parentProp] = [];
      profile.education[idx][parentProp][0] = {};
      profile.education[idx][parentProp][0][childProp] = text;
      return;
    }

    if (!profile.education[idx][parentProp]) {
      profile.education[idx][parentProp] = {};
    }

    if (childProp) {
      profile.education[idx][parentProp][childProp] = text;
    } else {
      profile.education[idx][parentProp] = text;
    }
  }

  onDeleteEdu(rowID) {
    const profile = this.state.profile;
    profile.education.splice(rowID, 1);
    this.setState({
      eduDataSource: this.state.eduDataSource.cloneWithRows(profile.education),
    });
  }

  onChangeExpInfo(parentProp, childProp, idx, text) {
    const profile = this.state.profile;

    if (!profile.experience[idx][parentProp]) {
      profile.experience[idx][parentProp] = {};
    }

    if (childProp) {
      profile.experience[idx][parentProp][childProp] = text;
    } else {
      profile.experience[idx][parentProp] = text;
    }
  }

  onDeleteWork(rowID) {
    const profile = this.state.profile;
    profile.experience.splice(rowID, 1);
    this.setState({
      workDataSource: this.state.workDataSource.cloneWithRows(profile.experience),
    });
  }

  // Add new empty input set.
  addNewItem(listName) {
    const profile = this.state.profile;
    if (listName === 'Education') {
      if (!profile.education) profile.education = [];
      profile.education.unshift({
        school: { name: '' },
        type: '',
        year: { name: '' },
        start_date: '',
        end_date: '',
        concentration: [{ name: '' }],
      });

      this.setState({
        eduDataSource: this.state.eduDataSource.cloneWithRows(profile.education),
      });
    } else if (listName === 'Experience') {
      if (!profile.experience) profile.experience = [];
      profile.experience.unshift({
        start_date: '',
        end_date: '',
        employer: { name: '' },
        location: { name: '' },
        position: [{ name: '' }],
      });

      this.setState({
        workDataSource: this.state.workDataSource.cloneWithRows(profile.experience),
      });
    }
  }

  getTextInput(propName, defaultValue, disabled) {
    const onChangeText = (editedPropName, text) =>
                          this.onChangeText(editedPropName, text);
    return (
      <EditForm
        propName={propName}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        disabled={disabled}
      />
    );
  }

  cleanHistory(historyList, type) {
    let length = historyList.length;
    for (let i = 0; i < length; i++) {
      if (type === 'edu' && !historyList[i].school.name) {
        historyList.splice(i, 1);
        length -= 1;
        i -= 1;
      } else if (type === 'work' && !historyList[i].employer.name) {
        historyList.splice(i, 1);
        length -= 1;
        i -= 1;
      }
    }
    return historyList;
  }

  // Regist general user info.
  regist() {
    const profile = this.state.profile;
    if (!profile.name || profile.name.replace(/\s/g, '') === '') {
      Alert.alert('Profile', 'Please input your name.');
      return;
    }

    const emailFilter = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(profile.email) === false) {
      Alert.alert('Profile', 'Please input your correct email.');
      return;
    }

    let image = '';
    if (profile.imageResource) {
      image = profile.imageResource.data;
    }

    const education = this.cleanHistory(profile.education, 'edu');
    const experience = this.cleanHistory(profile.experience, 'work');

    const fieldSet = {
      name: profile.name,
      email: profile.email,
      location: profile.location,
      about: profile.about || '',
      education,
      experience,
      image,
    };

    UserUtil.editGeneral(this.onUploadCallback.bind(this), fieldSet);
  }

  // Render progress bar, profile image and form.
  render() {
    const readyUploadImage = (imageResource) => {
      this.state.profile.imageResource = imageResource;
    };

    const Forms = this.getForms();
    let SubmitButton = null;

    if (!this.props.fromEdit) {
      SubmitButton = (
        <View style={styles.nextView}>
          <TouchableOpacity onPress={() => this.regist()}>
            <LinearGradient
              start={{ x: 0.9, y: 0.5 }} end={{ x: 0.0, y: 0.5 }}
              locations={[0, 0.75]}
              colors={['#07e4dd', '#44acff']}
              style={styles.nextImage}
            >
              <Text style={styles.nextTxt}>NEXT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>);
    }

    return (
      <View style={styles.container}>
        {this.props.fromEdit ? null : (<Progress level={4} step={1} />)}
        <ScrollView style={styles.scrollView}>
          <MyPic
            uri={this.state.profile.profile_picture}
            readyUploadImage={readyUploadImage}
          />
          {Forms}
          {SubmitButton}
        </ScrollView>
      </View>
    );
  }

  onChangeText(propName, text) {
    this.state.profile[propName] = text;
  }

  getDefaultWork(experience, sectionID, rowID) {
    const onDelete = deletedRowID => this.onDeleteWork(deletedRowID);
    const onChangeText = (propName1, propName2, idx, text) =>
                          this.onChangeExpInfo(propName1, propName2, idx, text);

    const props = {
      employer: experience.employer ? experience.employer.name : '',
      position: experience.position ? experience.position.name : '',
      start: experience.start_date,
      end: experience.end_date,
      id: rowID,
      onDelete,
      onChangeText
    };

    return (
      <WorkForm {...props} />
    );
  }

  getDefaultEdu(edu, sectionID, rowID) {
    let eduSubject = '';
    if (!edu.concentration && edu.concentration.length > 0) {
      eduSubject = edu.concentration[0].name;
    }

    const onDelete = deletedRowID => this.onDeleteEdu(deletedRowID);
    const onChangeText = (parentProp, childProp, idx, text) =>
                        this.onChangeEduInfo(parentProp, childProp, idx, text);

    const props = {
      name: edu.school ? edu.school.name : '',
      start: edu.start_date,
      end: edu.end_date || (edu.year ? edu.year.name : ''),
      subject: eduSubject,
      id: rowID,
      onDelete,
      onChangeText,
    };

    return (
      <EduForm {...props} />
    );
  }

  getInput(title) {
    const profile = this.state.profile;
    let Input = null;

    if (title.isArray) {
      const isEdu = title.name === 'Education';
      const props = {
        key: isEdu ? profile.education : profile.experience,
        enableEmptySections: true,
        dataSource: isEdu ? this.state.eduDataSource : this.state.workDataSource,
        renderRow: (data, sectionID, rowID) => {
          if (isEdu) return this.getDefaultEdu(data, sectionID, rowID);
          return this.getDefaultWork(data, sectionID, rowID);
        },
      };

      Input = <ListView {...props} />;
    } else {
      const propName = title.name.toLowerCase();
      const defaultValue = profile[propName];
      const disabled = title.disabled;
      Input = this.getTextInput(propName, defaultValue, disabled);
    }

    return Input;
  }

  // If a form has several inputs, the title should be able to add new input set
  getTitle(title) {
    if (!title.isArray) {
      return <Text style={styles.title}>{title.name}</Text>;
    }

    const onPress = () => this.addNewItem(title.name);
    return (
      <View style={styles.flexR}>
        <View style={styles.horiL}>
          <Text style={styles.title}>{title.name}</Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.horiR}>
            <Text style={styles.add}>{'+ Add item'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  // Get Forms(name, email, about, education, experience)
  // Each form includes title and input
  getForms() {
    const Forms = fieldTitles.map(
      (title, idx) => {
        const Title = this.getTitle(title);
        const Input = this.getInput(title);
        return (
          <View style={styles.form} key={idx}>
            {Title}
            {Input}
          </View>
        );
      },
    );

    return Forms;
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
    marginBottom: dimensions.heightWeight * 30,
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    paddingLeft: dimensions.widthWeight * 40,
  },
  form: {
    marginTop: dimensions.heightWeight * 20,
  },
  title: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
  },
  add: {
    color: '#2e3031',
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    marginRight: dimensions.heightWeight * 30,
  },
  nextView: {
    alignItems: 'center',
    marginTop: dimensions.heightWeight * 64,
    marginBottom: dimensions.heightWeight * 30,
    marginRight: dimensions.widthWeight * 40,
  },
  nextImage: {
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextTxt: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
  },
  flexR: {
    flexDirection: 'row',
  },
  horiL: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  horiR: {
    justifyContent: 'flex-end',
  },
  rightTextStyle: {
    backgroundColor: 'transparent',
    color: '#44acff',
    fontSize: dimensions.fontWeight * 16,
    marginRight: dimensions.widthWeight * 15,
  },
});

module.exports = GeneralInfo;
