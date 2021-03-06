'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ListView,
  StyleSheet,
  WebView,
  Linking,
  Platform
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortNumber } from '../../utils.js';
import { t } from '../../translations.js';
import { TEXT_COLOR, categoryStyles } from '../../styles.js';
import { renderCategories, renderArticles, renderRoot, shouldFetch, fetchData, findById } from '../common/categories.js';
import { popWhenRouteNotLastInStack, last } from '../../utils.js';
import showdown from 'showdown';
import WebViewBridge from 'react-native-webview-bridge';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const injectScript = `
(function () {
  if (WebViewBridge) {
    var anchors = document.querySelectorAll('a');
    for (i = 0; i < anchors.length; i++) {
      anchors[i].onclick = function (e) {
        e.preventDefault();
        WebViewBridge.send(e.target.href);
      }
    }
  }
}());
`;

class Instructions extends Component {

  constructor() {
    super();
    this.converter = new showdown.Converter({tables: true, strikethrough: true});
  }

  onBridgeMessage(url) {
    Linking.openURL(url).catch((error) => {
      console.log("Could not open instruction link: " + url);
    });
  }

  renderBody(article) {
    const html = `
<html>
  <style>
  body {
    font-family: Roboto, '-apple-system', Helvetica Neue, Arial;
  }
  footer {
    font-size: 10px;
    text-align: right;
    margin-top: 10,
    margin-bottom: 10,
    color: ${TEXT_COLOR}
  }
  </style>
  <body>
  ${this.converter.makeHtml(article.bodytext.replace(/([#]+)([^#]*)[#]+/g, (match, headerMarks, header) => headerMarks + header))}
    <footer>
      ${this.converter.makeHtml(t("Viimeksi muokattu", this.props.lang) + ' ' + moment(article.last_modified).format(t("Timestamp", this.props.lang)))}
    </footer>
  </body>
</html>
`;
    if (Platform.OS === "android" && Platform.Version < 19) {
      return (
        <WebView source={{html: html}}/>
      );
    } else {
      return (
        <WebViewBridge
           source={{html: html}}
           ref="webviewbridge"
           onBridgeMessage={(message) => this.onBridgeMessage(message)}
          injectedJavaScript={injectScript}
          javaScriptEnabled={true}/>
      );
    }
  }

