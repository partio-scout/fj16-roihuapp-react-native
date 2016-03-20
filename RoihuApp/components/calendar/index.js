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

const saturday = R.map((hour) => ({start_time: moment("2016-07-23T00:00:00+0300").add(hour, 'hours'),
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
                          id: 4}]);

class Day extends Component {
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
}

export default class Calendar extends Component {
  render() {
    const viewsByKey = R.sortBy(([key, view]) => parseInt(key),
                                R.toPairs(R.map(pageView, eventsByDay(events))));
    const today = moment("2016-07-23T18:00:00+0300");
    const todayIndex = R.findIndex(([key, view]) => key === partitionKey(today), viewsByKey);
    const views = R.map(([key, view]) => view, viewsByKey);
    return (
      <ViewPagerAndroid style={[styles.viewPager, {width: Dimensions.get('window').width}]}
                        initialPage={todayIndex === -1 ? 0 : todayIndex}>
        {views}
      </ViewPagerAndroid>
    );
  }
}
