'use strict';
import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ListView,
  ScrollView,
  Navigator,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config';
import { removeCredentials } from '../login/actions';
import { renderRefreshButton, last, renderProgressBar } from '../../utils';
import { calendarStyles, infoStyles, categoryStyles } from '../../styles';
import { t } from '../../translations.js';
import { fetchData, shouldFetch } from '../common/categories';
import { renderEvent } from '../common/events';
const Icon = require('react-native-vector-icons/MaterialIcons');
const R = require('ramda');

class Calendar extends Component {

  constructor(props) {
    super(props);
  }

  getBackgroundColor(type) {
    switch(type) {
      case 'Ruokailu':
        return 'rgb(188, 231, 214)';
      case 'Tapaaminen':
        return 'rgb(201, 232, 248)';
      case 'Päiväohjelma':
        return 'rgb(255, 249, 177)';
      case 'Iltaohjelma':
        return 'rgb(246, 199, 186)';
      case 'Valinnainen ohjelma':
      default:
        return 'rgb(232, 187, 215)';
    }
  }

  renderAudience(event, lang) {
    if (event.subcamp !== '') {
      return t("Vain alaleirille", lang);
    } else if (event.camptroop !== '') {
      return t("Vain leirilippukunnalle", lang);
    } else {
      return t("Kaikille", lang);
    }
  }

  renderEventRow(event, navigator, rowID) {
    const { lang } = this.props;
    const background = this.getBackgroundColor(event.type);
    return (
      <View key={"calendar-" + rowID} style={[categoryStyles.listItem, {backgroundColor: background}]}>
        <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
            const route = {name: "event"};
            this.props.actions.selectEvent(event, route);
            this.props.pushRoute(route);
          }}>
          <Text style={[categoryStyles.textColor, {flex: 1}]}>
            <Text>
              {moment(event.startTime).format(t("Time", lang))}-{"\n"}
            </Text>
            <Text>
              {moment(event.endTime).format(t("Time", lang))}
            </Text>
          </Text>
          <Text style={[categoryStyles.textColor, {flex: 5}]}>{event.name.slice(0,35).toUpperCase()}{event.name.length > 35 ? '...' : ''}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderCalendar(navigator, calendarDataSource) {
    return (
      <View style={categoryStyles.list}>
        <ListView dataSource={calendarDataSource}
                  renderRow={(event, sectionID, rowID) => this.renderEventRow(event, navigator, rowID) }
          style={{width: Dimensions.get("window").width}}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
      case "event":
      return renderEvent(this.props.event, this.props.lang);
      case "calendar-root":
      default:
        return this.renderCalendar(navigator, this.props.calendarDataSource);
    }
  }

  renderDateSelection() {
    const { selectedDay, lang } = this.props;
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.props.actions.selectDate("today")}>
            <Text style={calendarStyles.todayButton}>{t("TÄNÄÄN", lang).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => this.props.actions.selectDate("prev")}>
          <View style={calendarStyles.dateSelectionIconContainer}>
            <Icon style={calendarStyles.dateSelectionIcon} name="keyboard-arrow-left" />
          </View>
        </TouchableOpacity>
        <Text style={{width: 80, textAlign: 'center'}}>{moment(selectedDay, "YYYY.MM.DD").locale(lang).format("dddd[\n]DD.MM.YYYY")}</Text>
        <TouchableOpacity onPress={() => this.props.actions.selectDate("next")}>
          <View style={calendarStyles.dateSelectionIconContainer}>
            <Icon style={calendarStyles.dateSelectionIcon} name="keyboard-arrow-right" />
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}/>
      </View>
    );
  }

  renderContent() {
    if (R.isEmpty(this.props.eventsByDay)) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>{t("Ei kalenteritapahtumia", this.props.lang)}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          {last(this.props.routeStack).name === "calendar-root" ? this.renderDateSelection() : null}
          <Navigator initialRouteStack={this.props.parentNavigator.getCurrentRoutes()}
                     navigator={this.props.parentNavigator}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}
            configureScene={() => ({
                ...Navigator.SceneConfigs.FloatFromRight,
              gestures: {},
            })}/>
        </View>
      );
    }
  }

  renderContentWithTimestamp() {
    const { fetch: { lastSuccesfullTs }, lang } = this.props;
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10, marginTop: 0}]}>
          {t("Tilanne", lang)} {moment(lastSuccesfullTs * 1000).format(t("Timestamp", lang))}
        </Text>
        {this.renderContent()}
      </View>
    );
  }

  render() {
    const { calendar, error, lang, selectedDay, routeStack } = this.props;
    switch (this.props.fetch.state) {
    case "STARTED":
      return renderProgressBar();
    case "ERROR":
      if (calendar === null) {
        return (<Text>t("Ei voitu hakea kalenteria", lang)</Text>);
      }
    case "COMPLETED":
    default:
      return this.renderContentWithTimestamp();
    }
  }

  componentWillMount() {
    const doFetch = R.partial(fetchData,
                             ["Fetching user calendar",
                              this.props.actions.setFetchStatus,
                              `/RoihuUsers/${this.props.credentials.userId}/calendar`,
                              {access_token: this.props.credentials.token},
                              (data) => this.props.actions.setCalendar(data.calendar),
                              this.props.lang,
                              t("Kalenterin haku epäonnistui", this.props.lang),
                              this.props.fetch.etag,
                              this.props.actions.setEtag]);
    if (shouldFetch(this.props.calendar, this.props.lang, this.props.fetch.lastTs)) {
      doFetch();
    }

    this.refreshListener = this.props.refreshEventEmitter.addListener("refresh", () => doFetch());
  }

  componentWillUnmount() {
    this.refreshListener.remove();
  }
}

const setCalendar = (calendar) => ({
  type: "SET_CALENDAR",
  calendar: calendar
});

const selectEvent = (event) => ({
  type: "SELECT_CALENDAR_EVENT",
  event: event
});

const setError = (error) => ({
  type: "SET_CALENDAR_ERROR",
  error: error
});

const selectDate = (selection) => ({
  type: "SELECT_CALENDAR_DATE",
  selection: selection
});

const setFetchStatus = (state) => ({
  type: "CALENDAR_FETCH_STATE",
  state: state
});

const setEtag = (etag) => ({
  type: "SET_CALENDAR_ETAG",
  etag: etag
});

export default connect(state => ({
  credentials: state.credentials,
  event: state.calendar.event,
  eventsByDay: state.calendar.eventsByDay,
  selectedDay: state.calendar.selectedDay,
  calendar: state.calendar.calendar,
  calendarDataSource: state.calendar.calendarDataSource,
  error: state.calendar.error,
  lang: state.language.lang,
  routeStack: state.calendar.routeStack,
  fetch: state.calendar.fetch
}), (dispatch) => ({
  actions: bindActionCreators({setCalendar,
                               selectEvent,
                               setError,
                               removeCredentials,
                               selectDate,
                               setFetchStatus,
                               setEtag}, dispatch)
}))(Calendar);
