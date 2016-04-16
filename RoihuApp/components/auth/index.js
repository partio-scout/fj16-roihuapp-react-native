'use strict';
import React, {
  Component,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Login from '../login/index.js';
import { config } from '../../config.js';

class Auth extends Component {
  render() {
    const { credentials } = this.props;
    return (
      <View style={{flex: 1}}>{this.renderChildren(credentials)}</View>
    );
  }

  renderChildren(credentials) {
    if (credentials === null) {
      return (
        <Login uri={config.loginUrl}/>
      );
    } else {
      return (
        this.props.children
      );
    }
  }
}

export default connect(state => ({
  credentials: state.credentials,
  userId: state.userId
}))(Auth);
