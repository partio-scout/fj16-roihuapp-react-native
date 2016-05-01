'use strict';
import React, {
  Component,
  WebView,
  PropTypes,
  requireNativeComponent
} from 'react-native';

var iface = {
  name: 'CacheClearableWebView',
  propTypes: {
    ...WebView.propTypes,
    clearCache: PropTypes.bool
  }
};

const RCTCacheClearableWebView = requireNativeComponent('RCTCacheClearableWebView', iface);

class LoginWebView extends Component {
  render() {
    return (
      <RCTCacheClearableWebView {...this.props} clearCache={true}/>
    );
  }
}

module.exports = LoginWebView;
