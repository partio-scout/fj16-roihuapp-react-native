'use strict';
import React, {
  Component,
  View,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../login/actions.js';
import Login from '../login/index.js';
import { config } from '../../config.js';
import { parseCredentials } from '../auth/utils.js';

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

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const [userId, token] = parseCredentials(url);
        if (userId && token) {
          this.props.actions.setCredentials({token: token, userId: userId});
        }
      }
    });
  }
}

export default connect(state => ({
  credentials: state.credentials,
  userId: state.userId
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Auth);
