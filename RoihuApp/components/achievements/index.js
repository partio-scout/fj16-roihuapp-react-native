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
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { renderBackButton, renderRefreshButton } from '../../utils.js';
import { renderRoot, fetchData } from '../common/categories.js';
import { renderProgressBar } from '../../utils.js';

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 15
  },
  doThisAchievement: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'red',
    padding: 5,
    width: 150
  },
  doThisAchievementText: {
    color: '#000',
    textAlign: 'center'
  },
  renderSelectedAchievement: {
  }
});

class Achievements extends Component {

  renderAgelevel(agelevel, navigator, rowID) {
    return (
      <View key={"agelevel-" + rowID} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            const route = {name: "achievements"};
            this.props.actions.selectAgelevel(agelevel, route);
            navigator.push(route);
          }}>
          <Text style={{fontWeight: 'bold'}}>{agelevel.title}</Text>
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

  renderAchievement(achievement, navigator, rowID) {
    return (
      <View key={"achievement-" + rowID} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            const route = {name: "achievement"};
            this.props.actions.selectAchievement(achievement, route);
            navigator.push(route);
          }}>
          <Text style={{fontWeight: 'bold'}}>{achievement.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSelectedAchievement(achievement, navigator) {
    return (
      <View style={styles.renderSelectedAchievement}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{achievement.title}</Text>
        <Text>{achievement.bodytext}</Text>
      </View>
    );
  }

  markAchievementDone(usrid, token, achievementid)
  {
    //Give user id, token, achieveent id
  }

  renderAchievements(navigator) {
    return (
      <View style={{flex: 1}}>
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
      return this.renderSelectedAchievement(this.props.achievement, navigator);
    case "agelevels":
    default:
      return this.renderAgelevels(navigator);
    }
  }

  render() {
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <View style={{flexDirection: 'row'}}>
          {renderBackButton(this.props.routeStack, () => this.popRoute())}
          <View style={{flex: 1}}></View>
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
      return (
        <Navigator ref={(component) => {this._navigator = component;}}
          initialRouteStack={this.props.routeStack}
          renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
      );
    }
  }

  fetchAchievements() {
    fetchData("Fetching achievements",
              this.props.actions.setFetchStatus,
              "/AchievementCategories/Translations",
              this.props.actions.setAchievements,
              this.props.lang,
              "Aktiviteettien haku epäonnistui");
  }

  componentDidMount() {
    if (this.props.achievements === null || this.props.achievements.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      this.fetchAchievements();
    }
  }

  popRoute() {
    this._navigator.pop();
    this.props.actions.popAchievementsRoute();
  }

  componentWillMount() {
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
  achievement: state.achievements.achievement,
  routeStack: state.achievements.routeStack,
  lang: state.language.lang,
  fetch: state.achievements.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Achievements);
