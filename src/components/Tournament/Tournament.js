import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  ListView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Actions }  from 'react-native-router-flux';
import { dimensions } from '../Shared/Dimensions';
import FlipCard from 'react-native-flip-card';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
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
};
const leftButtonGrey = require('../../resources/icon-arrow-left-grey.png');

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
        round: 1,
        roundNum: 0,
        totalNum: 0,
        user: [],
        index: 0,
        fliped: false,
        selected: [],
        listData: [],
        upSeleted: false,
        downSeleted: false,
        restart: 0,
        isRefresh: true,
        onBoardingText: [],
        onBoardingImg: [],
        onBoardingIdx: 0,
        education_background: [
          "Associate's",
          "Bachelor's",
          "Master's",
          'PhD',
        ],
      };
  }

  componentDidMount() {
    AsyncStorage.getItem('firstTournament', (error, result) => {
      if (result === 'on') {
        return;
      }

      this.state.onBoardingText.push('Pick the type of work area\nyou’d like to choose.');
      this.state.onBoardingText.push('Swipe the card that\nyou want to see the details.');
      this.state.onBoardingText.push('Then you can find out\nmore detail information.');
      this.state.onBoardingText.push('Select the card\nyou would rather choose.');

      this.state.onBoardingImg.push(require('../../resources/bg-tournament-onboarding-1.png'));
      this.state.onBoardingImg.push(require('../../resources/bg-tournament-onboarding-2.png'));
      this.state.onBoardingImg.push(require('../../resources/bg-tournament-onboarding-3.png'));
      this.state.onBoardingImg.push(require('../../resources/bg-tournament-onboarding-4.png'));

      AsyncStorage.setItem('firstTournament', 'on');
      this.setState({ step: -1 });
    });
  }

  componentWillReceiveProps(props) {
    if (props.me.career !== undefined) {
      this.state.area = props.me.career.area;
    }

    if (this.state.isRefresh) {
      this.onRenderNavigationBar();
    } else {
      this.state.isRefresh = true;
    }
  }

  onRenderNavigationBar() {
    switch (this.state.step) {
      case 0:
      case 5:
        Actions.refresh({
          title: 'Tournament',
          titleStyle: styles.title,
          rightButtonImage: null,
          rightTitle: null,
          onRight: () => {},

          leftButtonImage: null,
          leftTitle: 'left',
          onLeft: () => {},
        });
        break;
      case 1:
      case 2:
        Actions.refresh({
          title: 'Tournament',
          titleStyle: styles.title,
          rightButtonTextStyle: styles.rightTextStyle,
          rightTitle: null,
          onRight: null,
          leftTitle: null,
          leftButtonImage: leftButtonGrey,
          leftButtonIconStyle: styles.leftBtn,
          leftButtonStyle: styles.leftButtonStyle,
          onRight: () => {},

          onLeft: () => {
            if (this.state.step === 1) {
              this.onPressBtnRestart();
            }
          },
        });
        break;
      case 3 :
      case 4 :
        Actions.refresh({
          title: 'Round ' + (this.state.round),
          titleStyle: [styles.title, { fontWeight: 'bold', fontSize: 18, }],
          rightButtonTextStyle: styles.rightTextStyle,
          rightTitle: 'Restart',
          navigationBarStyle: {
            borderBottomColor: 'transparent',
            backgroundColor: '#ededed',
          },
          onRight: this.onPressRestart.bind(this),
        });
        break;
    }
    this.state.isRefresh = false;
  }

  onGetMentorListCallback(result, error) {
    if (error) {
      alert(error);
    } else if (result) {
      if (result.length < 8) {
        alert('Not enough Mentors');
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
              {edu.school.name}
            </Text>
            <Text style={styles.eduTextMain} numberOfLines={1} ellipsizeMode={'tail'}>
              {(edu.concentration.length !== 0) ? edu.concentration[0].name : ' '}
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

  controlScroll(event, state) {
    const idx = state.index;
    this.setState({
      onBoardingIdx: idx,
    });
  }

  onPressBtnStarted() {
    this.resetData();
    setTimeout(() => {
      this.state.step = 1;
      this.onRenderNavigationBar();
    }, 300);
  }

  onPressBtnNext() {
    this.state.listData = [];
    this.state.round += 1;
    setTimeout(() => {
      this.state.step = 3;
      this.onRenderNavigationBar();
    }, 300);
  }

  onPressRestart() {
    this.setState({
      restart: 10,
    });
  }

  resetData() {
    this.state.step = 0;
    this.state.area = this.props.me.career.area;
    this.state.num = 0;
    this.state.round = 1;
    this.state.roundNum = 0;
    this.state.totalNum = 0;
    this.state.user = [];
    this.state.index = 0;
    this.state.fliped = false;
    this.state.selecte = [];
    this.state.listData = [];
    this.state.restart = 0;
    this.state.upSeleted = false;
    this.state.downSeleted = false;
  }

  onPressBtnRestart() {
    this.resetData();
    this.onRenderNavigationBar();
  }

  onPressBtnArea(flag) {
    if (flag) {
      tmpBody.career.area = this.state.area;
    } else {
      tmpBody.career.area = 'All';
    }

    MatchUtil.getMentorList(this.onGetMentorListCallback.bind(this));
  }

  onPressBtnNumOfPeple(num) {
    for (let i = 0; i < num; i++) {
      this.state.selected.push(i);
    }

    this.state.step = 5;
    this.onRenderNavigationBar();

    setTimeout(() => {
        this.setState({
          step: 3,
          num: num,
          roundNum: num / 2,
        });

        this.onRenderNavigationBar();

      }, 1000);
  }

  onPressBtnSelect(data) {
    let rowFirst = this.state.user[this.state.selected[0]];
    let rowSecond = this.state.user[this.state.selected[1]];
    if (this.state.selected[0] === this.state.user.indexOf(data)) {
      rowFirst.selected = true;
      rowSecond.selected = false;
      this.state.upSeleted = true;
    } else {
      rowFirst.selected = false;
      rowSecond.selected = true;
      this.state.downSeleted = true;
    }

    this.forceUpdate();
    setTimeout(() => {
      this.state.upSeleted = false;
      this.state.downSeleted = false;
      this.state.listData.push({ rowFirst, rowSecond });
      this.state.selected.shift();
      this.state.selected.shift();

      if (this.state.selected.length === 0) {
        this.state.step = 0;
        this.onRenderNavigationBar();

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
    }, 500);

  }

  renderOnboardingPage() {
    return this.state.onBoardingText.map((text, index) =>
       <View>
         <Text style={styles.onboardingText}>
           {text}
         </Text>
         <Image style={styles.onboardingImg}
           source={this.state.onBoardingImg[index]}/>
       </View>
    );
  }

  renderOnboarding() {
    return (
        <View style={styles.container}>
          <Swiper loop={false}
            height={dimensions.heightWeight * 456}
            onMomentumScrollEnd={this.controlScroll.bind(this)}
            dot={this.renderDot()}
            activeDot={this.renderActiveDot()}>
            <View style={styles.swipePageContainer}>
              <Text style={styles.onboardingText}>
                {this.state.onBoardingText[0]}
              </Text>
              <Image style={styles.onboardingImg}
                source={this.state.onBoardingImg[0]}/>
            </View>
            <View style={styles.swipePageContainer}>
              <Text style={styles.onboardingText}>
                {this.state.onBoardingText[1]}
              </Text>
              <Image style={styles.onboardingImg}
                source={this.state.onBoardingImg[1]}/>
            </View>
            <View style={styles.swipePageContainer}>
              <Text style={styles.onboardingText}>
                {this.state.onBoardingText[2]}
              </Text>
              <Image style={styles.onboardingImg}
                source={this.state.onBoardingImg[2]}/>
            </View>
            <View style={styles.swipePageContainer}>
              <Text style={styles.onboardingText}>
                {this.state.onBoardingText[3]}
              </Text>
              <Image style={styles.onboardingImg}
                source={this.state.onBoardingImg[3]}/>
            </View>
          </Swiper>
          {this.renderFooter()}
        </View>
      );
  }

  renderFooter() {
    if (this.state.onBoardingIdx === 3) {
      return (
        <TouchableOpacity
          activated={false}
          onPress={this.onPressBtnStarted.bind(this)}>
          <LinearGradient style={styles.getStartedBtnStyle}
            start={[0.9, 0.5]}
            end={[0.0, 0.5]}
            locations={[0, 0.75]}
            colors={['#07e4dd', '#44acff']}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{'START'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  }

  renderDot() {
    return (
      <View style={{
        backgroundColor: '#dce0e2',
        width: dimensions.fontWeight * 7,
        height: dimensions.fontWeight * 7,
        borderRadius: dimensions.fontWeight * 4,
        marginLeft: dimensions.widthWeight * 17,
        marginRight: dimensions.widthWeight * 17,
        marginTop: dimensions.heightWeight * 3,
      }} />
    );
  }

  renderActiveDot() {
    return (
      <View style={{
        backgroundColor: '#c6cbcc',
        width: dimensions.fontWeight * 8,
        height: dimensions.fontWeight * 8,
        borderRadius: dimensions.fontWeight * 4,
        marginLeft: dimensions.widthWeight * 17,
        marginRight: dimensions.widthWeight * 17,
        marginTop: dimensions.heightWeight * 3,
      }} />
    );
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

  renderUser(data, up) {
    let edu = this.state.education_background.indexOf(data.career.education_background);
    let job = this.getCurrentStatus(data);

    return (
      <View style={styles.userContainer}>
        <Image
          style={styles.photo}
          source={this.getProfileImage(data)}/>
        <View>
          <View style={styles.textContainer}>
            <Text
              style={styles.userTitleText}>
              {(up) ? 'Name' : ' '}
            </Text>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {data.name}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text
              style={styles.userTitleText}>
              {(up) ? 'Job' : ' '}
            </Text>
            <Text numberOfLines={1} style={styles.name}>
              {(job) ? job : ' '}
            </Text>
          </View>
          <View style={styles.frontEduContainer}>
            <Text
              style={styles.userTitleText}>
              {(up) ? 'Education' : ' '}
            </Text>
            <View style={styles.eduIconContainer}>
              {(edu > 0) ? <Image style={styles.eduIconImg}
                source={require('../../resources/icon-b-a.png')}/> : null}
              {(edu > 1) ? <Image style={styles.eduIconImg}
                source={require('../../resources/icon-m-a.png')}/> : null}
              {(edu > 2) ? <Image style={styles.eduIconImg}
                source={require('../../resources/icon-ph-d.png')}/> : null}
            </View>
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
              <Text style={styles.titleText}>{'My Expertise'}</Text>
            </View>
            <View>
              {this.getExpertise(data)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderFront() {

    let renderUser;
    renderUser = this.renderUser.bind(this);
    renderUserData = this.renderUserData.bind(this);

    return (
      <View style={styles.background}>
        <View style={styles.matchContainer}>
          <View style={styles.frontBackground}/>
          <View style={styles.frontContainer}>
            {renderUser(this.state.user[this.state.selected[0]], true)}
            {renderUser(this.state.user[this.state.selected[1]], false)}
            <View style={styles.vsContainer}>
              <Image style={styles.vsImg}
                source={require('../../resources/bg-vs.png')}/>
            </View>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={styles.indexBoldText}>
            {(this.state.index + 1)}
          </Text>
          <Text style={styles.indexText}>
            {'  /  ' + (this.state.roundNum)}
          </Text>
        </View>
      </View>
      );
  }

  renderBack() {

    let renderUser;
    renderUser = this.renderUser.bind(this);
    renderUserData = this.renderUserData.bind(this);

    return (
      <View style={styles.background}>
        <View style={styles.matchContainer}>
          <View style={styles.backBackground}/>
          <View style={styles.frontContainer}>
            {renderUserData(this.state.user[this.state.selected[0]], true)}

          </View>
        </View>

      </View>
      );
  }

  renderCard() {

    let renderUser;
    renderUser = this.renderUser.bind(this);
    renderUserData = this.renderUserData.bind(this);

    return (
      <View style={styles.container}>
        <FlipCard
          style={styles.flipContainer}
          friction={10}
          perspective={1000}
          flipHorizontal={true}
          flipVertical={false}
          flip={false}
          clickable={!(this.state.upSeleted || this.state.downSeleted)}>
          <View>
            <View style={styles.cardContainer}>
              <View style={{ flex: 1 }}>
                {renderUser(this.state.user[this.state.selected[0]], true)}
                {renderUser(this.state.user[this.state.selected[1]], false)}
              </View>
              <View style={styles.halfline}/>
              <View style={styles.vsContainer}>
                <Text style={styles.vsTest}>{'VS'}</Text>
              </View>
            </View>
            <View style={styles.indexContainer}>
            </View>
          </View>
          <View>
            <View style={styles.cardContainer}>
              <View style={{ flex: 1 }}>
                {renderUserData(this.state.user[this.state.selected[0]])}
                {renderUserData(this.state.user[this.state.selected[1]])}
              </View>
              <View style={styles.halfline}/>
              <View style={styles.vsContainer}>
                <Text style={styles.vsTest}>{'VS'}</Text>
              </View>
            </View>
            <View style={styles.indexContainer}>
            </View>
          </View>
        </FlipCard>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.indexBoldText}>
            {(this.state.index + 1)}
          </Text>
          <Text style={styles.indexText}>
            {' / ' + (this.state.roundNum)}
          </Text>
        </View>
      </View>
    );
  }

  renderSeparator(sectionID, rowID) {
    if (this.state.roundNum * 2 === Number(rowID) + 1) {
      return null;
    } else {
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
  }

  renderRow(rowData) {
    return <TournamentRow dataSource={rowData} me={this.props.me}/>;
  }

  renderList() {
    this.state.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listData.slice());
    return (
      <View style={styles.container}>
        <Text style={styles.listText}>
          {'You did great job!'}
        </Text>
        <View style={styles.listContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator.bind(this)}
            enableEmptySections={true}
          />
        </View>
        <TouchableOpacity
          activated={false}
          onPress={this.onPressBtnNext.bind(this)}>
          <LinearGradient
            style={styles.nextBtnStyle}
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

  renderLoading() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.loadingImg}
          source={require('../../resources/tournament_loading.gif')}/>
      </View>
    );
  }

  renderPopup() {
    return (
      <Modal
        transparent
        visible>
        <View style={styles.modalContainer}>
          <View style={styles.popupContainer}>
            <TouchableOpacity
              onPress={() => {this.setState({ restart: 0 });}
              }>
              <Image style={styles.popupImgCancel}
                source={require('../../resources/icon-x.png')} />
            </TouchableOpacity>
            <Text style={styles.popupTextTitle}>{'Restart tournament'}</Text>
            <Image style={styles.popupImg}
              source={require('../../resources/bg-broken-pencil.png')} />
            <Text style={styles.popupTextMain}>{'Are you sure to restart?'}</Text>
            <Text style={styles.popupTextSub}>{'The result will not be saved.'}</Text>
          </View>
          <TouchableHighlight
            onPress={this.onPressBtnRestart.bind(this)}>
            <View style={styles.popupBtnContainer}>
              <Text style={styles.popupBtnText}>{'YES'}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }

  render() {

    switch (this.state.step + this.state.restart) {
      case -1: return this.renderOnboarding();
      case 0: return this.renderRestart();
      case 1: return this.renderArea();
      case 2: return this.renderNumOfPeople();
      case 3: return this.renderFront();
      case 4: return this.renderList();
      case 5: return this.renderLoading();
      case 10: return (
        <View>
          {this.renderRestart()}
          {this.renderPopup()}
        </View>
        );
      case 11: return (
        <View>
          {this.renderArea()}
          {this.renderPopup()}
        </View>
        );
      case 12: return (
        <View>
          {this.renderNumOfPeople()}
          {this.renderPopup()}
        </View>
        );
      case 13: return (
        <View>
          {this.renderCard()}
          {this.renderPopup()}
        </View>
        );
      case 14: return (
        <View>
          {this.renderList()}
          {this.renderPopup()}
        </View>
        );
    }
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
  background: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  matchContainer: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: (dimensions.heightWeight * 64) + 20,
      },
      android: {
        marginTop: dimensions.heightWeight * 64,
      },
    }),
    paddingLeft: dimensions.widthWeight * 4,
    paddingRight: dimensions.widthWeight * 4,
    marginBottom: dimensions.heightWeight * 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  frontContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: dimensions.widthWeight * 4,
    marginRight: dimensions.widthWeight * 4,
    backgroundColor: 'transparent',
  },
  frontBackground: {
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
    position: 'absolute',
    top: dimensions.heightWeight * 120,
    left: dimensions.widthWeight * 4,
    width: dimensions.widthWeight * 367,
    height: dimensions.heightWeight * 346,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  backBackground: {
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
    position: 'absolute',
    top: dimensions.heightWeight * 0,
    left: dimensions.widthWeight * 4,
    width: dimensions.widthWeight * 371,
    height: dimensions.heightWeight * 556,
    borderRadius: 5,
    backgroundColor: '#ffffff',
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
    borderRadius: 4.4,
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  userDataContainer: {
    paddingLeft: dimensions.widthWeight * 25,
  },
  textContainer: {
    paddingTop: dimensions.heightWeight * 15,
    paddingBottom: dimensions.heightWeight * 14,
    paddingLeft: dimensions.heightWeight * 6,
    marginLeft: dimensions.widthWeight * 10,
    marginRight: dimensions.widthWeight * 10,
    width: dimensions.widthWeight * 162,
    borderBottomWidth: 1,
    borderBottomColor: '#efeff2',
  },
  frontEduContainer: {
    paddingTop: dimensions.heightWeight * 20,
    paddingBottom: dimensions.heightWeight * 14,
    paddingLeft: dimensions.heightWeight * 6,
    marginLeft: dimensions.widthWeight * 10,
    marginRight: dimensions.widthWeight * 10,
    width: dimensions.widthWeight * 162,
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
    top: dimensions.heightWeight * 104 - 20,
    left: (dimensions.width / 2) - (dimensions.widthWeight * 34),
    height: dimensions.heightWeight * 52,
    width: dimensions.widthWeight * 52,
  },
  eduContainer: {
    height: dimensions.heightWeight * 152,
    width: dimensions.widthWeight * 300,
  },
  eduIconContainer: {
    marginTop: dimensions.heightWeight * 15,
    height: dimensions.heightWeight * 18,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
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
  indexContainer: {
    backgroundColor: 'transparent',
  },
  popupContainer: {
    backgroundColor: '#ffffff',
    height: dimensions.heightWeight * 195,
    width: dimensions.widthWeight * 258,
    alignItems: 'center',
  },
  popupBtnContainer: {
    backgroundColor: '#44acff',
    height: dimensions.heightWeight * 45,
    width: dimensions.widthWeight * 258,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipePageContainer: {
    alignItems: 'center',
  },
  popupBtnText: {
    color: '#ffffff',
    fontSize: dimensions.fontWeight * 16,
  },
  indexText: {
    backgroundColor: 'transparent',
    fontSize: dimensions.fontWeight * 12,
    marginBottom: dimensions.heightWeight * 20,
    color: '#2e3031',
  },
  indexBoldText: {
    backgroundColor: 'transparent',
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    marginBottom: dimensions.heightWeight * 20,
    color: '#2e3031',
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
    fontSize: dimensions.fontWeight * 20,
    color: '#ffffff',
  },
  restartText: {
    marginTop: dimensions.heightWeight * 80,
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  listText: {
    marginTop: dimensions.heightWeight * 30,
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  userTitleText: {
    fontSize: dimensions.fontWeight * 12,
    fontWeight: 'bold',
    color: '#a6aeae',
  },
  areaText: {
    marginTop: dimensions.heightWeight * 53,
    marginBottom: dimensions.heightWeight * 146,
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  numOfPeopleText: {
    marginTop: dimensions.heightWeight * 53,
    marginBottom: dimensions.heightWeight * 130,
    fontSize: dimensions.fontWeight * 18,
    color: '#2e3031',
  },
  popupTextTitle: {
    marginTop: dimensions.heightWeight * 19,
    fontSize: dimensions.fontWeight * 14,
    color: '#a6aeae',
  },
  popupTextMain: {
    marginTop: dimensions.heightWeight * 20,
    fontSize: dimensions.fontWeight * 14,
    color: '#2e3031',
  },
  popupTextSub: {
    fontSize: dimensions.fontWeight * 10,
    color: '#a6aeae',
  },
  vsImg: {
    height: dimensions.heightWeight * 52,
    width: dimensions.widthWeight * 52,
    resizeMode: 'contain',
  },
  restartImg: {
    marginTop: dimensions.heightWeight * 33,
    marginBottom: dimensions.heightWeight * 76,
    width:  dimensions.widthWeight * 220,
    height:  dimensions.widthWeight * 240,
    resizeMode: 'contain',
  },
  startedBtnStyle: {
    justifyContent: 'center',
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
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
  flipContainer: {
    borderColor: 'transparent',
  },
  getStartedBtnStyle: {
    justifyContent: 'center',
    marginTop: dimensions.heightWeight * 20,
    width: dimensions.widthWeight * 230,
    height: dimensions.heightWeight * 45,
    borderRadius: 100,
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
    fontSize: dimensions.fontWeight * 14,
    marginTop: dimensions.heightWeight * 10,
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
    color: '#2e3031',
  },
  expertText: {
    fontSize: dimensions.fontWeight * 12,
    marginRight: dimensions.widthWeight * 16,
    color: '#2e3031',
  },
  onboardingText: {
    marginTop: dimensions.heightWeight * 53,
    fontSize: dimensions.fontWeight * 18,
    textAlign: 'center',
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
    height: dimensions.heightWeight * 220,
    width: dimensions.widthWeight * 172,
    marginBottom: dimensions.heightWeight * 18,
    borderRadius: 8,
  },
  eduIconImg: {
    width: dimensions.widthWeight * 18,
    resizeMode: 'contain',
    marginRight: dimensions.widthWeight * 16,
  },
  popupImg: {
    marginTop: dimensions.heightWeight * 16,
    height: dimensions.heightWeight * 56,
    width: dimensions.widthWeight * 139,
    resizeMode: 'contain',
  },
  loadingImg: {
    height: dimensions.heightWeight * 557,
    width: dimensions.widthWeight * 375,
    resizeMode: 'contain',
  },
  popupImgCancel: {
    position: 'absolute',
    left: dimensions.widthWeight * (-115),
    top: dimensions.heightWeight * 14,
    height: dimensions.heightWeight * 12,
    width: dimensions.widthWeight * 12,
    resizeMode: 'contain',
  },
  onboardingImg: {
    marginTop: dimensions.heightWeight * 51,
    height: dimensions.heightWeight * 233,
    width: dimensions.widthWeight * 220,
    resizeMode: 'contain',
  },
  leftBtn: {
    width: dimensions.widthWeight * 25,
    height: dimensions.heightWeight * 20,
    resizeMode: 'contain',
    marginLeft: 0,
  },
  leftButtonStyle: {
    ...Platform.select({
      ios: {
        top: 20,
        height: dimensions.heightWeight * 44,
      },
      android: {
        height: dimensions.heightWeight * 54,
        top: 0,
      },
    }),
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    position: 'absolute',
    marginLeft: dimensions.widthWeight * 10,
    alignItems: 'center',
    padding: 0,
    width: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = Tournament;
