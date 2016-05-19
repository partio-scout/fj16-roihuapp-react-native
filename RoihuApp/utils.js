'use strict';
import React, {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { navigationStyles } from './styles.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

export function renderBackButton(routeStack, popRoute) {
  if (routeStack.length === 1) {
    return null;
  } else {
    return (
      <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}
                        onPress={() => popRoute()}>
        <Icon name="arrow-back" size={30} color="#000000"/>
      </TouchableOpacity>
    );
  }
}

export function renderRefreshButton(onRefresh) {
  return (
    <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                      onPress={() => onRefresh()}>
      <Icon style={{textAlign: 'right'}} name="refresh" size={30} color="#000000"/>
    </TouchableOpacity>
  );
}

export function last(arr) {
  if (arr.length === 0) {
    return null;
  }
  return arr[arr.length - 1];
}
