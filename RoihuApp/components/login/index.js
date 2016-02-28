'use strict';
import React, {
  Component,
  View,
  Dimensions,
  WebView,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions.js';

class Login extends Component {

  render() {
    const { token, uri } = this.props;
    return (
      <View style={{flex: 1}}>
        {this.renderLogin(token, uri)}
      </View>
    );
  }

  renderLogin(token, uri) {
    if (token === "") {
      return (
        <WebView source={{uri: uri}}
                 style={{width: Dimensions.get("window").width}}
                 onNavigationStateChange={(navState) => this.onNavigationStateChange(navState)}/>
      );
    } else {
      return (
        <Text>Login succesfull</Text>
      );
    }
  }

  onNavigationStateChange(navState) {
    var match = /.*token=(.*$)/.exec(navState.url);
    if (match) {
      const { actions: {setToken} } = this.props;
      setToken(match[1]);
    }
  }
}

export default connect(state => ({
  token: state.token
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Login);
