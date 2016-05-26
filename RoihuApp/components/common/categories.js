'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ListView,
  Navigator,
  Alert
} from 'react-native';
import moment from 'moment';
import { t } from '../../translations.js';
import { config } from '../../config.js';
import { categoryStyles } from '../../styles.js';
import { renderProgressBar } from '../../utils.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

function renderCategory(category, navigator, selectCategory, rowID) {
  return (
    <View key={"category-" + rowID} style={categoryStyles.listItem}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          const route = {name: "articles"};
          selectCategory(category, route);
          navigator.push(route);
        }}>
        <Text style={categoryStyles.textColor}>{category.title.slice(0,35).toUpperCase()}{category.title.length > 35 ? '...' : ''}</Text>
        <Icon style={categoryStyles.listItemIcon} name="keyboard-arrow-right" />
      </TouchableOpacity>
    </View>
  );
}

export function renderCategories(navigator, categoriesDataSource, selectCategory) {
  return (
    <View style={categoryStyles.list}>

      <ListView dataSource={categoriesDataSource}
                renderRow={(category, sectionID, rowID) => renderCategory(category, navigator, selectCategory, rowID) }
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
        <Text style={categoryStyles.textColor}>{article.title}</Text>
        <Text style={categoryStyles.coordinate}>{article.grid_latitude}{article.grid_longitude}</Text>
        <Icon style={categoryStyles.listItemIcon} name="keyboard-arrow-right" />
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

export function renderRoot(fetchState, data, noDataText, lang, routeStack, renderScene) {
  switch (fetchState) {
  case "STARTED":
  case "NOT_STARTED":
    return renderProgressBar();
  case "ERROR":
    if (data === null) {
      return (<Text>{noDataText}</Text>);
    }
  case "COMPLETED":
  default:
    return (
      <View style={{flex: 1, width: Dimensions.get("window").width}}>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10}]}>
          {t("Tilanne", lang)} {moment(data.timestamp).format(t("Timestamp", lang))}
        </Text>
        <Navigator initialRouteStack={routeStack}
                   renderScene={(route, navigator) => renderScene(route, navigator)}/>
      </View>
    );
  }
}

export function fetchData(logStart, setFetchStatus, apiPath, setData, lang, failedToFetchMessage) {
  console.log(logStart);
  setFetchStatus("STARTED");
  fetch(config.apiUrl + apiPath + "?lang=" + lang.toUpperCase())
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
