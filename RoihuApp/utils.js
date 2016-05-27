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
