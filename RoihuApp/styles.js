'use strict';
import React, {
  StyleSheet,
  Platform
} from 'react-native';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 18 : 0
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  buttonBar: {
    paddingTop: 5,
    flexDirection: 'row',
    backgroundColor: '#18A771'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5
  },
  buttonBarColor: {
    color: '#FFFFFF'
  },
  buttonBarIcon: {
    color: '#FFFFFF',
    fontSize: 30
  },
  hiddenButtonBarIcon: {
    color: '#18A771',
    fontSize: 30
  }  
});

export const navigationStyles = StyleSheet.create({
  backButton: {
    margin: 10
  },
  refreshButton: {
    textAlign: 'right'
  }
});

export const categoryStyles = StyleSheet.create({
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3EAADF'
  },
  listItemTouchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItemIcon: {
    textAlign: 'right',
    color: '#3EAADF',
    fontSize: 22
  },
  list: {
    flex: 1,
    flexDirection: 'column',
  },
  article: {
    padding: 10,
    flex: 1
  },
  articleTitle: {
    textAlign: 'left',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20
  },
  textColor: {
    color: '#000000',
  }
});
