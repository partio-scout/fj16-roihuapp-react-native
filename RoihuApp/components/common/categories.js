'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ListView
} from 'react-native';
import { categoryStyles } from '../../styles.js';
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
