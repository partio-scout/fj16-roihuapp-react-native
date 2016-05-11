'use strict';
import React, {
  Component,
  Navigator,
  Dimensions,
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { categoryStyles } from '../../styles.js';
import { renderCategories, renderArticles } from '../common/categories.js';

class Locations extends Component {

  renderSelectedArticle(article) {
    return (
      <View style={categoryStyles.article}>
        <Text style={categoryStyles.articleTitle}>
          {article.title}
        </Text>
        <Text>{article.bodytext}</Text>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
    case "article":
      return this.renderSelectedArticle(this.props.article);
    case "articles":
      return renderArticles(navigator, this.props.articlesDataSource, this.props.actions.selectArticle);
    case "categories":
    default:
      return renderCategories(navigator, this.props.categoriesDataSource, this.props.actions.selectCategory);
    }
  }

  render() {
    const { locations, categoriesDataSource, error } = this.props;
    if (locations !== null) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator initialRouteStack={this.props.routeStack}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    } else if (error !== null) {
      return (
        <Text>{error}</Text>
      );
    } else {
      return (
        <Text></Text>
      );
    }
  }

  fetchLocations() {
    console.log("Fetching locations");
    fetch(config.apiUrl + "/LocationCategories/Translations?lang=FI")
      .then((response) => response.json())
      .then((locations) => {
        this.props.actions.setLocations(locations);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  onBack() {
    if (this._navigator) {
      this._navigator.pop();
      this.props.actions.popNavigationRoute();
    }
  }

  componentDidMount() {
    if (this.props.locations === null) {
      this.fetchLocations();
    }
    this.refreshListener = this.props.emitter.addListener("refresh", () => this.fetchLocations());
    this.backListener = this.props.emitter.addListener("back", () => this.onBack());
  }

  componentWillUnmount() {
    this.refreshListener.remove();
    this.backListener.remove();
  }
}

const actions = {
  setLocations: (locations) => ({
    type: "SET_LOCATIONS",
    locations: locations
  }),
  setError: (error) => ({
    type: "SET_LOCATIONS_ERROR",
    error: error
  }),
  selectCategory: (category, route) => ({
    type: "SELECT_LOCATIONS_CATEGORY",
    category: category,
    route: route
  }),
  selectArticle: (article, route) => ({
    type: "SELECT_LOCATIONS_ARTICLE",
    article: article,
    route: route
  }),
  popNavigationRoute: () => ({
    type: "POP_LOCATIONS_ROUTE"
  })
};

export const locations = (
  state = {locations: null,
           error: null,
           categoriesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           articlesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           article: {},
           routeStack: [{name: "categories"}]},
  action) => {
    switch (action.type) {
    case "SET_LOCATIONS_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SET_LOCATIONS":
      return Object.assign({}, state, {locations: action.locations,
                                       categoriesDataSource: state.categoriesDataSource.cloneWithRows(action.locations.categories)});
    case "SELECT_LOCATIONS_CATEGORY":
      return Object.assign({}, state, {articlesDataSource: state.articlesDataSource.cloneWithRows(action.category.articles),
                                       routeStack: state.routeStack.concat(action.route)});
    case "SELECT_LOCATIONS_ARTICLE":
      return Object.assign({},
                           state,
                           {article: action.article,
                            routeStack: state.routeStack.concat(action.route)});
    case "POP_LOCATIONS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    }
    return state;
  };

export default connect(state => ({
  locations: state.locations.locations,
  categoriesDataSource: state.locations.categoriesDataSource,
  articlesDataSource: state.locations.articlesDataSource,
  article: state.locations.article,
  error: state.locations.error,
  routeStack: state.locations.routeStack
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Locations);
