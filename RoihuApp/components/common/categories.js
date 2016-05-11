'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ListView
} from 'react-native';
import { categoryStyles } from '../../styles.js';

function renderCategory(category, navigator, selectCategory) {
  return (
    <View key={"category-" + category.id} style={categoryStyles.listItem}>
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
      <ListView key={"categories"}
                dataSource={categoriesDataSource}
                renderRow={(category) => renderCategory(category, navigator, selectCategory) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}

function renderArticle(article, navigator, selectArticle) {
  return (
    <View key={"article-" + article.id} style={categoryStyles.listItem}>
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
      <ListView key={"articles"}
                dataSource={articlesDataSource}
                renderRow={(article) => renderArticle(article, navigator, selectArticle) }
        style={{width: Dimensions.get("window").width}}/>
    </View>
  );
}
