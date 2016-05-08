'use strict';
import React, {
  Component,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Instructions from '../instructions/index.js';
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

  renderTab(tab, emitter) {
    switch(tab) {
    case "locations":
      return (<Text>Locations</Text>);
    case "instructions":
    default:
      return (<Instructions emitter={emitter}/>);
    }
  }

  renderBackButton() {
    const routeStack = this.props.tab === "instructions" ? this.props.instructionsRouteStack : [{}];
    if (routeStack.length === 1) {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}
                          onPress={() => this.eventEmitter.emit("back")}>
          <Icon name="arrow-back" size={30} color="#000000"/>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View style={[styles.container, {width: Dimensions.get("window").width}]}>
        <View style={{flexDirection: 'row'}}>
          {this.renderBackButton()}
          <View style={{flex: 1}}></View>
          <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                            onPress={() => this.eventEmitter.emit("refresh")}>
            <Icon style={{textAlign: 'right'}} name="refresh" size={30} color="#000000"/>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          {this.renderTabButton("instructions", "Ohjeet")}
          {this.renderTabButton("locations", "Paikat")}
        </View>
        <View style={{flex: 1,
                      alignItems: 'center',
                      width: Dimensions.get("window").width
              }}>
          {this.renderTab(this.props.tab, this.eventEmitter)}
        </View>
      </View>
    );
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter();
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
  instructionsRouteStack: state.instructions.routeStack
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Info);
