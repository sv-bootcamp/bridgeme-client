import React, { Component } from 'react';
import {
  Image,
  ListView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions }  from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../Shared/UniText';
import TournamentRow from './TournamentRow';
import MatchUtil from '../../utils/MatchUtil';
import Icon from 'react-native-vector-icons/Ionicons';
import { OptionsFilter } from '../SignUp/SignUpMETA';

let tmpBody = {
  career: {
    area: 'All',
    role: 'All',
    years: 'All',
    education_background: 'All',
  },
  expertise: [
  {
    select: 'Study abroad',
    index: 0,
  },
  {
    select: 'Career advice (e.g., interview, job search..)',
    index: 1,
  },
  {
    select: 'Portfolio & Resume',
    index: 2,
  },
  {
    select: 'Startup',
    index: 3,
  },
  {
    select: 'Career change',
    index: 4,
  },
  {
    select: 'Networking',
    index: 5,
  },
  {
    select: 'Soft skills (e.g., communication..)',
    index: 6,
  },
],
};

class Tournament extends Component {
  constructor(props) {
    super(props);

    // TODO: isRefreshing is for refresh control will be added shortly
    this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        step: 0,
        area: '',
        num: 0,
        roundNum: 0,
        totalNum: 0,
        user: [],
        index: 0,
        fliped: false,
        selected: [],
        listData: [],
      };
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(props) {
    if (props.me.career !== undefined) {
      this.state.area = props.me.career.area;
    }
  }

  onGetMentorListCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      if (result.length < 8) {
        alert('Not enough Mentor');
      } else {
        this.setState({
          step: 2,
          totalNum: result.length,
          user: result,
        });
      }
    }
  }

  getProfileImage(data) {
    if (data.profile_picture) {
      return { uri: data.profile_picture_large ?
        data.profile_picture_large : data.profile_picture, };
    }

    return require('../../resources/pattern.png');
  }

  getCurrentStatus(data) {
    let currentTask;
    let location;

    if (data.experience.length > 0) {
      location = data.experience[0].employer.name;
      if (data.experience[0].position) {
        currentTask = data.experience[0].position.name;
      } else {
        return location;
      }

      return currentTask + ' at ' + location;
    } else if (data.education.length > 0) {
      const lastIndex = data.education.length - 1;
      const education = data.education[lastIndex];

      if (education.school) {
        location = education.school.name;
        if (education.concentration.length > 0 && education.concentration[0].name !== '') {
          currentTask = education.concentration[0].name;
        } else {
          return location;
        }

        return currentTask + ' at ' + location;
      }
    }

    return 'No current status';
  }

  getEducation(data) {
    return data.education.map((edu, index) => {
      if (index < 3) {
        return (
          <View key={index}>
            <Text style={styles.eduTextMain} numberOfLines={1} ellipsizeMode={'tail'}>
              {(edu.concentration.length !== 0 && edu.school.name !== '') ?
              edu.school.name + ' of ' + edu.concentration[0].name : edu.school.name}
            </Text>
            <Text style={styles.eduTextSub}>
              {(edu.start_date !== undefined && edu.start_date !== '') ?
                (edu.start_date + ' ~ ' + edu.end_date)
              : (edu.year !== undefined) ? edu.year.name : ''}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    });
  }

  getExpertise(data) {
    return data.expertise.map((expert, index) => {
      if (index < 3) {
        return (
            <Text key={index} style={styles.expertText}>
              {OptionsFilter[expert.index]}
            </Text>
          );
      } else {
        return null;
      }
    });
  }

  onPressBtnStarted() {
    setTimeout(() => {
      this.setState({ step: 1 });
    }, 300);
  }

  onPressBtnNext() {
    setTimeout(() => {
      this.setState({ step: 3 });
    }, 300);
  }

  onPressBtnRestart() {
    Actions.refresh({
      title: 'Tournament',
      titleStyle: styles.title,
      rightButtonImage: null,
      rightTitle: null,
      onRight: () => {},
    });
    this.setState({ step: 0 });
  }

  onPressBtnArea(flag) {
    if (flag) {
      tmpBody.career.area = this.state.area;
    } else {
      tmpBody.career.area = 'All';
    }

    MatchUtil.getMentorList(this.onGetMentorListCallback.bind(this), tmpBody);
  }

  onPressBtnNumOfPeple(num) {
    for (let i = 0; i < num; i++) {
      this.state.selected.push(i);
    }

    setTimeout(() => {
      Actions.refresh({
        title: 'Round ' + (this.state.index + 1),
        titleStyle: styles.title,
        rightButtonTextStyle: styles.rightTextStyle,
        rightTitle: 'Restart',
        onRight: this.onPressBtnRestart.bind(this),
      });
      this.setState({
        step: 3,
        num: num,
        roundNum: num / 2,
      });
    }, 300);
  }

  onPressBtnSelect(data) {
    let rowFirst = this.state.user[this.state.selected[0]];
    let rowSecond = this.state.user[this.state.selected[1]];
    if (this.state.selected[0] === this.state.user.indexOf(data)) {
      rowFirst.selected = true;
      rowSecond.selected = false;
    } else {
      rowFirst.selected = false;
      rowSecond.selected = true;
    }

    this.state.listData.push({ rowFirst, rowSecond });
    this.state.selected.shift();
    this.state.selected.shift();

    if (this.state.selected.length === 0) {
      this.state.step = 0;
      Actions.refresh({
        title: 'Tournament',
        titleStyle: styles.title,
        rightButtonImage: null,
        rightTitle: null,
        onRight: () => {},
      });
      setTimeout(() => {
        Actions.userProfile({ _id: data._id, me: this.props.me });
      }, 300);
    } else {
      this.state.selected.push(this.state.user.indexOf(data));

      if (this.state.roundNum === this.state.index + 1) {
        this.state.roundNum = this.state.roundNum / 2;
        this.state.index = 0;
        this.state.step = 4;
      } else {
        this.state.index = this.state.index + 1;
      }

      this.forceUpdate();
    }
  }

  renderRestart() {
    return (
      <View style={styles.container}>
        <Text style={styles.restartText}>
          {'Let’s start a new tournament.'}
        </Text>
        <Image
          style={styles.restartImg}
          source={require('../../resources/bg-tournament-restart.png')}/>
        <TouchableOpacity
          activated={false}
          onPress={this.onPressBtnStarted.bind(this)}>
          <LinearGradient style={styles.startedBtnStyle}
            start={[0.9, 0.5]}
            end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{'START'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  renderArea() {
    return (
      <View style={styles.container}>
        <Text style={styles.areaText}>
          {'Choose the work area\nyou would like to see.'}
        </Text>
        <TouchableOpacity
          onPress={this.onPressBtnArea.bind(this, true)}>
          <View style={styles.areaBtnStyle}>
            <Text style={styles.areaBtnText}>{this.state.area}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressBtnArea.bind(this, false)}>
          <View style={styles.areaBtnStyle}>
            <Text style={styles.areaBtnText}>{'Doesn’t matter'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderNumOfPeople() {
    return (
      <View style={styles.container}>
        <Text style={styles.numOfPeopleText}>
          {'Choose the number of people.'}
        </Text>
        <TouchableOpacity
          disabled={this.state.totalNum < 8}
          onPress={this.onPressBtnNumOfPeple.bind(this, 8)}>
          <View style={[styles.areaBtnStyle, { opacity: this.state.totalNum >= 8 ? 1 : 0.5 }]}>
            <Text style={styles.areaBtnText}>{'8 people'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={this.state.totalNum < 16}
          onPress={this.onPressBtnNumOfPeple.bind(this, 16)}>
          <View style={[styles.areaBtnStyle, { opacity: this.state.totalNum >= 16 ? 1 : 0.5 }]}>
            <Text style={styles.areaBtnText}>{'16 people'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={this.state.totalNum < 32}
          onPress={this.onPressBtnNumOfPeple.bind(this, 32)}>
          <View style={[styles.areaBtnStyle, { opacity: this.state.totalNum >= 32 ? 1 : 0.5 }]}>
            <Text style={styles.areaBtnText}>{'32 people'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderUser(data) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={styles.photo}
          source={this.getProfileImage(data)}
        />
        <View style={styles.userContainer}>
          <View style={styles.textContainer}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {data.name}
            </Text>
            <Text numberOfLines={1} style={styles.job}>
              {this.getCurrentStatus(data)}
            </Text>
          </View>
          <View style={styles.checkContainer}>
            <TouchableOpacity
              onPress={this.onPressBtnSelect.bind(this, data)}>
              <Icon name={'md-checkmark'} color={'#d6dada'} size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderUserData(data) {
    return (
      <View style={{ flex: 1, paddingTop: dimensions.heightWeight * 21 }}>
        <View style={styles.userDataContainer}>
          <View style={styles.eduContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{'Education'}</Text>
            </View>
            {this.getEducation(data)}
          </View>
          <View style={styles.expertContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{'Expertise'}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {this.getExpertise(data)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderTournamet() {
    let renderUser;
    if (this.state.fliped === false) {
      renderUser = this.renderUser.bind(this);
    } else {
      renderUser = this.renderUserData.bind(this);
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={()=> {this.setState({ fliped: !this.state.fliped });}
        }>
          <View style={styles.cardContainer}>
            <View style={{ flex: 1 }}>
              {renderUser(this.state.user[this.state.selected[0]])}
              {renderUser(this.state.user[this.state.selected[1]])}
            </View>
            {(this.state.fliped) ? <View style={styles.halfline}/> : null}
            <View style={styles.vsContainer}>
              <Text style={styles.vsTest}>{'VS'}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: dimensions.heightWeight * 2,
          backgroundColor: '#eaefef',
          marginLeft: dimensions.widthWeight * 70,
        }}
      />
    );
  }

  renderRow(rowData) {
    return <TournamentRow dataSource={rowData} me={this.props.me}/>;
  }

  renderList() {

    // Refresh dataSource
    this.state.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listData.slice());
    this.state.listData = [];
    return (
      <View style={styles.container}>
        <Text style={styles.listText}>
          {'You did great job!'}
        </Text>
        <View style={styles.listContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator}
            enableEmptySections={true}
          />
        </View>
        <TouchableOpacity
          activated={false}
          onPress={this.onPressBtnNext.bind(this)}>
          <LinearGradient style={styles.nextBtnStyle}
            start={[0.9, 0.5]}
            end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{'NEXT'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  render() {

    switch (this.state.step) {
      case 0: return this.renderRestart();
      case 1: return this.renderArea();
      case 2: return this.renderNumOfPeople();
      case 3: return this.renderTournamet();
      case 4: return this.renderList();
    }

    return (
      <View style={styles.comingSoonView}>
        <Image source={require('../../resources/tournament.png')} />
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
      </View>
    );

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: {
          height: 1,
          width: 0.3,
        },
      },
      android: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .1)',
      },
    }),
    width: dimensions.widthWeight * 325,
    height: dimensions.heightWeight * 488,
    marginTop: dimensions.heightWeight * 33,
    marginLeft: dimensions.widthWeight * 25,
    marginRight: dimensions.widthWeight * 25,
    borderRadius: 4,
  },
  userContainer: {
    flexDirection: 'row',
  },
  userDataContainer: {
    paddingLeft: dimensions.widthWeight * 25,
  },
  textContainer: {
    paddingTop: dimensions.heightWeight * 20,
    paddingLeft: dimensions.widthWeight * 20,
    width: dimensions.widthWeight * 245,
  },
  checkContainer: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'transparent',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsContainer: {
    position: 'absolute',
    top: dimensions.heightWeight * 231,
    left: dimensions.widthWeight * 137.5,
    height: dimensions.heightWeight * 26,
    width: dimensions.widthWeight * 50,
    borderRadius: dimensions.fontWeight * 30,
    backgroundColor: '#44acff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eduContainer: {
    height: dimensions.heightWeight * 152,
    width: dimensions.widthWeight * 300,
  },
  expertContainer: {
    height: dimensions.heightWeight * 70.5,
    width: dimensions.widthWeight * 300,
  },
  titleContainer: {
    height: dimensions.heightWeight * 22,
    width: dimensions.widthWeight * 300,
    borderBottomColor: '#efeff2',
    borderBottomWidth: 1,
    marginBottom: dimensions.heightWeight * 10,
  },
  listContainer: {
    height: dimensions.heightWeight * 406,
    width: dimensions.widthWeight * 375,
    marginTop: dimensions.heightWeight * 10,
    marginBottom: dimensions.heightWeight * 20,
  },
  titleText: {
    fontSize: dimensions.fontWeight * 10,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  halfline: {
    position: 'absolute',
    top: dimensions.heightWeight * 242.5,
    height: dimensions.heightWeight * 3,
    width: dimensions.widthWeight * 325,
    backgroundColor: '#efeff2',
  },
  vsTest: {
    fontSize: dimensions.fonttWeight * 20,
    color: '#ffffff',
  },
  restartText: {
    marginTop: dimensions.heightWeight * 80,
    fontSize: dimensions.fonttWeight * 18,
    color: '#2e3031',
  },
  listText: {
    marginTop: dimensions.heightWeight * 30,
    fontSize: dimensions.fonttWeight * 18,
    color: '#2e3031',
  },
  areaText: {
    marginTop: dimensions.heightWeight * 53,
    marginBottom: dimensions.heightWeight * 146,
    fontSize: dimensions.fonttWeight * 18,
    color: '#2e3031',
  },
  numOfPeopleText: {
    marginTop: dimensions.heightWeight * 53,
    marginBottom: dimensions.heightWeight * 130,
    fontSize: dimensions.fonttWeight * 18,
    color: '#2e3031',
  },
  restartImg: {
    marginTop: dimensions.heightWeight * 5,
    width:  dimensions.widthWeight * 220,
    resizeMode: 'contain',
  },
  startedBtnStyle: {
    justifyContent: 'center',
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
    marginTop: dimensions.heightWeight * 76,
  },
  nextBtnStyle: {
    justifyContent: 'center',
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
  },
  areaBtnStyle: {
    justifyContent: 'center',
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#44acff',
    marginBottom: dimensions.heightWeight * 25,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: dimensions.fontWeight * 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  areaBtnText: {
    fontSize: dimensions.fontWeight * 15,
    fontWeight: '600',
    color: '#44acff',
    alignSelf: 'center',
  },
  comingSoonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    marginTop: dimensions.heightWeight * 12,
    fontFamily: 'SFUIText-Regular',
    fontSize: dimensions.fontWeight * 14,
    color: '#a6aeae',
  },
  title: {
    fontSize: dimensions.fontWeight * 16,
    color: '#2e3031',
  },
  name: {
    fontSize: dimensions.fontWeight * 16,
    marginBottom: dimensions.heightWeight * 8,
    fontWeight: 'bold',
    color: '#2e3031',
  },
  eduTextMain: {
    fontSize: dimensions.fontWeight * 12,
    marginBottom: dimensions.heightWeight * 3,
    color: '#2e3031',
  },
  eduTextSub: {
    fontSize: dimensions.fontWeight * 10,
    marginBottom: dimensions.heightWeight * 6,
    color: '#a6acad',
  },
  expertText: {
    fontSize: dimensions.fontWeight * 12,
    marginRight: dimensions.heightWeight * 16,
    color: '#2e3031',
  },
  job: {
    fontSize: dimensions.fontWeight * 12,
    color: '#2e3031',
  },
  rightTextStyle: {
    backgroundColor: 'transparent',
    color: '#44acff',
    fontSize: dimensions.fontWeight * 16,
    marginRight: dimensions.widthWeight * 15,
  },
  photo: {
    height: dimensions.heightWeight * 162,
    width: dimensions.widthWeight * 325,
    borderRadius: 2,
  },
});

module.exports = Tournament;
