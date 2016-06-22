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
import { infoStyles, categoryStyles, navigationStyles } from '../../styles.js';
import { renderRefreshButton, renderBackButton } from '../../utils.js';
import { t } from '../../translations.js';
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

  renderInfoTitle(title, routeStack) {
    switch (routeStack.length) {
      case 2:
        return(
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={navigationStyles.mainTitle}>{title}</Text>
          </View>
        );
      case 3:
        return(
          <View style={{flex: 1}}>
            <Text
              numberOfLines={1}  
              style={navigationStyles.backTitle} 
              onPress={() => this.onBack()}>
              {title}
            </Text>
          </View>
        );        
      default:
         return(<View style={{flex: 1}}></View>);
    }
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

  getCurrentTitle() {
    return this.props.tab === "instructions" ? this.props.instructionsTitle : this.props.locationsTitle;
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
          {this.renderInfoTitle(this.getCurrentTitle(), this.getRouteStack())}
          {renderRefreshButton(() => this.getEventEmitter().emit("refresh"))}
        </View>
        <View style={infoStyles.tabs}>
          {this.renderTabButton("instructions", t("Ohjeet", lang))}
          {this.renderTabButton("locations", t("Paikat", lang))}
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
  locationsRouteStack: state.locations.routeStack,
  instructionsTitle: state.instructions.currentTitle,
  locationsTitle: state.locations.currentTitle,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Info);
