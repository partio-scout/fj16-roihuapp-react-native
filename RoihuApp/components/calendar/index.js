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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config';
import { removeCredentials } from '../login/actions';
import { isEmpty, renderRefreshButton } from '../../utils';
import { infoStyles, categoryStyles } from '../../styles';

class Calendar extends Component {

  constructor(props) {
    super(props);
  }  

  renderCalendarEvent(event, navigator, rowID) {
    return (
      <View key={"calendar-" + rowID} style={categoryStyles.listItem}>
        <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
            const route = {name: "event"};
            navigator.push(route);
          }}>
          <Text style={categoryStyles.textColor}>{event.name.slice(0,35).toUpperCase()}{event.name.length > 35 ? '...' : ''}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderCalendar(navigator, calendarDataSource) {
    return (
      <View style={categoryStyles.list}>
        <ListView dataSource={calendarDataSource}
                  renderRow={(event, sectionID, rowID) => this.renderCalendarEvent(event, navigator, rowID) }
          style={{width: Dimensions.get("window").width}}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
    case "user-root":
    default:
      return this.renderCalendar(navigator, this.props.calendarDataSource);
    }
  }

  render() {
    const { calendar, error } = this.props;
    if (!isEmpty(calendar)) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
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
        console.log('KALENTERI');
        console.log(calendar);
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

const setError = (error) => ({
  type: "SET_CALENDAR_ERROR",
  error: error
});

export default connect(state => ({
  credentials: state.credentials,
  calendar: state.calendar.calendar,
  calendarDataSource: state.calendar.calendarDataSource,
  error: state.calendar.error,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators({setCalendar, setError, removeCredentials}, dispatch)
}))(Calendar);