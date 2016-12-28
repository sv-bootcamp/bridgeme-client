import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Option,
  OptionList,
  Select,
  updatePosition
} from '../../utils/dropdown/index';
import Dropdown from 'react-native-dropdown-android';
import LinearGradient from 'react-native-linear-gradient';
import Progress from '../Shared/Progress';
import Text from '../Shared/UniText';
import UserUtil from '../../utils/UserUtil';
import { Actions, Scene, }  from 'react-native-router-flux';
import { CareerData } from './SignUpMETA';
import { dimensions } from '../Shared/Dimensions';

class CareerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: CareerData.questions,
      pressed: [],
      checked: [],
      selected: [],
      option: [],
      selectOP: '',
      clearFlag: false,
      needRefresh: true,
    };

    this.state.option[0] = CareerData.area;
    this.state.option[1] = [];
    this.state.option[2] = CareerData.years;
    this.state.option[3] = CareerData.education_background;

    for (i = 0; i < this.state.option.length; i++) {
      this.state.pressed.push(false);
      this.state.checked.push(false);
      this.state.selected.push('');
    }

    if (Platform.OS === 'android') {
      this.state.option[1] = CareerData.role[0].list;
      this.state.selected[0] = CareerData.area[0];
      this.state.selected[1] = CareerData.role[0].list[0];
      this.state.selected[2] = CareerData.years[0];
      this.state.selected[3] = CareerData.education_background[0];

      this.state.checked[0] = true;
      this.state.checked[1] = true;
      this.state.checked[2] = true;
      this.state.checked[3] = true;
    }

    UserUtil.getCareer(this.onGetCareerCallback.bind(this));

  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      for (idx = 0; idx < this.state.questions.length; idx++) {
        updatePosition(this.refs['SELECT' + idx]);
        updatePosition(this.refs['OPTION' + idx]);
      }
    }

    if (this.props.fromEdit)
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.onNextBtnPressed.bind(this),
      });
  }

  componentWillReceiveProps(props) {
    if (props.fromEdit && this.state.needRefresh) {
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.onNextBtnPressed.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        },
      });
      this.setState({ needRefresh: false });
    }
  }

  getOptionList(index) {
    this.state.selectOP = index;
    this.forceUpdate();
    return this.refs['OPTION' + String(index)];
  }

  onSelect(province, idx) {
    if (idx === 0 && province !== this.state.selected[idx])
      this.state.checked[1] = false;

    this.state.selectOP = idx;
    this.state.selected[idx] = province;
    this.state.checked[idx] = true;

    if (idx === 0) {
      for (i = 0; i < CareerData.role.length; i++) {
        if (CareerData.role[i].area === this.state.selected[0]) {
          this.state.option[1] = CareerData.role[i].list;
          this.state.clearFlag = true;
          break;
        }
      }
    }

    for (let i = 0; i < this.state.pressed.length; i++) {
      this.state.pressed[i] = false;
    }

    this.forceUpdate();
  }

  onPress() {
    if (this.props.fromEdit) {
      for (let i = 0; i < this.state.pressed.length; i++) {
        this.state.pressed[i] = true;
      }
    }
  }

  getOptionSet(index) {
    return this.state.option[index].map(
      (area, idx) => <Option key={idx}>{area}</Option>
    );
  }

  getQuestionSet() {
    return this.state.questions.map(
        (question, idx) => {
          let clear = false;
          let zIdx = (this.state.selectOP === idx)  ? 200 : 100;
          let activate = (this.state.selected[0] === '' && idx === 1) ? false : true;
          if (this.state.clearFlag && idx === 1) {
            this.state.clearFlag = false;
            clear = true;
          }

          if (Platform.OS === 'android') {
            return (
              <View key={idx} style={[styles.questionContainer, { zIndex: zIdx }]}>
                <Text style={styles.questionText}>{this.state.questions[idx]}</Text>
                <View key={idx} style={[styles.dropdownContainerAndroid]}>
                  <Dropdown
                    style={{
                      height: dimensions.heightWeight * 40,
                      width: Dimensions.get('window').width - dimensions.widthWeight * 60,
                    }}
                    values={this.state.option[idx]}
                    selected={this.state.option[idx].indexOf(this.state.selected[idx])}
                    onChange={(CareerData) => {
                      this.onSelect(CareerData.value, idx);
                    }}/>

                </View>
              </View>
              );
          } else {
            return (
              <View key={idx} style={[styles.questionContainer, { zIndex: zIdx }]}>
                <Text style={styles.questionText}>{this.state.questions[idx]}</Text>
                <View style={[styles.dropdownContainer]}>
                  <Select
                    value={this.state.selected[idx]}
                    ref={'SELECT' + idx}
                    clear={clear}
                    activate={activate}
                    pressed={this.state.pressed[idx]}
                    onPress={this.onPress.bind(this)}
                    index={idx}
                    width={Dimensions.get('window').width - dimensions.widthWeight * 60}
                    defaultValue={' '}
                    optionListRef={this.getOptionList.bind(this)}
                    onSelect={this.onSelect.bind(this)}>
                    {this.getOptionSet(idx)}
                  </Select>
                  <OptionList
                    ref={'OPTION' + idx}
                    overlayEnable={!this.props.fromEdit}
                    index={idx}/>
                </View>
              </View>
            );
          }
        }
      );
  }

  onUploadCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      if (this.props.fromEdit) {
        Actions.pop();
      } else {
        Actions.expertInfo({ me: this.props.me });
      }
    }
  }

  onGetCareerCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result.length !== 0) {
      this.state.option[1] = CareerData.role[CareerData.area.indexOf(result[0].area)].list;

      this.state.selected[0] = result[0].area;
      this.state.selected[1] = result[0].role;
      this.state.selected[2] = result[0].years;
      this.state.selected[3] = result[0].education_background;

      for (i = 0; i < 4; i++) {
        this.state.checked[i] = true;
      }

      this.forceUpdate();
    }
  }

  onNextBtnPressed() {
    for (i = 0; i < this.state.checked.length; i++) {
      if (!this.state.checked[i]) {
        Alert.alert('System', 'Please select all');
        return;
      }
    }

    let career = [
    {
      area: this.state.selected[0],
      role: this.state.selected[1],
      years: this.state.selected[2],
      education_background: this.state.selected[3],
    },
    ];

    let body = { career };
    UserUtil.editCareer(this.onUploadCallback.bind(this), body);

  }

  renderNextBtn() {
    let opacity = 1;
    let disabled  = false;
    for (i = 0; i < this.state.checked.length; i++) {
      if (!this.state.checked[i]) {
        opacity = 0.5;
        disabled  = true;
      }
    }

    return (
        <TouchableOpacity disabled ={disabled}
          onPress = {this.onNextBtnPressed.bind(this)}>
          <LinearGradient style={styles.btnStyle}
            start={[0.9, 0.5]} end={[0.0, 0.5]} locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View  opacity={opacity}>
              <Text style={styles.buttonText}>
                NEXT
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
    );
  }

  render() {
    let submitButton = null;

    if (!this.props.fromEdit)
      submitButton = this.renderNextBtn();
    return (
      <View style ={styles.container}>
        {this.props.fromEdit ? null : (<Progress level={4} step={2} />)}
        <ScrollView contentContainerStyle ={styles.scrollViewcontainer}>
          <View style={styles.header}>
            <Text style={styles.titleText}>What do you do?</Text>
            <Text style={styles.subTitleText}>Let us know your career background.</Text>
          </View>
          <View style={styles.body}>
            {this.getQuestionSet()}
          </View>
          <View style={styles.btnContainer}>
            {submitButton}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 44) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
  },
  scrollViewcontainer: {
    flex: 1,
  },
  header: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#d6dada',
  },
  body: {
    flex: 4,
    marginLeft: dimensions.widthWeight * 30,
    marginRight: dimensions.widthWeight * 30,
    zIndex: 100,
  },
  questionContainer: {
    marginBottom: dimensions.heightWeight * 20,
  },
  dropdownContainer: {
    marginTop: dimensions.heightWeight * 10,
  },
  dropdownContainerAndroid: {
    marginTop: dimensions.heightWeight * 10,
    borderColor: '#efeff2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
  },
  btnContainer: {
    flex: 1,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    height: dimensions.heightWeight * 45,
    width: dimensions.widthWeight * 230,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  subTitleText: {
    fontSize: dimensions.fontWeight * 12,
    color: '#2e3031',
    marginTop: dimensions.heightWeight * 10,
  },
  questionText: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
  },
  rightTextStyle: {
    backgroundColor: 'transparent',
    color: '#44acff',
    fontSize: dimensions.fontWeight * 16,
    marginRight: dimensions.widthWeight * 15,
  },
});

module.exports = CareerInfo;
