import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
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
import CheckBox from '../../utils/CheckBox';
import Dropdown from 'react-native-dropdown-android';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
import MatchUtil from '../../utils/MatchUtil';
import { Actions, Scene, }  from 'react-native-router-flux';
import {
  CareerData,
  Options,
  OptionsFilter,
} from '../SignUp/SignUpMETA';
import { dimensions } from '../Shared/Dimensions';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        'Area',
        'Role',
        'Years of work experience',
        'Last Educational Background',
      ],
      pressed: [],
      careerData: [],
      checked: [],
      selected: [],
      option: [],
      selectOP: '',
      clearFlag: false,
      options: OptionsFilter,
      optionsRef: Options,
      optionsNum: [],
      overviewChecked: [],
      needRefresh: true,
    };
    this.state.careerData = CareerData.role.slice();
    this.state.option[0] = CareerData.area.slice();
    this.state.option[1] = [];
    this.state.option[2] = CareerData.years.slice();
    this.state.option[3] = CareerData.education_background.slice();

    const all = {
      area: 'All',
      list: [],
    };

    this.state.careerData.unshift(all);
    this.state.option[1] = this.state.careerData[0].list.slice();

    for (i = 0; i < this.state.option.length; i++) {
      this.state.option[i].unshift('All');
      this.state.selected.push(this.state.option[i][0]);
      this.state.pressed.push(false);
      this.state.checked.push(true);
    }

    for (i = 0; i < this.state.options.length; i++) {
      this.state.overviewChecked.push(false);
      this.state.optionsNum.push(0);
    }

    this.getFilterCount();
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      for (idx = 0; idx < this.state.questions.length; idx++) {
        updatePosition(this.refs['SELECT' + idx]);
        updatePosition(this.refs['OPTION' + idx]);
      }
    }

    Actions.refresh({
      rightButtonTextStyle: styles.rightTextStyle,
      rightTitle: 'Save',
      onRight: this.onSave.bind(this),
      onBack: () => {
        this.setState({ needRefresh: true });
        Actions.pop();
      },
    });

    AsyncStorage.getItem('filter', (error, result) => {
      if (result) {
        this.setData(JSON.parse(result));
        return;
      }
    });
  }

  setData(filter) {
    let career = filter.career;
    this.state.option[1]
    = this.state.careerData[this.state.option[0].indexOf(career.area)].list.slice();

    this.state.selected[0] = career.area;
    this.state.selected[1] = career.role;
    this.state.selected[2] = career.years;
    this.state.selected[3] = career.education_background;

    let expertise = filter.expertise;
    expertise.map(
      (object, idx) => {
        this.state.overviewChecked[object.index] = true;
      }
    );

    this.getFilterCount();
  }

  componentWillReceiveProps(props) {
    if (this.state.needRefresh) {
      Actions.refresh({
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Save',
        onRight: this.onSave.bind(this),
        onBack: () => {
          this.setState({ needRefresh: true });
          Actions.pop();
        },
      });
      this.setState({ needRefresh: false });
    }
  }

  resetData() {
    for (i = 0; i < this.state.selected.length; i++) {
      this.state.selected[i] = 'All';
      this.state.checked[i] = true;
    }

    this.state.option[1] = this.state.careerData[0].list.slice();

    for (i = 0; i < this.state.overviewChecked.length; i++) {
      this.state.overviewChecked[i] = false;
    }

    this.getFilterCount();
  }

  onSave() {
    for (i = 0; i < this.state.checked.length; i++) {
      if (!this.state.checked[i]) {
        Alert.alert('System', 'Please select all');
        return;
      }
    }

    let career = {
      area: this.state.selected[0],
      role: this.state.selected[1],
      years: this.state.selected[2],
      education_background: this.state.selected[3],
    };

    let expertise = [];
    for (i = 0; i < this.state.overviewChecked.length; i++) {
      if (this.state.overviewChecked[i]) {
        expertise.push({
          select: this.state.optionsRef[i],
          index: i,
        });
      }
    }

    let cardNum = 0;

    if (expertise.length === 0) {
      for (i = 0; i < this.state.optionsNum.length; i++) {
        cardNum += this.state.optionsNum[i];
      }
    } else {
      for (i = 0; i < this.state.optionsNum.length; i++) {
        if (this.state.overviewChecked[i]) {
          cardNum += this.state.optionsNum[i];
        }
      }
    }

    if (cardNum === 0) {
      Alert.alert('No result', 'Please adjust filter condition.');
      return;
    }

    this.state.needRefresh = true;

    let body = { career, expertise };

    AsyncStorage.setItem(
      'filter',
      JSON.stringify(body),
      () => {
        Actions.pop();
        setTimeout(() => Actions.refresh(), 20);
      },
    );
  }

  onFilterCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      for (let i = 0; i < result.length; i++) {
        this.state.optionsNum[i] = result[i];
      }

      this.forceUpdate();
    }
  }

  getOptionList(index) {
    this.state.selectOP = index;
    this.forceUpdate();
    return this.refs['OPTION' + String(index)];
  }

  onSelect(province, idx) {
    if (idx === 0 && province !== this.state.selected[idx]) {
      this.state.checked[1] = true;
      this.state.selected[1] = 'All';
    }

    this.state.selectOP = idx;
    this.state.selected[idx] = province;
    this.state.checked[idx] = true;

    if (idx === 0) {
      for (i = 0; i < CareerData.role.length; i++) {
        if (CareerData.role[i].area === this.state.selected[0]) {
          this.state.option[1] = CareerData.role[i].list.slice();
          this.state.option[1].unshift('All');
          this.state.clearFlag = true;
          break;
        } else if (this.state.selected[0] === 'All') {
          this.state.option[1] = this.state.careerData[0].list.slice();
          this.state.option[1].unshift('All');
          break;
        }
      }
    }

    for (let i = 0; i < this.state.pressed.length; i++) {
      this.state.pressed[i] = false;
    }

    if (this.state.checked[1] === false) {
      return;
    }

    this.getFilterCount();
  }

  getFilterCount() {
    let body = {};
    body.career = {
      area: this.state.selected[0],
      role: this.state.selected[1],
      years: this.state.selected[2],
      education_background: this.state.selected[3],
    };

    MatchUtil.getFilterCnt(this.onFilterCallback.bind(this), body);
  }

  onPress() {
    for (let i = 0; i < this.state.pressed.length; i++) {
      this.state.pressed[i] = true;
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
          let zIdx = (this.state.selectOP === idx)  ? 200 : 100;

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
                    }
                    }/>
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
                    activate={true}
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
                    overlayEnable={false}
                    index={idx}/>
                </View>
              </View>
            );
          }
        }
      );
  }

  // Update checkbox state
  updateCheckBox(answerIdx, optionIdx, isFreeForm, isChecked) {
    this.state.overviewChecked[optionIdx] = !this.state.overviewChecked[optionIdx];
    this.forceUpdate();
  }

  getOverviewOptionSet() {
    return this.state.options.map(
        (option, idx) => (
          <CheckBox
            key={idx}
            iconSize={15}
            iconStyle={styles.iconStyle}
            labelStyle={(idx !== this.state.options.length - 1) ?
            styles.labelStyle : styles.labelStyleLast }
            label={this.state.options[idx]}
            subLabelFontStyle={styles.subLabelFontStyle}
            subLabel={(this.state.optionsNum[idx] !== 0) ?
            this.state.optionsNum[idx] : ''}
            checked={this.state.overviewChecked[idx]}
            optionIdx={idx}
            onUpdate={this.updateCheckBox.bind(this)}
          />
        )
    );
  }

  render() {
    return (
      <View style ={styles.container}>
        <ScrollView>
          <View style={styles.reload}>
            <TouchableOpacity onPress={this.resetData.bind(this)}>
              <View style={styles.reload}>
                <Icon
                  name={'ios-refresh-outline'}
                  color={'#44acff'}
                  size={dimensions.fontWeight * 15} />
                <Text style={styles.reloadText}>
                  {'Reset'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.careerBody}>
            {this.getQuestionSet()}
          </View>
          <View style={styles.overviewBody}>
            <View style={styles.header}>
              <Text allowFontScaling={false} style={styles.subTitleText}>
                {'Expertise'}
              </Text>
            </View>
            <View style ={styles.body}>
              {this.getOverviewOptionSet()}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        marginTop: dimensions.heightWeight * 44 + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 54,
      },
    }),
    flex: 1,
  },
  careerBody: {
    flex: 2,
    marginLeft: dimensions.widthWeight * 30,
    marginRight: dimensions.widthWeight * 30,
    zIndex: 100,
  },
  overviewBody: {
    flex: 1,
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
  reload: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reloadText: {
    fontSize: 12,
    color: '#44acff',
    alignItems: 'center',
    margin: 10,
    marginLeft: dimensions.widthWeight * 5,
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
    borderRadius: dimensions.widthWeight * 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  subTitleText: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
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
  header: {
    flex: 1,
    marginBottom: dimensions.heightWeight * 10,
  },
  body: {
    flex: 1,
    borderColor: '#f0f0f2',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: dimensions.heightWeight * 15,
  },
  scrollViewContainer: {
    flex: 1,
  },
  iconStyle: {
    width: dimensions.widthWeight * 30,
    height: dimensions.fontWeight * 50,
  },
  labelStyle: {
    height: dimensions.heightWeight * 50,
    borderBottomColor: '#efeff2',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  labelStyleLast: {
    height: dimensions.heightWeight * 50,
    borderBottomColor: 'transparent',
  },
  overviewBody: {
    flex: 1,
    padding: dimensions.heightWeight * 30,
    paddingTop: 0,
  },
  subLabelFontStyle: {
    color: '#a6aeae',
    fontSize: dimensions.fontWeight * 12,
  },
  rightTextStyle: {
    backgroundColor: 'transparent',
    color: '#44acff',
    fontSize: dimensions.fontWeight * 16,
    marginRight: dimensions.widthWeight * 15,
  },
});

module.exports = Filter;
