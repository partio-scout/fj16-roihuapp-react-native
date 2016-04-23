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
    const { credentials, data, error } = this.props;
    console.log("props", this.props);
    if (!isEmpty(data)) {
      return (
        <Text>{data.firstname} {data.lastname}</Text>
      );
    } else if (error !== null) {
      return (
        <Text>error</Text>
      );
    } else {
      return (
        <Text>No info</Text>
      );
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
  setAchievements: (data) => ({
    type: "SET_ACHIEVEMENTS",
    achievements: data
  }),
  setError: (error) => ({
    type: "SET_ERROR",
    error: error
  })
};

export default connect(state => ({
  achievements: state.achievements
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Achievements);
