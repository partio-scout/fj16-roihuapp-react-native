'use strict';
import React, {
  StyleSheet,
  Platform
} from 'react-native';

const MAIN_COLOR = '#FFFFFF';
const BAR_BACKGROUND_COLOR = '#18A771';
const BORDER_COLOR = '#3EAADF';
const TEXT_COLOR = '#000000';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: MAIN_COLOR,
    paddingTop: Platform.OS === 'ios' ? 18 : 0
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  buttonBar: {
    paddingTop: 5,
    flexDirection: 'row',
    backgroundColor: BAR_BACKGROUND_COLOR
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5
  },
  buttonBarColor: {
    color: MAIN_COLOR
  },
  buttonBarIcon: {
    color: MAIN_COLOR,
    fontSize: 30
  },
  hiddenButtonBarIcon: {
    color: BAR_BACKGROUND_COLOR,
    fontSize: 30
  }  
});

export const navigationStyles = StyleSheet.create({
  backButton: {
    margin: 10
  },
  refreshButton: {
    textAlign: 'right'
  },
  mainTitle: {
    color: MAIN_COLOR, 
    fontSize: 24, 
    textAlign: 'center', 
    marginTop: 7
  },
  backTitle: {
    color: MAIN_COLOR, 
    fontSize: 18, 
    textAlign: 'left', 
    marginTop: 12
  }
});

export const infoStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'},
  tabs: {
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10
  },
  tabText: {
    color: BAR_BACKGROUND_COLOR,
    paddingBottom: 10
  },
  topNavigationBar: {
    flexDirection: 'row', 
    backgroundColor: BAR_BACKGROUND_COLOR, 
    paddingBottom: 10, 
    marginBottom: 10
  }
});

export const categoryStyles = StyleSheet.create({
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR
  },
  listItemTouchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listItemTitle: {
    width: 200
  },
  listItemIcon: {
    textAlign: 'right',
    color: BORDER_COLOR,
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
    color: TEXT_COLOR,
  },
  smallText: {
    fontSize: 10,
    textAlign: 'right'
  },
  coordinate: {
    color: BAR_BACKGROUND_COLOR,
    textAlign: 'right'
  },
  textInputContainer: {
    borderColor: TEXT_COLOR,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 30    
  },
  textInput: {
    padding: 5,
    backgroundColor: MAIN_COLOR, 
  },  
  bold: {
    fontWeight: 'bold'
  }
});
