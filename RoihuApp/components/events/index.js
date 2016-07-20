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
import { fields, options, detailFields, detailOptions } from '../models/SearchEventsModel';
import { fetchEvents, renderEventRow, renderEvent } from '../common/events';
import { categoryStyles, styles } from '../../styles';
import { popWhenRouteNotLastInStack, sortByDate, last } from '../../utils';

const Form = f.form.Form;
const R = require('ramda');

class Events extends Component {

  searchEvent() {
    this.props.actions.setSearch(this.textForm.getValue());
    fetchEvents(
      "Fetching events",
      this.props.actions.setFetchStatus,
      "/CalendarEvents/Translations",
      this.props.search,
      this.props.actions.setLatestSearch,
      this.props.lang,
      t("Tapahtumien haku epäonnistui", this.props.lang)
    );
  }

  renderEventsSearch(navigator) {
    const { search, result, eventsDataSource, lang } = this.props;
    return (
      <View style={{flex: 1}}>
        <View style={[categoryStyles.articleContentContainer, {flexDirection: 'row'}]}>
          <View style={{flex: 4, marginTop: 10}}>
            <Form ref={(form) => this.textForm = form}
              value = {R.dissoc("startTime", R.dissoc("date", R.dissoc("ageGroup", search)))}
              type={fields(lang)}
              options={options(lang)}>
            </Form>
          </View>
          <View style={{flex: 1}}>
            <TouchableHighlight style={[styles.basicButton]} onPress={() => this.searchEvent()}>
              <Text style={styles.buttonBarColor}>{t("Hae", lang)}</Text>
            </TouchableHighlight>
          </View>
          <View style={{flex: 1, marginLeft: 5}}>
            <TouchableHighlight style={[styles.basicButton]} onPress={() => {
                const route = {name: "search-details"};
                this.props.actions.pushRoute(route);
                navigator.push(route);
              }}>
              <Text style={styles.buttonBarColor}>{"..."}</Text>
            </TouchableHighlight>
          </View>
        </View>
        {eventsDataSource ? (
          <View style={[categoryStyles.list, {flex: 5}]}>
            <ListView dataSource={eventsDataSource}
                      enableEmptySections={true}
                      renderRow={(event, sectionID, rowID) => renderEventRow(event, navigator, this.props.actions.selectEvent, lang, rowID) }
              style={{width: Dimensions.get("window").width}}/>
          </View>
        ) : (
          <View styles={{flex: 1}}>
            <Text style={[categoryStyles.textColor, categoryStyles.articleTitle]}>{t("Ei tapahtumia", lang)}</Text>
          </View>
        )
        }
      </View>
    );
  }

  renderSearchDetails(lang, search) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text>Haun tarkennukset</Text>
        <ScrollView>
          <Form ref={(form) => this.detailsForm = form}
            value={R.dissoc("searchString", search)}
            type={detailFields(lang)}
            options={detailOptions(lang)} />
        </ScrollView>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
      case "event":
      return renderEvent(this.props.event, this.props.lang);
    case "search-details":
      return this.renderSearchDetails(this.props.lang, this.props.search, this);
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
    );
  }

  onBack() {
    if (this._navigator) {
      if (last(this.props.routeStack).name === "search-details") {
        this.props.actions.setSearch(this.detailsForm.getValue());
      }
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
  setFetchStatus: (state) => ({
    type: "EVENTS_FETCH_STATE",
    state: state
  }),
  setLatestSearch: (search, result) => ({
    type: "SET_SEARCH_RESULT",
    search: search,
    result: result
  }),
  selectEvent: (event, route) => ({
    type: "SELECT_EVENTS_EVENT",
    event: event,
    route: route
  }),
  pushRoute: (route) => ({
    type: "PUSH_EVENTS_ROUTE",
    route: route
  }),
  setSearch: (search) => ({
    type: "SET_EVENTS_SEARCH",
    search: search
  })
};

export const events = (
  state = {
    event: {},
    search: {},
    result: {},
    eventsDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.eventId !== r2.eventId}),
    routeStack: [{name: "search"}]
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
    case "SELECT_EVENTS_EVENT":
      return Object.assign({}, state, {event: action.event, routeStack: state.routeStack.concat(action.route)});
    case "SET_EVENTS_SEARCH":
      return Object.assign({}, state, {search: R.merge(state.search, action.search)});
    case "PUSH_EVENTS_ROUTE":
      return Object.assign({}, state, {routeStack: state.routeStack.concat(action.route)});
    case "POP_EVENTS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    case "EVENTS_FETCH_STATE":
      const now = moment().unix();
      return Object.assign({},
                           state,
                           {fetch: Object.assign({},
                                                 state.fetch,
                                                 {state: action.state, lastTs: now},
                                                 action.state == "COMPLETED" ? {lastSuccesfullTs: now} : {})});
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
  fetch: state.events.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Events);
