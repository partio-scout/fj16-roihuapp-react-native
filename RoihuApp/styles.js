'use strict';
import React, {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

const WHITE = '#FFFFFF';
export const MAIN_COLOR = WHITE;
const GREEN = '#18A771';
export const BAR_BACKGROUND_COLOR = GREEN;
const BORDER_COLOR = '#3EAADF';
const TEXT_COLOR = '#000000';

const baseTextInputContainer =  {
    borderColor: TEXT_COLOR,
    borderWidth: 1
};

const baseButton = {
  alignItems: 'center',
  backgroundColor: BAR_BACKGROUND_COLOR,
  alignSelf: 'stretch',
  height: 40,
  justifyContent: 'center'
};

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
    alignItems: 'center'
  },
  basicButton: {
    ...baseButton,
    marginTop: 10,
    marginBottom: 10
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
  },
  textInput: {
    height: 36,
    padding: 5,
    backgroundColor: MAIN_COLOR
  }
});

export const navigationStyles = StyleSheet.create({
  backButton: {
    margin: 10
  },
  refreshButton: {
    textAlign: 'right'
  },
  mapButton: {
    flex: 1,
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
    height: 50,
    paddingBottom: 10,
    marginBottom: 10
  }
});

export const categoryStyles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  listItemTouchArea: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    flexDirection: 'column'
  },
  article: {
    flex: 1
  },
  articleContentContainer: {
    padding: 10,
    flex: 1
  },
  articleTitleContainer: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR
  },
  articleTitle: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  textColor: {
    color: TEXT_COLOR
  },
  smallText: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 10
  },
  coordinate: {
    color: BAR_BACKGROUND_COLOR,
    textAlign: 'right'
  },
  locationText: {
    paddingBottom: 10
  },
  textInputContainer: {
    ...baseTextInputContainer,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 30
  },
  bold: {
    fontWeight: 'bold'
  }
});

export const achievementStyles = StyleSheet.create({
  wideButtonContainer: {
    height: 50,
    marginTop: 20,
    backgroundColor: BAR_BACKGROUND_COLOR,
    alignItems: 'center',
    flex: 1,
    borderRadius: 5
  },
  wideButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  doneIcon: {
    fontSize: 60,
    color: BAR_BACKGROUND_COLOR
  },
  doneContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10
  },
  selectedAchievementTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center'
  },
  titleSeparator: {
    height: 2,
    backgroundColor: BORDER_COLOR,
    marginTop: 6,
    marginBottom: 6
  },
  bodyText: {
    marginLeft: 10,
    marginRight: 10
  },
  listItemDoneIconContainer: {
    width: 26
  },
  listItemDoneIcon: {
    fontSize: 22,
    marginRight: 10
  }
});

export const userStyles = StyleSheet.create({
  userUpperAreaContainer: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  userContentContainer: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width
  },
  nameImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  key: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
    paddingBottom: 5
  },
  value: {
    flex: 3,
    paddingBottom: 5,
    marginRight: 10
  },
  name: {
    textAlign: 'center'
  },
  nickname: {
    marginTop: 10,
    fontSize: 28,
    textAlign: 'center'
  },
  userNameArea: {
    flex: 3,
    alignSelf: 'flex-end',
    marginBottom: 7,
    marginLeft: 10
  },
  userImageArea: {
    flex: 1,
    borderColor: BAR_BACKGROUND_COLOR,
    borderWidth: 3,
    margin: 10
  }
});

export const calendarStyles = StyleSheet.create({
  eventDetailContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventDetailTitle: {
    flex:1.5,
    textAlign: 'right'
  },
  eventDetailContent: {
    flex:2.5,
    marginLeft: 5
  },
  dateSelectionIcon: {
    color: WHITE,
    backgroundColor: '#FFFFFF00',
    fontSize: 30
  },
  dateSelectionIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: GREEN,
    padding: 8,
    margin: 5
  },
  todayButton: {
    color: GREEN
  }
});

export const modalStyles = StyleSheet.create({
  header: {
    color: TEXT_COLOR,
    paddingBottom: 10
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Dimensions.get("window").height
  },
  innerContainer: {
    backgroundColor: '#dedede',
    margin: 10,
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.4
  }
});

export const authStyles = StyleSheet.create({
  bigButton: {
    ...baseButton,
	marginTop: 50,
	marginBottom: 5
  },
  sendEmailButton: {
    ...baseButton,
    marginTop: 10,
    marginBottom: 5
  },
  textInputContainer: {
    ...baseTextInputContainer,
    margin: 20
  },
});
