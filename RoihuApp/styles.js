'use strict';
import React, {
  StyleSheet
} from 'react-native';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  buttonBar: {
    flexDirection: 'row',
    backgroundColor: '#F5FCFF'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5
  }
});

export const navigationStyles = StyleSheet.create({
  backButton: {margin: 10}
});
