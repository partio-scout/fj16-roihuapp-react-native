'use strict';
import React, {
  Component,
  View,
  Dimensions,
  WebView,
  Text,
  requireNativeComponent,
  PropTypes
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions.js';
import { parseCredentials } from '../auth/utils.js';

var iface = {
  name: 'CacheClearableWebView',
  propTypes: {
    ...WebView.propTypes,
    clearCache: PropTypes.bool
  }
};

const RCTCacheClearableWebView = requireNativeComponent('RCTCacheClearableWebView', iface);

class Login extends Component {

  render() {
    const { credentials, uri } = this.props;
    return (
      <View style={{flex: 1}}>
        {this.renderLogin(credentials, uri)}
      </View>
    );
  }

  renderLogin(credentials, uri) {
    if (credentials === null) {
      return (
        <RCTCacheClearableWebView source={{uri: uri}}
                                  style={{flex: 1}}
                                  javaScriptEnabled={true}
                                  clearCache={true}
                                  onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}/>
      );
    } else {
      return (
        <Text>Login succesfull</Text>
      );
    }
  }

  onNavigationStateChange(navState) {
    const [userId, token] = parseCredentials(navState.url);
    if (userId && token) {
      this.props.actions.setCredentials({token: token, userId: userId});
    }
  }
}

export default connect(state => ({
  credentials: state.credentials
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Login);
