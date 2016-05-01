'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';

class Achievements extends Component {
  render() {
    const { achievements, error } = this.props;
    if (achievements !== null) {
      return (
        <Text>{achievements.timestamp}</Text>
      );
    } else if (error !== null) {
      return (
        <Text>{error}</Text>
      );
    } else {
      return (
        <Text></Text>
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
    console.log("props", this.props);
    if (this.props.achievements === null) {
      this.fetchAchievements();
    }
  }
}

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

const actions = {
  setAchievements: (achievements) => ({
    type: "SET_ACHIEVEMENTS",
    achievements: achievements
  }),
  setError: (error) => ({
    type: "SET_ERROR",
    error: error
  })
};

export default connect(state => ({
  achievements: state.achievements.achievements,
  error: state.achievements.error
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Achievements);
