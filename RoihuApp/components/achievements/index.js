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
import { renderBackButton } from '../../utils.js';

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

  renderAgelevel(agelevel, navigator) {
    return (
      <View key={"agelevel-" + agelevel.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            this.props.actions.selectAgelevel(agelevel);
            navigator.push({name: "achievements"});
          }}>
          <Text style={{fontWeight: 'bold'}}>{agelevel.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAgelevels(navigator) {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={{padding: 15}}
                          onPress={() => this.fetchAchievements()}>
          <Text style={{fontWeight: 'bold'}}>Päivitä</Text>
        </TouchableOpacity>
        <ListView key={"agelevels"}
                  dataSource={this.props.ageLevelDataSource}
                  renderRow={(agelevel) => this.renderAgelevel(agelevel, navigator)}/>
      </View>
    );
  }

  renderAchievement(achievement, navigator) {
    return (
      <View key={"achievement-" + achievement.title} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            this.props.actions.selectAchievement(achievement);
            navigator.push({name: "achievement"});
          }}>
          <Text style={{fontWeight: 'bold'}}>{achievement.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSelectedAchievement(achievement, navigator) {
    return (
      <View key={"achievement-" + achievement.title} style={styles.renderSelectedAchievement}>
      {renderBackButton(navigator)}
      <Text style={{fontWeight: 'bold', fontSize: 20}}>{achievement.title}</Text>
          <Text>{achievement.bodytext}</Text>
          <TouchableOpacity onPress={() => {
            }} style={styles.doThisAchievement}>
            <Text style={styles.doThisAchievementText}>I have done this</Text>
          </TouchableOpacity>
      </View>
    );
  }

  markAchievementDone(usrid, token, achievementid)
  {
    //Give user id, token, achieveent id
  }

  renderAchievements(navigator) {
    return (
      <View style={{flex: 1, borderRadius: 4,borderWidth: 0.5, borderColor: '#000'}}>
        {renderBackButton(navigator)}
        <ListView key={"achievements"}
                  enableEmptySections={true}
                  dataSource={this.props.achievementsDataSource}
                  renderRow={(achievement) => this.renderAchievement(achievement, navigator)}/>
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
    const { achievements, error } = this.props;
    if (error !== null && achievements === null) {
      return (<Text>Ei voitu hakea saavutuksia</Text>);
    } else {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator ref={(component) => {this._navigator = component;}}
                     initialRoute={{name: "agelevels"}}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    }
  }

  fetchAchievements() {
    console.log("Fetching achievements");
    fetch(config.apiUrl + "/AchievementCategories/Translations?lang=FI")
      .then((response) => response.json())
      .then((achievements) => {
        this.props.actions.setAchievements(achievements);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  componentDidMount() {
    if (this.props.achievements === null) {
      this.fetchAchievements();
    }
  }

  componentWillMount() {
    this._onBack = () => {
      if (this._navigator.getCurrentRoutes().length === 1  ) {
        return false;
      }
      this._navigator.pop();
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
  selectAgelevel: (agelevel) => ({
    type: "SELECT_AGELEVEL",
    agelevel: agelevel
  }),
  selectAchievement: (achievement) => ({
    type: "SELECT_ACHIEVEMENT",
    achievement: achievement
  })
};

export default connect(state => ({
  achievements: state.achievements.achievements,
  error: state.achievements.error,
  ageLevelDataSource: state.achievements.ageLevelDataSource,
  achievementsDataSource: state.achievements.achievementsDataSource,
  achievement: state.achievements.achievement
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Achievements);
