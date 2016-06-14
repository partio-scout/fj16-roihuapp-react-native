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
import { removeCredentials } from '../login/actions';
import { isEmpty, renderRefreshButton } from '../../utils';
import { infoStyles } from '../../styles';

import moment from 'moment';
import R from 'ramda';

const EventEmitter = require('EventEmitter');

const styles = StyleSheet.create({
  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20
  }
});

class Calendar extends Component {

  constructor(props) {
    super(props);
  }  

  render() {
    return (
      <View style={[infoStyles.container, {width: Dimensions.get("window").width}]}>
        <Text>Kalenteri</Text>
        {/*<View style={infoStyles.topNavigationBar}>
          {renderRefreshButton(() => this.refreshEventEmitter.emit("refresh"))}
        </View>*/}
      </View>
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
    this.refreshListener = this.props.refreshEventEmitter.addListener("refresh",
                                                                      () => this.fetchUserInfo(this.props.credentials)); 
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
  error: state.calendar.error,
  lang: state.language.lang,
}), (dispatch) => ({
  actions: bindActionCreators({setCalendar,
                               setError,
                               removeCredentials}, dispatch)
}))(Calendar);