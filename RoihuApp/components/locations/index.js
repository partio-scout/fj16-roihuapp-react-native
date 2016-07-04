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
import { renderCategories, renderArticles, renderRoot, shouldFetch, fetchData, findById } from '../common/categories.js';
import { popWhenRouteNotLastInStack, last } from '../../utils.js';

class Locations extends Component {

  renderSelectedArticle(article) {
    return (
      <View style={categoryStyles.article}>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {article.title}
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <Text style={[categoryStyles.textColor, categoryStyles.locationText]}>
            <Text style={categoryStyles.bold}>{t("Sijainti", this.props.lang)} </Text>
            <Text>{article.grid_latitude}{article.grid_longitude}</Text>
          </Text>
          <ScrollView style={{flex: 1}}>
            <Text style={categoryStyles.textColor}>{article.bodytext}</Text>
          </ScrollView>
          <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>
            {t("Viimeksi muokattu", this.props.lang)} {moment(article.last_modified).format(t("Timestamp", this.props.lang))}
          </Text>
        </View>
      </View>
    );
  }

  renderScene(route, navigator) {
    this._navigator = navigator;
    switch(route.name) {
    case "article":
      return this.renderSelectedArticle(this.props.selectedArticle);
    case "articles":
      return renderArticles(navigator,
                            this.props.articlesDataSource,
                            this.props.actions.selectArticle,
                            this.props.searchText,
                            this.props.actions.setCurrentTitle);
    case "categories":
    default:
      if (this.props.searchText.trim().length > 0) {
        return renderArticles(navigator,
                              this.props.searchDataSource,
                              this.props.actions.selectArticle,
                              this.props.searchText,
                              this.props.actions.setCurrentTitle);
      }
      return renderCategories(navigator,
                              this.props.categoriesDataSource,
                              this.props.actions.selectCategory,
                              this.props.actions.setCurrentTitle);
    }
  }

  render() {
    return renderRoot(this.props.fetch,
                      this.props.locations,
                      t("Ei voitu hakea paikkoja", this.props.lang),
                      this.props.lang,
                      this.props.routeStack,
                      this.renderScene.bind(this),
                      (route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popNavigationRoute),
                      this.props.searchText,
                      this.props.actions.setSearchData);
  }

  onBack() {
    if (this._navigator) {
      this.props.actions.popNavigationRoute();
      this._navigator.pop();
    }
  }

  componentWillMount() {
    if (shouldFetch(this.props.locations, this.props.lang, this.props.fetch.lastTs)) {
      fetchData(
        "Fetching locations",
        this.props.actions.setFetchStatus,
        "/LocationCategories/Translations",
        {},
        this.props.actions.setLocations,
        this.props.lang,
        t("Paikkojen haku epäonnistui", this.props.lang),
        this.props.fetch.etag,
        this.props.actions.setEtag
      );
    }

    this.refreshListener = this.props.emitter.addListener("refresh", () => fetchData("Fetching locations",
                                                                                     this.props.actions.setFetchStatus,
                                                                                     "/LocationCategories/Translations",
                                                                                     {},
                                                                                     this.props.actions.setLocations,
                                                                                     this.props.lang,
                                                                                     t("Paikkojen haku epäonnistui", this.props.lang),
                                                                                     this.props.fetch.etag,
                                                                                     this.props.actions.setEtag));
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
  }),
  setCurrentTitle: (title) => ({
    type: "SET_LOCATIONS_CURRENT_TITLE",
    currentTitle: title
  }),
  setSearchData: (data, text) => ({
    type: "SET_LOCATIONS_SEARCH_DATA",
    data: data,
    text: text
  }),
  setEtag: (etag) => ({
    type: "SET_LOCATIONS_ETAG",
    etag: etag
  })
};

const titleComparator = (a, b) => a.title.localeCompare(b.title);

export const locations = (
  state = {locations: null,
           categoriesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           articlesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           searchDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           selectedCategory: null,
           selectedArticle: null,
           routeStack: [{name: "categories"}],
           currentTitle: null,
           searchText: '',
           fetch: {state: "COMPLETED",
                   etag: null,
                   lastTs: moment().unix(),
                   lastSuccesfullTs: moment().unix()}},
  action) => {
    switch (action.type) {
    case "SET_LOCATIONS": {
      const currentSelectedCategory = state.selectedCategory ?
              findById(action.locations.categories, state.selectedCategory.id) :
              null;
      const currentSelectedArticle = state.selectedArticle && currentSelectedCategory ?
              findById(currentSelectedCategory.articles, state.selectedArticle.id) :
              null;
      const currentArticlesDataSource = currentSelectedCategory ?
              state.articlesDataSource.cloneWithRows(currentSelectedCategory.articles.sort(titleComparator)) :
              state.articlesDataSource;
      const newCurrentTitle = state.currentTitle && currentSelectedCategory ?
              (["articles", "article"].includes(last(state.routeStack).name) ? currentSelectedCategory.title : state.currentTitle) :
            state.currentTitle;
      return Object.assign({},
                           state,
                           {locations: action.locations,
                            categoriesDataSource:
                            state.categoriesDataSource.cloneWithRows(action.locations.categories.sort(titleComparator)),
                            articlesDataSource: currentArticlesDataSource,
                            selectedCategory: currentSelectedCategory,
                            selectedArticle: currentSelectedArticle,
                            currentTitle: newCurrentTitle});
    }
    case "SELECT_LOCATIONS_CATEGORY":
      return Object.assign({},
                           state,
                           {articlesDataSource: state.articlesDataSource.cloneWithRows(action.category.articles.sort(titleComparator)),
                            selectedCategory: action.category,
                            routeStack: state.routeStack.concat(action.route)});
    case "SET_LOCATIONS_SEARCH_DATA":
      return Object.assign({}, state, {searchDataSource: state.searchDataSource.cloneWithRows(action.data.sort(titleComparator)),
                                       searchText: action.text});
    case "SELECT_LOCATIONS_ARTICLE":
      return Object.assign({},
                           state,
                           {selectedArticle: action.article,
                            routeStack: state.routeStack.concat(action.route)});
    case "POP_LOCATIONS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({}, state, {routeStack: newStack});
    case "LOCATIONS_FETCH_STATE": {
      const now = moment().unix();
      return Object.assign({},
                           state,
                           {fetch: Object.assign({},
                                                 state.fetch,
                                                 {state: action.state, lastTs: now},
                                                 action.state == "COMPLETED" ? {lastSuccesfullTs: now} : {})});
    }
    case "SET_LOCATIONS_CURRENT_TITLE":
      return Object.assign({}, state, {currentTitle: action.currentTitle});
    case "SET_LOCATIONS_ETAG":
      return Object.assign({},
                           state,
                           {fetch: Object.assign({}, state.fetch, {etag: action.etag})});
    }
    return state;
  };

export default connect(state => ({
  locations: state.locations.locations,
  categoriesDataSource: state.locations.categoriesDataSource,
  articlesDataSource: state.locations.articlesDataSource,
  searchDataSource: state.locations.searchDataSource,
  selectedArticle: state.locations.selectedArticle,
  selectedCategory: state.locations.selectedCategory,
  routeStack: state.locations.routeStack,
  currentTitle: state.locations.currentTitle,
  searchText: state.locations.searchText,
  lang: state.language.lang,
  fetch: state.locations.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Locations);
