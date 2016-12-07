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
import LinearGradient from 'react-native-linear-gradient';
import EditForm from './EditForm';
import EduForm from './EduForm';
import EduFormIOS from './EduFormIOS';
import MyPic from './MyPic';
import Progress from '../Shared/Progress';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import WorkForm from './WorkForm';

// List data for rendering each section.
const fieldTitles = [
  { name: 'Name', isArray: false },
  { name: 'Email', isArray: false },
  { name: 'About', isArray: false },
  { name: 'Education', isArray: true },
  { name: 'Experience', isArray: true },
];

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 54,
      },
    }),
    marginBottom: 30,
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    paddingLeft: 40,
  },
  form: {
    marginTop: 20,
  },
  title: {
    color: '#a6aeae',
    fontSize: 12,
    fontWeight: 'bold',
  },
  add: {
    color: '#2e3031',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 30,
  },
  nextView: {
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 30,
    marginRight: 40,
  },
  nextImage: {
    width: 230,
    height: 45,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextTxt: {
    fontFamily: 'SFUIText-Bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 16,
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
});

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

  // After rendering, request user profile to server
  componentDidMount() {
    if (this.props.me) {
      const result = this.props.me;
      result.education.reverse();
      this.setState({
        profile: result,
        eduDataSource: this.state.eduDataSource.cloneWithRows(result.education),
        workDataSource: this.state.workDataSource.cloneWithRows(result.experience),
      });
    } else {
      UserUtil.getMyProfile(this.onGetMyProfileCallback.bind(this));
    }

    if (this.props.fromEdit) {
      Actions.refresh({ rightTitle: 'Save', onRight: this.regist.bind(this) });
    }
  }

  componentWillReceiveProps(props) {
    if (props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
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
      result.education.reverse();
      this.setState({
        profile: result,
        eduDataSource: this.state.eduDataSource.cloneWithRows(result.education),
        workDataSource: this.state.workDataSource.cloneWithRows(result.experience),
      });
    }

    if (error) {
      if (error.msg) {
        Alert.alert(error.msg);
      }
    }
  }

  onUploadCallback(result, error) {
    if (error) {
      Alert.alert('Sign In', error);
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

    if (profile.education[idx][parentProp] === undefined) {
      profile.education[idx][parentProp] = {};
    }
    profile.education[idx][parentProp][childProp] = text;
  }

  onDeleteEdu(rowID) {
    const profile = this.state.profile;
    profile.education.splice(rowID, 1);
    this.setState({
      eduDataSource: this.state.eduDataSource.cloneWithRows(profile.education),
    });
  }

  onChangeExpInfo(propName1, propName2, idx, text) {
    if (propName2 == null) {
      this.state.profile.experience[idx][propName1] = text;
    } else {
      this.state.profile.experience[idx][propName1][propName2] = text;
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

  getTextInput(propName, defaultValue) {
    const onChangeText = (editedPropName, text) =>
                          this.onChangeText(editedPropName, text);
    return (
      <EditForm
        propName={propName}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
      />
    );
  }

  // Regist general user info.
  regist() {
    const profile = this.state.profile;
    if (profile.name === '') {
      Alert.alert('Sign In', 'Please input your name.');
      return;
    }

    const emailFilter = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailFilter.test(profile.email) === false) {
      Alert.alert('Sign In', 'Please input your correct email.');
      return;
    }

    let image = '';
    if (profile.imageResource) {
      image = profile.imageResource.data;
    }

    const fieldSet = {
      name: profile.name,
      email: profile.email,
      about: profile.about || '',
      education: profile.education,
      experience: profile.experience,
      image,
    };

    UserUtil.editGeneral(this.onUploadCallback.bind(this), fieldSet);
  }

  // Render progress bar, profile image and form.
  render() {
    const readyUploadImage = (imageResource) => {
      this.state.imageResource = imageResource;
    };

    const Forms = this.getForms();
    let SubmitButton = null;

    if (!this.props.fromEdit) {
      SubmitButton = (
        <View style={styles.nextView}>
          <TouchableOpacity onPress={() => this.regist()}>
            <LinearGradient
              start={[0.9, 0.5]} end={[0.0, 0.5]}
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
    const employer = experience.employer === undefined ? '' : experience.employer.name;
    const position = experience.position === undefined ? '' : experience.position.name;
    const start = experience.start_date === undefined ? '' : experience.start_date;
    let end = '';
    if (experience.end_date !== undefined) {
      end = experience.end_date === '0000-00' ? 'present' : experience.end_date;
    }
    const onDelete = deletedRowID => this.onDeleteWork(deletedRowID);
    const onChangeText = (propName1, propName2, idx, text) =>
                          this.onChangeExpInfo(propName1, propName2, idx, text);

    return (
      <WorkForm
        employer={employer}
        position={position}
        start={start}
        end={end}
        id={rowID}
        onDelete={onDelete}
        onChangeText={onChangeText}
      />
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
      startYear: edu.startYear ? edu.startYear.name : '1980',
      endYear: edu.year ? edu.year.name : '1980',
      subject: eduSubject,
      id: rowID,
      onDelete,
      onChangeText,
    };

    if (Platform.OS === 'ios') {
      return (
        <EduFormIOS {...props} />
      );
    }

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
      Input = this.getTextInput(propName, defaultValue);
    }

    return Input;
  }

  // If a form has several inputs, the title should be able to add new input set
  getTitle(title) {
    if (title.isArray === false) {
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

module.exports = GeneralInfo;
