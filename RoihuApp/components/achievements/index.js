'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  Navigator,
  TouchableOpacity,
  BackAndroid,
  Alert,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config';
import { renderBackButton, renderRefreshButton } from '../../utils';
import { fetchData, renderRightArrow } from '../common/categories';
import { renderProgressBar, popWhenRouteNotLastInStack } from '../../utils';
import { infoStyles, categoryStyles, achievementStyles, navigationStyles } from '../../styles';
import { removeCredentials } from '../login/actions';
import { setView } from '../navigation/actions';
import { t } from '../../translations';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Achievements extends Component {

  renderAchievementCount(achievement_count, lang) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[categoryStyles.textColor, {fontSize: 11}]}>{t("leirissä\ntehty", lang)}</Text>
        <Text style={[categoryStyles.textColor, {marginLeft: 10, width: 50}]}>{achievement_count}</Text>
      </View>
    );
  }

  renderAgelevel(agelevel, navigator, rowID) {
    return (
      <View key={"agelevel-" + rowID} style={categoryStyles.listItem}>
        <TouchableOpacity style={categoryStyles.listItemTouchArea}
                          onPress={() => {
                            const route = {name: "achievements"};
                            this.props.actions.selectAgelevel(agelevel, route);
                            navigator.push(route);
          }}>
          <Text style={categoryStyles.textColor}>{agelevel.title.toUpperCase()}</Text>
          {renderRightArrow(this.renderAchievementCount(agelevel.achievement_count, this.props.lang))}
        </TouchableOpacity>
      </View>
    );
  }

  renderAgelevels(navigator) {
    return (
      <View style={{flex: 1}}>
        <ListView key={"agelevels"}
                  dataSource={this.props.ageLevelDataSource}
                  renderRow={(agelevel, sectionID, rowID) => this.renderAgelevel(agelevel, navigator, rowID)}/>
      </View>
    );
  }

  renderDoneMark(achievement) {
    if (achievement.userAchieved) {
      return (
        <View style={achievementStyles.listItemDoneIconContainer}>
          <Icon style={achievementStyles.listItemDoneIcon} name="done" />
        </View>
      );
    }
    return (
      <View style={achievementStyles.listItemDoneIconContainer}/>
    );
  }

  renderAchievement(achievement, navigator, rowID) {
    return (
      <View key={"achievement-" + rowID} style={[categoryStyles.listItem, {flex: 1, flexDirection: 'row'}]}>
        <TouchableOpacity style={[categoryStyles.listItemTouchArea, {flex: 1, flexDirection: 'row'}]}
                          onPress={() => {
                            const route = {name: "achievement"};
                            this.props.actions.selectAchievement(achievement, route);
                            navigator.push(route);
          }}>
          <View style={{flexDirection: 'row', flex: 1}}>
            {this.renderDoneMark(achievement)}
            <Text style={[{textAlign: 'left'}, categoryStyles.textColor]}>{achievement.title}</Text>
            {renderRightArrow(this.renderAchievementCount(achievement.achievement_count, this.props.lang))}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderWideButton(text, onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={achievementStyles.wideButtonContainer}>
          <View style={{flex: 1}}></View>
          <Text style={achievementStyles.wideButtonText}>{text}</Text>
          <View style={{flex: 1}}></View>
        </View>
      </TouchableOpacity>
    );
  }

  renderMarkDone(achievement) {
    const { credentials, lang } = this.props;
    if (credentials === null) {
      return null;
    }
    if (!achievement.userAchieved) {
      return this.renderWideButton(t("TEHTY!", lang), () => this.markAchievement(achievement.id, true));
    } else {
      return (
        <View>
          <View style={achievementStyles.doneContainer}>
            <Icon style={achievementStyles.doneIcon} name="done" />
            <View style={{flex: 1}}>
              <Text style={[categoryStyles.textColor, {marginTop: 10}]}>{t("Hieno juttu", this.props.lang)}</Text>
            </View>
          </View>
          {this.renderWideButton(t("ENPÄS VIELÄ OLEKAAN", lang), () => this.markAchievement(achievement.id, false))}
        </View>
      );
    }
  }

  renderSelectedAchievement(achievement) {
    return (
      <View style={categoryStyles.article}>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>{achievement.title}</Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <ScrollView style={{flex: 1}}>
            <Text style={categoryStyles.textColor}>{achievement.bodytext}</Text>
            <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>
              {t("Viimeksi muokattu", this.props.lang)} {moment(achievement.last_modified).format(t("Timestamp", this.props.lang))}
            </Text>
          </ScrollView>
            {this.renderMarkDone(achievement)}
        </View>
      </View>
    );
  }

  reLogin() {
    this.props.actions.removeCredentials();
    this.props.actions.setView("user");
  }

  markAchievement(achievementid, done) {
    console.log(`Marking achievement ${achievementid} ${(done ? "done" : "not done")}`);
    const { credentials, lang } = this.props;
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "/achievements/rel/" + achievementid + "?access_token=" + credentials.token, {
      method: done ? "PUT" : "DELETE",
      headers: {'Content-Type': 'application/json'},
      body: ""}).
      then((response) => {
        switch (response.status) {
        case 200:
        case 204:
          this.props.actions.markAchievementDone(done);
          break;
        case 401:
          Alert.alert(done ? t("Kirjaudu merkitäksesi aktiviteetin tehdyksi", lang) :
                      t("Kirjaudu peruaksesi aktiviteetin tekemisen", lang),
                      t("Kirjautuminen on vanhentunut, kirjaudu uudelleen", lang),
                      [{text: t("Ok", lang), onPress: () => this.reLogin()}]);
          break;
        default:
          console.log(response);
          Alert.alert(done ? t("Virhe merkitessä aktiviteettia tehdyksi", lang) :
                             t("Virhe peruessa aktiviteetin tekemistä", lang),
                      done ? t("Ei voitu merkitä aktiviteettia tehdyksi", lang) :
                             t("Ei voitu perua aktiviteetin tekemistä", lang),
                      [{text: t("Ok", lang), onPress: () => {}}]);
        }
      }).
      catch((error) => {
        console.log(error);
        Alert.alert(t("Virhe nettiyhteydessä", lang),
                    done ? t("Ei voitu merkitä aktiviteettia tehdyksi", lang) :
                           t("Ei voitu perua aktiviteetin tekemistä", lang),
                    [{text: t("Ok", lang), onPress: () => {}}]);
      });
  }

  leadingScoreText(score, lang) {
    return t("Kärjessä: ${score} tehtyä tehtävää", lang).replace("${score}", score);
  }

  averageScoreText(groupTitle, average, lang) {
    return t("${groupTitle} tehneet keskimäärin ${average} tehtävää", lang)
      .replace("${groupTitle}", groupTitle)
      .replace("${average}", average);
  }

  progressText(agelevel, lang) {
    const done = agelevel.achievements.filter((a) => a.userAchieved).length;
    const total = agelevel.achievements.length;
    return t("Edistymisesi: ${done}/${total}", lang)
      .replace("${done}", done)
      .replace("${total}", total);
  }

  renderAchievements(navigator) {
    return (
      <View style={{flex: 1}}>
        <Text style={[categoryStyles.textColor, {marginLeft: 5, marginTop: 0, fontWeight: 'bold'}]}>
          {this.leadingScoreText(this.props.agelevel.leading_score, this.props.lang)}
        </Text>
        <Text style={[categoryStyles.textColor, {marginLeft: 5, marginTop: 0, fontStyle: 'italic'}]}>
          {this.averageScoreText(this.props.agelevel.title, this.props.agelevel.average_score, this.props.lang)}
        </Text>
        <Text style={[categoryStyles.textColor, {fontWeight: 'bold', marginLeft: 5}]}>{this.progressText(this.props.agelevel, this.props.lang)}</Text>
        <ListView key={"achievements"}
                  enableEmptySections={true}
                  dataSource={this.props.achievementsDataSource}
                  renderRow={(achievement, sectionID, rowID) => this.renderAchievement(achievement, navigator, rowID)}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case "achievements":
      return this.renderAchievements(navigator);
    case "achievement":
      return this.renderSelectedAchievement(this.props.achievement);
    case "agelevels":
    default:
      return this.renderAgelevels(navigator);
    }
  }

  renderTitle() {
    switch(this.props.routeStack.length) {
    case 2:
      return (
        <View style={{flex: 1}}>
          <Text style={navigationStyles.mainTitle}>{this.props.agelevel.title}</Text>
        </View>
      );
    case 3:
      return (
        <View style={{flex: 1}}>
          <Text style={navigationStyles.backTitle}
                onPress={() => this._onBack()}>
            {this.props.agelevel.title}
          </Text>
        </View>
      );
    default:
      return (
        <View style={{flex: 1}}></View>
      );
    }
  }

  render() {
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <View style={infoStyles.topNavigationBar}>
          {renderBackButton(this.props.routeStack, () => this.popRoute())}
          {this.renderTitle()}
          {renderRefreshButton(() => this.fetchAchievements())}
        </View>
        {this.renderContent()}
      </View>
    );
  }

  renderContent() {
    switch (this.props.fetch.state) {
    case "STARTED":
      return renderProgressBar();
    case "ERROR":
      if (this.props.achievements === null) {
        return (<Text>Ei voitu hakea aktiviteetteja</Text>);
      }
    case "COMPLETED":
    default:
      if (this.props.achievements === null) {
        return renderProgressBar();
      }
      const {lang, achievements} = this.props;
      return (
        <View style={{flex: 1}}>
          <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10}]}>
            {t("Tilanne", lang)} {moment(achievements.timestamp).format(t("Timestamp", lang))}
          </Text>
          <Navigator ref={(component) => {this._navigator = component;}}
            onWillFocus={(route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popAchievementsRoute)}
            initialRouteStack={this.props.routeStack}
            renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    }
  }

  fetchAchievements() {
    fetchData("Fetching achievements",
              this.props.actions.setFetchStatus,
              "/AchievementCategories/Translations",
              this.props.credentials ? {access_token: this.props.credentials.token} : {},
              this.props.actions.setAchievements,
              this.props.lang,
              t("Aktiviteettien haku epäonnistui", this.props.lang),
              null,
              (etag) => {},
              () => this.reLogin());
  }

  popRoute() {
    this.props.actions.popAchievementsRoute();
    this._navigator.pop();
  }

  componentWillMount() {
    if (this.props.achievements === null || this.props.achievements.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      this.fetchAchievements();
    }
    this._onBack = () => {
      if (this.props.routeStack.length === 1) {
        return false;
      }
      this.popRoute();
      return true;
    };
    BackAndroid.addEventListener('hardwareBackPress', this._onBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._onBack);
  }

}

