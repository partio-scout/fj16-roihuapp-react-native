'use strict';
import React, {
  Component,
  View,
  Text,
  TextInput
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions.js';

export class InputImpl extends Component {
  render() {
    const { text, actions: {setText} } = this.props;
    return (
      <View>
        <Text>text:</Text>
        <TextInput onChangeText={setText}
                   value={text}/>
      </View>
    );
  }
}

export const Input = connect(state => ({
  text: state.text
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(InputImpl);
