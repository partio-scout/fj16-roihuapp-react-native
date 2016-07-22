'use strict';
import React, {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ListView,
  Navigator,
  Alert
} from 'react-native';
import moment from 'moment';
import { t } from '../../translations.js';
import { config } from '../../config.js';
import { categoryStyles, styles } from '../../styles.js';
import { renderProgressBar } from '../../utils.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

const DEFAULT_TTL = 60 * 60 * 24;

export function renderRightArrow(itemBeforeArrow) {
  return (
    <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
      <View style={{flex: 1, flexDirection: 'row'}}></View>
      {itemBeforeArrow ? itemBeforeArrow : null}
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
                key={"categories"}
                renderRow={(category, sectionID, rowID) => renderCategory(category, navigator, selectCategory, setCurrentTitle, rowID) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}

function renderArticle(article, navigator, selectArticle, searchText, setCurrentTitle, rowID) {
  return (
    <View key={"article-" + rowID} style={categoryStyles.listItem}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          if (searchText.trim().length > 0) {
            setCurrentTitle(null);
          }
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

export function renderArticles(navigator, articlesDataSource, selectArticle, searchText, setCurrentTitle) {
  return (
    <View style={categoryStyles.list}>
      <ListView dataSource={articlesDataSource}
                enableEmptySections={true}
                key={"articles"}
                renderRow={(article, sectionID, rowID) => renderArticle(article, navigator, selectArticle, searchText, setCurrentTitle, rowID) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}

function filterArticles(searchText, data, setSearchData) {
  const text = searchText.trim().toLowerCase();
  const articles = [];
  data.categories.forEach(function (category) {
    category.articles.forEach(function (article) {
      if (article.title.toLowerCase().includes(text) || article.bodytext.toLowerCase().includes(text)) {
        articles.push(article);
      }
    });
  });
  setSearchData(articles, searchText);
}

function renderSearchInput(lang, data, searchText, setSearchData) {
  return (
    <View style={categoryStyles.textInputContainer}>
      <TextInput style={styles.textInput}
                 value={searchText}
                 onChangeText={
                    (text) => filterArticles(text, data, setSearchData)
                 }
                 placeholder={t("Hae", lang)} />
    </View>);
}

export function renderRoot(fetchState, data, noDataText, lang, routeStack, renderScene, onWillFocus, searchText, setSearchData) {
  switch (fetchState.state) {
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
          {t("Tilanne", lang)} {moment(fetchState.lastSuccesfullTs * 1000).format(t("Timestamp", lang))}
        </Text>
        {routeStack.length == 1 ? renderSearchInput(lang, data, searchText, setSearchData) : (<View />)}
        <Navigator initialRouteStack={routeStack}
                   onWillFocus={onWillFocus}
                   renderScene={(route, navigator) => renderScene(route, navigator)}/>
      </View>
    );
  }
}

export function shouldFetch(data, lang, lastTs) {
  if (data === null) {
      return true;
  }

  if (data.language.toUpperCase() !== lang.toUpperCase()) {
      return true;
  }

  const ttl = data ? (data.ttl ? data.ttl : DEFAULT_TTL) : DEFAULT_TTL;
  if (moment().isAfter(moment(lastTs * 1000).add(ttl, 'seconds'))) {
    console.log("Time for next check");
    return true;
  }

  return false;
}

export function fetchData(logStart, setFetchStatus, apiPath, queryParams, setData, lang, failedToFetchMessage, etag, setEtag, reLogin) {
  console.log(logStart);
  const fetchParams = Object.assign({method: "GET"}, {headers: etag ? {'If-None-Match': etag} : {}});
  const params = Object.assign({lang: lang.toUpperCase()}, queryParams);
  const queryParamString = Object.keys(params).map((k) => k + "=" + params[k]).join("&");
  setFetchStatus("STARTED");
  fetch(config.apiUrl + apiPath + "?" + queryParamString, fetchParams)
    .then((response) => {
      setEtag(response.headers.get("Etag"));
      switch (response.status) {
      case 401:
        Alert.alert(t("Kirjautuminen vanhentunut", lang),
                    t("Kirjaudu nähdäksesi päivitetyt tiedot", lang),
                    [{text: t("Ok", lang),
                      onPress: () => reLogin()}]);
        return Promise.reject("Unauthorized");
      case 304:
        console.log("cache valid");
        return Promise.resolve({cached: true});
      case 200:
        console.log("cache invalid");
      default:
        return response.json();
      }
    })
    .then((data) => {
      if (!data.cached) {
        setData(data);
      }
      setFetchStatus("COMPLETED");
    })
    .catch((error) => {
      setFetchStatus("ERROR");
      console.log(error);
      if (error !== "Unauthorized") {
        Alert.alert(t("Virhe nettiyhteydessä", lang),
                    failedToFetchMessage,
                    [{text: "Ok", onPress: () => {}}]);
      }
    });
}

export function findById(data, id) {
  return data.find((x) => x.id === id);
}
