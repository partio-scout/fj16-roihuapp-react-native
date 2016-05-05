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
import Map from '../map/index.js';
import Calendar from '../calendar/index.js';
import Auth from '../auth/index.js';
import User from '../user/index.js';
import Instructions from '../instructions/index.js';
import * as actions from './actions.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

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
            <View style={{alignItems: 'center'}}>
              <Icon name="date-range" size={30} color="#000000"/>
              <Text>Kalenteri</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("map")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="place" size={30} color="#000000"/>
              <Text>Kartta</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("instructions")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="search" size={30} color="#000000"/>
              <Text>Info</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
                            onPress={() => setView("user")}>
            <View style={{alignItems: 'center'}}>
              <Icon name="account-circle" size={30} color="#000000"/>
              <Text>Minä</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderView(view) {
    switch (view) {
    case "calendar":
      return (<Calendar/>);
    case "map":
      return (<Map/>);
    case "instructions":
      return (<Instructions/>);
    case "user":
      return (
        <Auth>
          <User/>
        </Auth>
      );
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
