'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ListView,
  StyleSheet,
  WebView
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortNumber } from '../../utils.js';
import { t } from '../../translations.js';
import { categoryStyles } from '../../styles.js';
import { renderCategories, renderArticles, renderRoot, fetchData } from '../common/categories.js';
import { popWhenRouteNotLastInStack } from '../../utils.js';
import showdown from 'showdown';

class Instructions extends Component {

  constructor() {
    super();
    this.converter = new showdown.Converter({tables: true, strikethrough: true});
  }

  renderBody(body) {
    const html = `
<html>
  <style>
  body {
    font-family: Roboto, '-apple-system', Helvetica Neue, Arial;
  }
  </style>
  <body>${this.converter.makeHtml(body.replace(/([#]+)([^#]*)[#]+/g, (match, headerMarks, header) => headerMarks + header))}</body>
</html>
`;
    return (
      <WebView source={{html: html}}/>
    );
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
          {this.renderBody(article.bodytext)}
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
      return this.renderSelectedArticle(this.props.article);
    case "articles":
      return renderArticles(navigator, this.props.articlesDataSource, this.props.actions.selectArticle);
    case "categories":
    default:
      return renderCategories(navigator, this.props.categoriesDataSource, this.props.actions.selectCategory, this.props.actions.setCurrentTitle);
    }
  }

  render() {
    return renderRoot(this.props.fetch.state,
                      this.props.instructions,
                      "Ei voitu hakea ohjeita",
                      this.props.lang,
                      this.props.routeStack,
                      this.renderScene.bind(this),
                      (route) => popWhenRouteNotLastInStack(route, this.props.routeStack, this.props.actions.popNavigationRoute));
  }

  onBack() {
    if (this._navigator) {
      this.props.actions.popNavigationRoute();
      this._navigator.pop();
    }
  }

  componentWillMount() {
    if (this.props.instructions !== null && this.props.instructions.language.toUpperCase () === this.props.lang.toUpperCase()) {
      // Fetch data automatically if servers next_check time is in past
      if (moment().isAfter(this.props.instructions.next_check)) {
        fetchData("Fetching modified instructions",
                  this.props.actions.setFetchStatus,
                  "/LocationCategories/Translations",
                  {'afterDate': this.props.instructions.timestamp},
                  this.props.actions.setModifiedInstructions,
                  this.props.lang,
                  "Ohjeiden haku epäonnistui");
      }
    }    
    if (this.props.instructions === null || this.props.instructions.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      fetchData("Fetching instructions",
                this.props.actions.setFetchStatus,
                "/InstructionCategories/Translations",
                {},
                this.props.actions.setInstructions,
                this.props.lang,
                "Ohjeiden haku epäonnistui");
    }
    this.refreshListener = this.props.emitter.addListener("refresh", () => fetchData("Fetching modified instructions",
                                                                                     this.props.actions.setFetchStatus,
                                                                                     "/InstructionCategories/Translations",
                                                                                     {'afterDate': this.props.instructions.timestamp},
                                                                                     this.props.actions.setModifiedInstructions,
                                                                                     this.props.lang,
                                                                                     "Ohjeiden haku epäonnistui"));
    this.backListener = this.props.emitter.addListener("back", () => this.onBack());
  }

  componentWillUnmount() {
    this.refreshListener.remove();
    this.backListener.remove();
  }
}

const actions = {
  setInstructions: (instructions) => ({
    type: "SET_INSTRUCTIONS",
    instructions: instructions
  }),

  setModifiedInstructions: (newInstructions) => ({
    type: "SET_MODIFIED_INSTRUCTIONS",
    newInstructions: newInstructions
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
  })
};

export const instructions = (
  state = {instructions: null,
           newInstructions: null,
           categoriesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           articlesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           article: {},
           routeStack: [{name: "categories"}],
           currentTitle: null,
           fetch: {state: "COMPLETED"}},
  action) => {
    switch (action.type) {
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions,
                                       categoriesDataSource: state.categoriesDataSource.cloneWithRows(action.instructions.categories.sort((a, b) => sortNumber(a.sort_no, b.sort_no)))});
    case "SET_MODIFIED_INSTRUCTIONS":
      const modifiedInstructions = Object.assign({}, state.instructions, state.newInstructions);
      return Object.assign({}, state, {instructions: modifiedInstructions,
                                       categoriesDataSource: state.categoriesDataSource.cloneWithRows(modifiedInstructions.categories.sort((a, b) => sortNumber(a.sort_no, b.sort_no)))});
    case "SELECT_INSTRUCTIONS_CATEGORY":
      return Object.assign({}, state, {articlesDataSource: state.articlesDataSource.cloneWithRows(action.category.articles.sort((a, b) => sortNumber(a.sort_no, b.sort_no))),
                                       routeStack: state.routeStack.concat(action.route)});
    case "SELECT_INSTRUCTIONS_ARTICLE":
      return Object.assign({},
                           state,
                           {article: action.article,
                            routeStack: state.routeStack.concat(action.route)});
    case "POP_INSTRUCTIONS_ROUTE":
      const newStack = Object.assign([], state.routeStack);
      newStack.pop();
      return Object.assign({},
                           state, {routeStack: newStack});
    case "SET_INSTRUCTIONS_CURRENT_TITLE":
      return Object.assign({}, state, {currentTitle: action.currentTitle});
    case "INSTRUCTIONS_FETCH_STATE":
      return Object.assign({}, state, {fetch: {state: action.state}});
    }
    return state;
  };

export default connect(state => ({
  instructions: state.instructions.instructions,
  newInstructions: state.instructions.newInstructions,
  categoriesDataSource: state.instructions.categoriesDataSource,
  articlesDataSource: state.instructions.articlesDataSource,
  article: state.instructions.article,
  routeStack: state.instructions.routeStack,
  currentTitle: state.instructions.currentTitle,
  lang: state.language.lang,
  fetch: state.instructions.fetch
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
