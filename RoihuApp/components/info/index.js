'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Info extends Component {
  render() {
    const { token, data, error } = this.props;
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

  componentDidMount() {
    const { token } = this.props;
    if (token !== "") {
      fetch("https://peaceful-plateau-58782.herokuapp.com/me?token=" + token)
        .then((response) => response.json())
        .then((info) => {
          this.props.actions.setInfo(info);
        })
        .catch((error) => {
          this.props.actions.setError(error);
        });
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
  setInfo: (data) => ({
    type: "SET_INFO",
    data: data
  }),
  setError: (error) => ({
    type: "SET_ERROR",
    error: error
  })
};

export default connect(state => ({
  token: state.token,
  data: state.info.data,
  error: state.info.error
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Info);
