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
import { infoStyles, categoryStyles } from '../../styles.js';
import { renderRefreshButton, renderBackButton } from '../../utils.js';
const EventEmitter = require('EventEmitter');
const Icon = require('react-native-vector-icons/MaterialIcons');

class Info extends Component {

  constructor(props) {
    super(props);
    this.instructionsEventEmitter = new EventEmitter();
    this.locationsEventEmitter = new EventEmitter();
  }

  renderSelectionHighlight() {
    return (<Text style={{height: 4, width: 100, backgroundColor: '#18A771'}}></Text>);
  }

  renderTabButton(id, text) {
    return (
      <TouchableOpacity style={infoStyles.button}
                        onPress={() => this.props.actions.setTab(id)}>
        <View style={{alignItems: 'center'}}>
          <Text style={infoStyles.tabText}>{text.toUpperCase()}</Text>
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
    const { view, actions: {setView}, lang } = this.props;
    return (
      <View style={[infoStyles.container, {width: Dimensions.get("window").width}]}>
        <View style={infoStyles.topNavigationBar}>
          {renderBackButton(this.getRouteStack(), () => this.onBack())}
          <View style={{flex: 1}}>
            <Text style={{color: '#FFFFFF', fontSize: 24, textAlign: 'center', marginTop: 7}}>{/*TitleText*/}</Text>
          </View>
          {renderRefreshButton(() => this.getEventEmitter().emit("refresh"))}
        </View>
        <View style={infoStyles.tabs}>
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
