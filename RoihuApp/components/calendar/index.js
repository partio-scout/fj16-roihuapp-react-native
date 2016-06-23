'use strict';
import React, {
  Component,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ListView,
  Navigator,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config';
import { removeCredentials } from '../login/actions';
import { isEmpty, renderRefreshButton } from '../../utils';
import { infoStyles, categoryStyles } from '../../styles';
import { t } from '../../translations.js';

class Calendar extends Component {

  constructor(props) {
    super(props);
  }  

  getBackgroundColor(type) {
    switch(type) {
      case 'Ruokailu':
        return 'rgb(121, 207, 173)';
      case 'Tapaaminen':
        return 'rgb(146, 208, 240)';
      case 'Aamuohjelma':
        return 'rgb(255, 243, 99)';
      case 'Iltaohjelma':
        return 'rgb(236, 142, 117)';
      case 'Valinnainen ohjelma':
      default:
        return 'rgb(208, 119, 174)';
    }
  }

  renderCalendarEvent(navigator, event) {
    return (
      <View>
        <Text>{event.name}</Text>
      </View>
    );
  }

  renderCalendarEvents(event, navigator, rowID) {
    const { view, actions: {setView}, lang } = this.props;
    const background = this.getBackgroundColor(event.type);
    return (
      <View key={"calendar-" + rowID} style={[categoryStyles.listItem, {backgroundColor: background}]}>
        <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
            const route = {name: "event"};
            this.props.actions.selectEvent(event, route);
            navigator.push(route);
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
                  renderRow={(event, sectionID, rowID) => this.renderCalendarEvents(event, navigator, rowID) }
          style={{width: Dimensions.get("window").width}}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
      case "event":
        return this.renderCalendarEvent(navigator, this.props.event);
      case "user-root":
      default:
        return this.renderCalendar(navigator, this.props.calendarDataSource);
    }
  }

  render() {
    const { calendar, error, lang } = this.props;
    if (!isEmpty(calendar)) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10}]}>
            {t("Tilanne", lang)} {moment(calendar.timestamp).format(t("Timestamp", lang))}
          </Text>              
          <Navigator initialRouteStack={this.props.parentNavigator.getCurrentRoutes()}
                     navigator={this.props.parentNavigator}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}
                     configureScene={() => ({
                     ...Navigator.SceneConfigs.FloatFromRight,
                     gestures: {},
          })}/>
        </View>
      );
    } else if (error !== null) {
      return (
        <Text>error</Text>
      );
    } else {
      return (
        <Text>No calendar</Text>
      );
    }
  }

  fetchUserCalendar(credentials, setCalendar, setError) {
    console.log("Fetching user calendar");
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "/calendar?access_token=" + credentials.token + "&lang=" + this.props.lang.toUpperCase())
      .then((response) => response.json())
      .then((calendar) => {
        setCalendar(calendar);
      })
      .catch((error) => {
        setError(error);
      });
  }

  componentWillMount() {
    if (this.props.calendar === null || this.props.calendar.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      this.fetchUserCalendar(this.props.credentials, this.props.actions.setCalendar, this.props.actions.setError);
    }   

    this.refreshListener = this.props.refreshEventEmitter.addListener(
      "refresh", () => this.fetchUserCalendar(this.props.credentials, this.props.actions.setCalendar, this.props.actions.setError)
    ); 
  }

  componentWillUnmount() {
    this.refreshListener.remove();
  }  
}

const setCalendar = (calendar) => ({
  type: "SET_CALENDAR",
  calendar: calendar
});

const selectEvent = (event, route) => ({
  type: "SELECT_CALENDAR_EVENT",
  event: event,
  route: route
});

const setError = (error) => ({
  type: "SET_CALENDAR_ERROR",
  error: error
});

export default connect(state => ({
  credentials: state.credentials,
  event: state.calendar.event,
  calendar: state.calendar.calendar,
  calendarDataSource: state.calendar.calendarDataSource,
  error: state.calendar.error,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators({setCalendar, selectEvent, setError, removeCredentials}, dispatch)
}))(Calendar);