  renderSelectedArticle(article) {
    return (
      <View style={categoryStyles.article}>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {article.title}
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          {this.renderBody(article)}
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
                      this.props.instructions,
                      t("Ei voitu hakea ohjeita", this.props.lang),
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
    if (shouldFetch(this.props.instructions, this.props.lang, this.props.fetch.lastTs)) {
      fetchData(
        "Fetching instructions",
        this.props.actions.setFetchStatus,
        "/InstructionCategories/Translations",
        {},
        this.props.actions.setInstructions,
        this.props.lang,
        t("Ohjeiden haku epäonnistui", this.props.lang),
        this.props.fetch.etag,
        this.props.actions.setEtag,
        () => {}
      );
    }

    this.refreshListener = this.props.emitter.addListener("refresh", () => fetchData("Fetching instructions",
                                                                                     this.props.actions.setFetchStatus,
                                                                                     "/InstructionCategories/Translations",
                                                                                     {},
                                                                                     this.props.actions.setInstructions,
                                                                                     this.props.lang,
                                                                                     t("Ohjeiden haku epäonnistui", this.props.lang),
                                                                                     this.props.fetch.etag,
                                                                                     this.props.actions.setEtag,
                                                                                     () => {}));
    this.backListener = this.props.emitter.addListener("back", () => this.onBack());
  }

  componentWillUnmount() {
    this.refreshListener.remove();
    this.backListener.remove();
  }
}

const decodeTitle = (obj) => Object.assign({},
                                           obj,
                                           {title: entities.decode(obj.title)});

const actions = {
  setInstructions: (instructions) => ({
    type: "SET_INSTRUCTIONS",
    instructions: Object.assign({},
                                instructions,
                                {categories: instructions.categories.map((category) => Object.assign({},
                                                                                                     decodeTitle(category),
                                                                                                     {articles: category.articles[0].map(decodeTitle)}))})
  }),
  selectCategory: (category, route) => ({
    type: "SELECT_INSTRUCTIONS_CATEGORY",
    category: category,
    route: route
  }),
  selectArticle: (article, route) => ({
    type: "SELECT_INSTRUCTIONS_ARTICLE",
    article: article,
    route: route
  }),
  popNavigationRoute: () => ({
    type: "POP_INSTRUCTIONS_ROUTE"
  }),
  setFetchStatus: (state) => ({
    type: "INSTRUCTIONS_FETCH_STATE",
    state: state
  }),
  setCurrentTitle: (title) => ({
    type: "SET_INSTRUCTIONS_CURRENT_TITLE",
    currentTitle: title
  }),
  setSearchData: (data, text) => ({
    type: "SET_INSTRUCTIONS_SEARCH_DATA",
    data: data,
    text: text
  }),
  setEtag: (etag) => ({
    type: "SET_INSTRUCTIONS_ETAG",
    etag: etag
  })
};

const sortNoComparator = (a, b) => sortNumber(a.sort_no, b.sort_no);

export const instructions = (
  state = {instructions: null,
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
    case "SET_INSTRUCTIONS": {
      const currentSelectedCategory = state.selectedCategory ?
              findById(action.instructions.categories, state.selectedCategory.id) || state.selectedCategory :
              state.selectedCategory;
      const currentSelectedArticle = state.selectedArticle && currentSelectedCategory ?
              findById(currentSelectedCategory.articles, state.selectedArticle.id) || state.selectedArticle :
              state.selectedArticle;
      const currentArticlesDataSource = currentSelectedCategory ?
              state.articlesDataSource.cloneWithRows(currentSelectedCategory.articles.sort(sortNoComparator)) :
              state.articlesDataSource;
      const newCurrentTitle = state.currentTitle && currentSelectedCategory ?
              (["articles", "article"].find((route) => last(state.routeStack).name === route) ? currentSelectedCategory.title : state.currentTitle) :
            state.currentTitle;
      return Object.assign({},
                           state,
                           {instructions: action.instructions,
                            categoriesDataSource: state.categoriesDataSource.cloneWithRows(action.instructions.categories.sort(sortNoComparator)),
                            articlesDataSource: currentArticlesDataSource,
                            selectedCategory: currentSelectedCategory,
                            selectedArticle: currentSelectedArticle,
                            currentTitle: newCurrentTitle});
    }
    case "SELECT_INSTRUCTIONS_CATEGORY":
      return Object.assign({},
                           state,
                           {articlesDataSource: state.articlesDataSource.cloneWithRows(action.category.articles.sort(sortNoComparator)),
                            selectedCategory: action.category,
                            routeStack: state.routeStack.concat(action.route)});
    case "SET_INSTRUCTIONS_SEARCH_DATA":
      return Object.assign({}, state, {searchDataSource: state.searchDataSource.cloneWithRows(action.data.sort(sortNoComparator)),
                                       searchText: action.text});
    case "SELECT_INSTRUCTIONS_ARTICLE":
      return Object.assign({},
                           state,
                           {selectedArticle: action.article,
                            routeStack: state.routeStack.concat(action.route)});
    case "POP_INSTRUCTIONS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    case "SET_INSTRUCTIONS_CURRENT_TITLE":
      return Object.assign({}, state, {currentTitle: action.currentTitle});
    case "INSTRUCTIONS_FETCH_STATE": {
      const now = moment().unix();
      return Object.assign({},
                           state,
                           {fetch: Object.assign({},
                                                 state.fetch,
                                                 {state: action.state, lastTs: now},
                                                 action.state == "COMPLETED" ? {lastSuccesfullTs: now} : {})});
    }
    case "SET_INSTRUCTIONS_ETAG":
      return Object.assign({},
                           state,
                           {fetch: Object.assign({}, state.fetch, {etag: action.etag})});
    }
    return state;
  };

export default connect(state => ({
  instructions: state.instructions.instructions,
  categoriesDataSource: state.instructions.categoriesDataSource,
  articlesDataSource: state.instructions.articlesDataSource,
  searchDataSource: state.instructions.searchDataSource,
  selectedArticle: state.instructions.selectedArticle,
  selectedCategory: state.instructions.selectedCategory,
  routeStack: state.instructions.routeStack,
  currentTitle: state.instructions.currentTitle,
  searchText: state.instructions.searchText,
  lang: state.language.lang,
  fetch: state.instructions.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
