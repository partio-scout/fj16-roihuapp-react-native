'use strict';
import React, {
  Component,
  Navigator,
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ListView,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { t } from '../../translations.js';
import { categoryStyles } from '../../styles.js';
import { renderCategories, renderArticles, renderRoot, fetchData } from '../common/categories.js';

class Locations extends Component {

  renderSelectedArticle(article) {
    return (
      <View style={categoryStyles.article}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
          {article.title}
        </Text>
        <ScrollView style={{flex: 1}}>
          <Text style={categoryStyles.textColor}>{article.bodytext}</Text>
        </ScrollView>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>
          {t("Viimeksi muokattu", this.props.lang)} {moment(article.last_modified).format('DD.MM. h:mm')}
        </Text>
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
    return renderRoot(this.props.fetch.state,
                      this.props.locations,
                      "Ei voitu hakea paikkoja",
                      this.props.lang,
                      this.props.routeStack,
                      this.renderScene.bind(this));
  }

  onBack() {
    if (this._navigator) {
      this._navigator.pop();
      this.props.actions.popNavigationRoute();
    }
  }

  componentDidMount() {
    if (this.props.locations === null || this.props.locations.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      fetchData("Fetching locations",
                this.props.actions.setFetchStatus,
                "/LocationCategories/Translations",
                this.props.actions.setLocations,
                this.props.lang,
                "Paikkojen haku epäonnistui");
    }
    this.refreshListener = this.props.emitter.addListener("refresh", () => fetchData("Fetching locations",
                                                                                     this.props.actions.setFetchStatus,
                                                                                     "/LocationCategories/Translations",
                                                                                     this.props.actions.setLocations,
                                                                                     this.props.lang,
                                                                                     "Paikkojen haku epäonnistui"));
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
  }),
  setFetchStatus: (state) => ({
    type: "LOCATIONS_FETCH_STATE",
    state: state
  })
};

export const locations = (
  state = {locations: null,
           categoriesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           articlesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           article: {},
           routeStack: [{name: "categories"}],
           fetch: {state: "NOT_STARTED"}},
  action) => {
    switch (action.type) {
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
    case "LOCATIONS_FETCH_STATE":
      return Object.assign({}, state, {fetch: {state: action.state}});
    }
    return state;
  };

export default connect(state => ({
  locations: state.locations.locations,
  categoriesDataSource: state.locations.categoriesDataSource,
  articlesDataSource: state.locations.articlesDataSource,
  article: state.locations.article,
  routeStack: state.locations.routeStack,
  lang: state.language.lang,
  fetch: state.locations.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Locations);
