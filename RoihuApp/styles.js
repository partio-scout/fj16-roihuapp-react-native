'use strict';
import React, {
  StyleSheet,
  Platform
} from 'react-native';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: Platform.OS === 'ios' ? 10: 0
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

export const categoryStyles = StyleSheet.create({
  listItem: {
    padding: 10
  },
  section: {
    flex: 1,
    flexDirection: 'column'
  },
  article: {
    padding: 10
  },
  articleTitle: {
    textAlign: 'left',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20
  }
});
