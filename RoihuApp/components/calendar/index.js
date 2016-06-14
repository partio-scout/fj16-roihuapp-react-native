'use strict';
import React, {
  Component,
  Text,
  View,
  ViewPagerAndroid,
  StyleSheet,
  Dimensions,
  ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config';

import moment from 'moment';
import R from 'ramda';

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20
  }
});

/*const saturday = R.map((hour) => ({start_time: moment("2016-07-23T00:00:00+0300").add(hour, 'hours'),
                                   end_time: moment("2016-07-23T01:00:00+0300").add(hour, 'hours'),
                                   title: "Jalista suoralla lauantai " + hour,
                                   id: 30 + hour}),
                       R.range(1, 23));

const events = R.unnest([{start_time: moment("2016-07-22T08:00:00+0300"),
                          end_time: moment("2016-07-22T09:00:00+0300"),
                          title: "Jalista suoralla perjantai aamu",
                          id: 1},
                         {start_time: moment("2016-07-22T18:00:00+0300"),
                          end_time: moment("2016-07-22T19:00:00+0300"),
                          title: "Jalista suoralla perjantai ilta",
                          id: 2},
                         saturday,
                         {start_time: moment("2016-07-24T18:00:00+0300"),
                          end_time: moment("2016-07-24T19:00:00+0300"),
                          title: "Jalista suoralla sunnuntai",
                          id: 4}]);*/

/*class Day extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: ds.cloneWithRows(props.events)
    };
  }

  renderRow(event) {
    return (
      <View>
        <Text>{event.title}</Text>
        <Text>{event.start_time.format()}</Text>
      </View>
    );
  }

  render() {
    return (
      <ListView dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                style={{width: Dimensions.get('window').width}}/>
    );
  }
}

function pageView(events) {
  return (
    <View key={events[0].start_time.dayOfYear().toString()}
          style={styles.pageStyle}>
      <Day events={R.sortBy((event) => event.start_time, events)}/>
    </View>
  );
}

const partitionKey = (timestamp) => timestamp.format("YYYY.MM.DD");

function eventsByDay(events) {
  return R.groupBy((event) => partitionKey(event.start_time), events);
}*/

class Calendar extends Component {
  render() {
    /*const viewsByKey = R.sortBy(([key, view]) => parseInt(key),
                                R.toPairs(R.map(pageView, eventsByDay(events))));
    const today = moment("2016-07-23T18:00:00+0300");
    const todayIndex = R.findIndex(([key, view]) => key === partitionKey(today), viewsByKey);
    const views = R.map(([key, view]) => view, viewsByKey);*/
    return (
      <View>
        <Text>Mortonki</Text>
      </View>
      /*<ViewPagerAndroid style={[styles.viewPager, {width: Dimensions.get('window').width}]}
                        initialPage={todayIndex === -1 ? 0 : todayIndex}>
        {views}
      </ViewPagerAndroid>*/
    );
  }

  fetchUserCalendar(credentials) {
    console.log("Fetching user calendar");
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "/calendar?access_token=" + credentials.token)
      .then((response) => response.json())
      .then((calendar) => {
        this.props.actions.setCalendar(calendar);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  componentDidMount() {
    const { credentials, data } = this.props;
    if (isEmpty(data)) {
      this.fetchUserCalendar(credentials);
    }
  }

  componentWillMount() {
    this.refreshListener = this.props.refreshEventEmitter.addListener (
      "refresh", () => this.fetchUserCalendar(this.props.credentials)
    );
  }

  componentWillUnmount() {
    this.refreshListener.remove();
  }  
}

const setCalendar = (data) => ({
  type: "SET_CALENDAR",
  details: details
});

const setError = (error) => ({
  type: "SET_CALENDAR_ERROR",
  error: error
});

export default connect(state => ({
  credentials: state.credentials,
  data: state.calendar.data,
  error: state.calendar.error,
  lang: state.language.lang,
}), (dispatch) => ({
  actions: bindActionCreators({setCalendar,
                               setError,
                               removeCredentials}, dispatch)
}))(Calendar);