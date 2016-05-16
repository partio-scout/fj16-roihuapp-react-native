'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ListView
} from 'react-native';
import { categoryStyles } from '../../styles.js';

function renderCategory(category, navigator, selectCategory, rowID) {
  return (
    <View key={"category-" + rowID} style={categoryStyles.listItem}>
      <TouchableOpacity onPress={() => {
          const route = {name: "articles"};
          selectCategory(category, route);
          navigator.push(route);
        }}>
        <Text>{category.title}</Text>
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
      <TouchableOpacity onPress={() => {
          const route = {name: "article"};
          selectArticle(article, route);
          navigator.push(route);
        }}>
        <Text>{article.title}</Text>
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
