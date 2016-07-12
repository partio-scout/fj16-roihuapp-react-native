'use strict';
import React, {
  Text,
  View,
  TouchableOpacity,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  Platform
} from 'react-native';
import { navigationStyles, styles } from './styles.js';
import moment from 'moment';
const Icon = require('react-native-vector-icons/MaterialIcons');

export function renderBackButton(routeStack, popRoute) {
  if (routeStack.length === 1) {
    return (
      <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}>
        <Icon style={styles.hiddenButtonBarIcon} name="keyboard-arrow-left" />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}
                        onPress={() => popRoute()}>
        <Icon style={styles.buttonBarIcon} name="keyboard-arrow-left" />
      </TouchableOpacity>
    );
  }
}

export function renderRefreshButton(onRefresh) {
  return (
    <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                      onPress={() => onRefresh()}>
      <Icon style={[navigationStyles.refreshButton, styles.buttonBarIcon]} name="refresh" />
    </TouchableOpacity>
  );
}

export function last(arr) {
  if (arr.length === 0) {
    return null;
  }
  return arr[arr.length - 1];
}

export function renderProgressBar() {
  if (Platform.OS === 'ios') {
    return (
      <ActivityIndicatorIOS size={'large'}/>
    );
  } else {
    return (
      <ProgressBarAndroid indeterminate={true}/>
    );
  }
}

export function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

export function sortNumber(a, b) {
  return (a < b) ? -1 : ((a == b) ? 0 : 1);
}

export function sortByDateWithFormat(format, a , b) {
  return (moment(a, format).isBefore(moment(b, format))) ?
    -1 :
    ((moment(a, format).isSame(moment(b, format))) ? 0 : 1);
}

export function sortByDate(a, b) {
  return sortByDateWithFormat(moment.ISO_8601, a, b);
}

export function popWhenRouteNotLastInStack(route, routeStack, popRoute) {
  const lastRoute = last(routeStack);
  if (lastRoute && lastRoute.name !== route.name){
    popRoute();
  }
}
