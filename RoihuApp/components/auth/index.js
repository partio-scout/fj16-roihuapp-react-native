'use strict';
import React, {
  Component,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Login from '../login/index.js';

class Auth extends Component {
  render() {
    const { token } = this.props;
    return (
      <View style={{flex: 1}}>{this.renderChildren(token)}</View>
    );
  }

  renderChildren(token) {
    if (token === "") {
      return (
        <Login uri="https://peaceful-plateau-58782.herokuapp.com"/>
      );
    } else {
      return (
        this.props.children
      );
    }
  }
}

export default connect(state => ({
  token: state.token
}))(Auth);