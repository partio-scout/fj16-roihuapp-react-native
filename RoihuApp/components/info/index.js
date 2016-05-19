'use strict';
import React, {
  Component,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Instructions from '../instructions/index.js';
import Locations from '../locations/index.js';
import { renderRefreshButton, renderBackButton } from '../../utils.js';
const EventEmitter = require('EventEmitter');
const Icon = require('react-native-vector-icons/MaterialIcons');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'},
  tabs: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5
  }
});

class Info extends Component {

  constructor(props) {
    super(props);
    this.instructionsEventEmitter = new EventEmitter();
    this.locationsEventEmitter = new EventEmitter();
  }

  renderSelectionHighlight() {
    return (<Text style={{height: 2, width: 100, backgroundColor: 'green'}}></Text>);
  }

  renderTabButton(id, text) {
    return (
      <TouchableOpacity style={styles.button}
                        onPress={() => this.props.actions.setTab(id)}>
        <View style={{alignItems: 'center'}}>
          <Text>{text}</Text>
          {this.props.tab === id ? this.renderSelectionHighlight() : null}
        </View>
      </TouchableOpacity>
    );
  }

  renderTab(tab) {
    switch(tab) {
    case "locations":
      return (<Locations emitter={this.getEventEmitter()}/>);
    case "instructions":
    default:
      return (<Instructions emitter={this.getEventEmitter()}/>);
    }
  }

  getRouteStack() {
    return this.props.tab === "instructions" ? this.props.instructionsRouteStack : this.props.locationsRouteStack;
  }

  getEventEmitter() {
    switch(this.props.tab) {
    case "locations":
      return this.locationsEventEmitter;
    case "instructions":
    default:
      return this.instructionsEventEmitter;
    }
  }

  render() {
    return (
      <View style={[styles.container, {width: Dimensions.get("window").width}]}>
        <View style={{flexDirection: 'row'}}>
          {renderBackButton(this.getRouteStack(), () => this.onBack())}
          <View style={{flex: 1}}></View>
          {renderRefreshButton(() => this.getEventEmitter().emit("refresh"))}
        </View>
        <View style={styles.tabs}>
          {this.renderTabButton("instructions", "Ohjeet")}
          {this.renderTabButton("locations", "Paikat")}
        </View>
        <View style={{flex: 1,
                      alignItems: 'center',
                      width: Dimensions.get("window").width
              }}>
          {this.renderTab(this.props.tab)}
        </View>
      </View>
    );
  }

  componentWillMount() {
    this.onBack = () => {
      const routeStack = this.getRouteStack();
      if (routeStack.length === 1) {
        return false;
      } else {
        this.getEventEmitter().emit("back");
        return true;
      }
    };
    BackAndroid.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
  }
}

const actions = {
  setTab: (tab) => ({
    type: "SET_INFO_TAB",
    tab: tab
  })
};

export const info = (
  state = {
    tab: "instructions"
  },
  action) => {
    switch (action.type) {
    case "SET_INFO_TAB":
      return Object.assign({}, state, {tab: action.tab});
    }
    return state;
  };

export default connect(state => ({
  tab: state.info.tab,
  instructionsRouteStack: state.instructions.routeStack,
  locationsRouteStack: state.locations.routeStack
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Info);
