'use strict';
import React, {
  Component,
  Text,
  View,
  ViewPagerAndroid,
  StyleSheet,
  Dimensions
} from 'react-native';

const moment = require('moment');
const R = require('ramda');

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20
  }
});

const events = [
  {start_time: moment("2016-07-22T08:00:00+0300"),
   end_time: moment("2016-07-22T09:00:00+0300"),
   title: "Jalista suoralla perjantai aamu"},
  {start_time: moment("2016-07-22T18:00:00+0300"),
   end_time: moment("2016-07-22T19:00:00+0300"),
   title: "Jalista suoralla perjantai ilta"},
  {start_time: moment("2016-07-23T18:00:00+0300"),
   end_time: moment("2016-07-23T19:00:00+0300"),
   title: "Jalista suoralla lauantai"},
  {start_time: moment("2016-07-24T18:00:00+0300"),
   end_time: moment("2016-07-24T19:00:00+0300"),
   title: "Jalista suoralla sunnuntai"}
];

function eventsByDay(events) {
  return R.groupBy((event) => Math.floor(event.start_time.unix() / 86400).toString(), events);
}

function eventView(event) {
  return (
    <Text key={event.start_time}>{event.title}</Text>
  );
}

function pageView(events) {
  return (
    <View key={events[0].start_time.dayOfYear().toString()}>
      {R.map(eventView, events)}
    </View>
  );
}

export default class Calendar extends Component {
  render() {
    const viewsByKey = R.sortBy(([key, view]) => parseInt(key),
                                R.toPairs(R.map(pageView, eventsByDay(events))));
    const today = moment("2016-07-23T18:00:00+0300");
    const todayIndex = R.findIndex(([key, view]) => key === Math.floor(today.unix() / 86400).toString(), viewsByKey);
    const views = R.map(([key, view]) => view, viewsByKey);
    return (
      <ViewPagerAndroid style={[styles.viewPager, {width: Dimensions.get('window').width}]}
                        initialPage={todayIndex === -1 ? 0 : todayIndex}>
        {views}
      </ViewPagerAndroid>
    );
  }
}