const actions = {
  setAchievements: (achievements) => ({
    type: "SET_ACHIEVEMENTS",
    achievements: achievements
  }),
  setError: (error) => ({
    type: "SET_ACHIEVEMENTS_ERROR",
    error: error
  }),
  selectAgelevel: (agelevel, route) => ({
    type: "SELECT_AGELEVEL",
    agelevel: agelevel,
    route: route
  }),
  selectAchievement: (achievement, route) => ({
    type: "SELECT_ACHIEVEMENT",
    achievement: achievement,
    route: route
  }),
  markAchievementDone: (done) => ({
    type: "MARK_ACHIEVEMENT_DONE",
    done: done
  }),
  popAchievementsRoute: () => ({
    type: "POP_ACHIEVEMENTS_ROUTE"
  }),
  setFetchStatus: (state) => ({
    type: "ACHIEVEMENTS_FETCH_STATE",
    state: state
  })
};

export default connect(state => ({
  achievements: state.achievements.achievements,
  error: state.achievements.error,
  ageLevelDataSource: state.achievements.ageLevelDataSource,
  achievementsDataSource: state.achievements.achievementsDataSource,
  agelevel: state.achievements.agelevel,
  achievement: state.achievements.achievement,
  routeStack: state.achievements.routeStack,
  lang: state.language.lang,
  fetch: state.achievements.fetch,
  credentials: state.credentials
}), (dispatch) => ({
  actions: bindActionCreators(Object.assign(actions,
                                            {removeCredentials: removeCredentials,
                                             setView: setView}), dispatch)
}))(Achievements);
