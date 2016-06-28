'use strict';
import React, {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ListView,
  Navigator,
  Alert,
  Platform
} from 'react-native';
import moment from 'moment';
import { t } from '../../translations.js';
import { config } from '../../config.js';
import { categoryStyles, styles } from '../../styles.js';
import { renderProgressBar } from '../../utils.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

export function renderRightArrow() {
  return (
    <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
      <View style={{flex: 1, flexDirection: 'row'}}></View>
      <Icon style={categoryStyles.listItemIcon} name="keyboard-arrow-right" />
    </View>
  );
}

function renderCategory(category, navigator, selectCategory, setCurrentTitle, rowID) {
  return (
    <View key={"category-" + rowID} style={categoryStyles.listItem}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          const route = {name: "articles"};
          setCurrentTitle(category.title);
          selectCategory(category, route);
          navigator.push(route);
        }}>
        <Text style={categoryStyles.textColor}>{category.title.slice(0,35).toUpperCase()}{category.title.length > 35 ? '...' : ''}</Text>
        {renderRightArrow()}
      </TouchableOpacity>
    </View>
  );
}

export function renderCategories(navigator, categoriesDataSource, selectCategory, setCurrentTitle) {
  return (
    <View style={categoryStyles.list}>

      <ListView dataSource={categoriesDataSource}
                renderRow={(category, sectionID, rowID) => renderCategory(category, navigator, selectCategory, setCurrentTitle, rowID) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}

function renderArticle(article, navigator, selectArticle, rowID) {
  return (
    <View key={"article-" + rowID} style={categoryStyles.listItem}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          const route = {name: "article"};
          selectArticle(article, route);
          navigator.push(route);
        }}>
        <Text style={[categoryStyles.textColor, categoryStyles.listItemTitle]}>{article.title}</Text>
        <Text style={categoryStyles.coordinate}>{article.grid_latitude}{article.grid_longitude}</Text>
        {renderRightArrow()}
      </TouchableOpacity>
    </View>
  );
}

export function renderArticles(navigator, articlesDataSource, selectArticle) {
  return (
    <View style={categoryStyles.list}>
      <ListView dataSource={articlesDataSource}
                renderRow={(article, sectionID, rowID) => renderArticle(article, navigator, selectArticle, rowID) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}

function renderSearchInput(lang) {
  return null;
  /*if (Platform.OS === 'ios')
    return null;

  return (
    <View style={styles.textInputContainer}>
      <TextInput style={styles.textInput}
                 placeholder={t("Hae", lang)} />
    </View>);*/
}

export function renderRoot(fetchState, data, noDataText, lang, routeStack, renderScene, onWillFocus) {
  switch (fetchState) {
  case "STARTED":
    return renderProgressBar();
  case "ERROR":
    if (data === null) {
      return (<Text>{noDataText}</Text>);
    }
  case "COMPLETED":
  default:
    if (data === null) {
      return renderProgressBar();
    }
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10}]}>
          {t("Tilanne", lang)} {moment(data.timestamp).format(t("Timestamp", lang))}
        </Text>
        {routeStack.length == 1 ? renderSearchInput(lang) : (<View />)}
        <Navigator initialRouteStack={routeStack}
                   onWillFocus={onWillFocus}
                   renderScene={(route, navigator) => renderScene(route, navigator)}/>
      </View>
    );
  }
}

export function shouldFetch(data, lang) {
  if (data === null) {
      return true
  }

  if (data.language.toUpperCase() !== lang.toUpperCase()) {
      return true
  }

  if (moment().isAfter(data.next_check)) {
    return true;
  }

  return false; 
}

export function fetchData(logStart, setFetchStatus, apiPath, queryParams, setData, lang, failedToFetchMessage) {
  console.log(logStart);
  const params = Object.assign({lang: lang.toUpperCase()}, queryParams);
  const queryParamString = Object.keys(params).map((k) => k + "=" + params[k]).join("&");
  setFetchStatus("STARTED");
  fetch(config.apiUrl + apiPath + "?" + queryParamString)
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      setFetchStatus("COMPLETED");
    })
    .catch((error) => {
      setFetchStatus("ERROR");
      console.log(error);
      Alert.alert("Virhe nettiyhteydessä",
                  failedToFetchMessage,
                  [{text: "Ok", onPress: () => {}}]);
    });
}
