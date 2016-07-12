'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  ListView,
  StyleSheet,
  Navigator,
  ScrollView
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import f from 'tcomb-form-native';
import { t } from '../../translations';
import { fields, options } from '../models/SearchEventsModel';
import { fetchEvents, renderEvents, renderEvent } from '../common/events';
import { categoryStyles, styles } from '../../styles';
import { popWhenRouteNotLastInStack, sortByDate } from '../../utils';

const Form = f.form.Form;

class Events extends Component {

  constructor(props) {
    super(props);
  }

  searchEvent() {
    let data = this.refs.getValue();
    if (data) {
      fetchEvents("/CalendarEvents/Translations", data, this.props.actions.setLatestSearch, this.props.lang);
    }
  }

  renderEventsSearch(navigator) {
    const Form = f.form.Form;
    const { search, eventsDataSource, lang } = this.props;    
    return (
      <View style={categoryStyles.article}>
        <View style={[categoryStyles.articleContentContainer, {flexDirection: 'row'}]}>
          <View style={{height: 40, flex: 4}}>
            <Form ref={(form) => this.refs = form} value={search} type={fields(lang)} options={options(lang)} />         
          </View>
          <View style={{flex: 1}}>
            <TouchableHighlight style={[styles.basicButton]} onPress={() => this.searchEvent()}>
              <Text style={styles.buttonBarColor}>{t("Hae", lang)}</Text>
            </TouchableHighlight>
          </View>
        </View>
        {eventsDataSource ? (
          <ScrollView style={categoryStyles.list}>
            <ListView dataSource={eventsDataSource}
                      renderRow={(event, sectionID, rowID) => renderEvents(event, navigator, this.props.actions.selectEvent, lang, rowID) }
              style={{width: Dimensions.get("window").width}}/>
          </ScrollView>
          ): (<View><Text>Ei löydy</Text></View>)
        }
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
      case "event":
        return renderEvent(navigator, this.props.event, this.props.lang);
      case "search":
      default:
        return this.renderEventsSearch(navigator);
    }
  }

  render() {
    const onWillFocus = (route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popNavigationRoute);
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Navigator initialRouteStack={this.props.routeStack}
                   onWillFocus={onWillFocus}
                   renderScene={(route, navigator) => this.renderScene(route, navigator)}/>

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
  setLatestSearch: (search, result) => ({
    type: "SET_SEARCH_RESULT",
    search: search,
    result: result 
  }),
  selectEvent: (event, route) => ({
    type: "SELECT_EVENT",
    event: event,
    route: route
  })
};

export const events = (
  state = {
    event: {}, 
    search: {}, 
    result: {}, 
    eventsDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.eventId !== r2.eventId}), routeStack: [{name: "search"}]
  },
  action) => {
    switch (action.type) {
    case "SET_SEARCH_RESULT":
      return Object.assign(
        {}, state, {
          search: action.search, 
          result: action.result, 
          eventsDataSource: state.eventsDataSource.cloneWithRows(action.result.events.sort((a, b) => sortByDate(a.startTime, b.startTime)))
        }
      );
    case "SELECT_EVENT":
      return Object.assign({}, state, {event: action.event, routeStack: state.routeStack.concat(action.route)});            
    case "POP_EVENTS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    }
    return state;
  };

export default connect(state => ({
  event: state.events.event,
  search: state.events.search,
  result: state.events.result,
  eventsDataSource: state.events.eventsDataSource,
  routeStack: state.events.routeStack,
  lang: state.language.lang,
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Events);
