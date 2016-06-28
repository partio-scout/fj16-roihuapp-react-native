'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableHighlight,
  ListView,
  StyleSheet,
  Navigator
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import f from 'tcomb-form-native';
import { t } from '../../translations.js';
import { fields, options } from '../models/SearchEventsModel';
import { categoryStyles, styles } from '../../styles.js';
import { popWhenRouteNotLastInStack } from '../../utils.js';

class Events extends Component {

  constructor(props) {
    super(props);
    this.searchEvent = this.searchEvent.bind(this);
  }

  searchEvent() {
    console.log('REFFIT:');
    /*const result = this.refs.form.getValue();
    if (result) {
      this.props.actions.setLatestSearch(result);
    } */   
  }

  renderEventsSearch() {
    const Form = f.form.Form;
    const { search, lang } = this.props;    
    return (
      <View style={categoryStyles.article}>
        <View style={[categoryStyles.articleContentContainer, {flexDirection: 'row'}]}>
          <View style={{height: 40, flex: 4}}>
            <Form 
              ref="search" 
              value={search} 
              type={fields} 
              options={options(lang)} 
            />
          </View>
          <View style={{flex: 1}}>
            <TouchableHighlight style={[styles.basicButton]} onPress={() => this.searchEvent()}>
              <Text style={styles.buttonBarColor}>{t("Hae", lang)}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
      case "event":
        return (<View />);
      case "search":
      default:
        return this.renderEventsSearch();
    }
  }

  render() {
    const onWillFocus = (route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popNavigationRoute);
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Navigator initialRouteStack={this.props.routeStack}
                   onWillFocus={onWillFocus}
                   renderScene={(route, navigator, refs) => this.renderScene(route, navigator, refs)}/>
      </View>
    )
  }

  onBack() {
    if (this._navigator) {
      this.props.actions.popNavigationRoute();
      this._navigator.pop();
    }
  }

  componentWillMount() {
    this.backListener = this.props.emitter.addListener("back", () => this.onBack());
  }

  componentWillUnmount() {
    this.backListener.remove();
  }
}

const actions = {
  popNavigationRoute: () => ({
    type: "POP_EVENTS_ROUTE"
  }),
  setLatestSearch: (search) => ({
    type: "SET_SEARCH_RESULT",
    search: search 
  })
};

export const events = (
  state = {search: {}, routeStack: [{name: "search"}]},
  action) => {
    switch (action.type) {
    case "SET_SEARCH_RESULT":
      return Object.assign({}, state, {search: action.search});      
    case "POP_EVENTS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    }
    return state;
  };

export default connect(state => ({
  search: state.events.search,
  routeStack: state.events.routeStack,
  lang: state.language.lang,
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Events);
