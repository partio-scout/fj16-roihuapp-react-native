'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Auth from '../auth/index.js';

class Info extends Component {
  render() {
    const { token, info } = this.props;
    return (
      <Auth>
        <Text>moi {token} {info}</Text>
      </Auth>
    );
  }
}

export default connect(state => ({
  token: state.token,
  info: state.info
})
)(Info);
