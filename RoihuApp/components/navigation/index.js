'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {styles} from '../../styles.js';
import {Map} from '../map.js';
import {Calendar} from '../calendar.js';
import * as actions from './actions.js';

class Navigation extends Component {

  render() {
    const { view, actions: {setView} } = this.props;
    return (
      <View style={styles.main}>
        <View style={styles.content}>
          {this.renderView(view)}
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("calendar")}>
            <Image source={require('../../icons/calendar.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("map")}>
            <Image source={require('../../icons/pin.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderView(view) {
    switch (view) {
    case "calendar":
      return (<Calendar/>);
      break;
    case "map":
      return (<Map/>);
      break;
    default:
      return (<Calendar/>);
    }
  }

}

export default connect(state => ({
  view: state.view
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Navigation);
