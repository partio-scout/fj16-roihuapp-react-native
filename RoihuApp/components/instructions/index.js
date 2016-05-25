'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  Navigator,
  TouchableOpacity,
  ListView,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { t } from '../../translations.js';
import { categoryStyles } from '../../styles.js';
import { renderCategories, renderArticles } from '../common/categories.js';
const Markdown = require('react-native-markdown');

class Instructions extends Component {

  renderBody(body) {
    return (
      <ScrollView style={{flex: 1}}>
        <Markdown style={categoryStyles.textColor}>
          {body}
        </Markdown>
      </ScrollView>
    );
  }

  renderSelectedArticle(article) {
    const { view, actions: {setView}, lang } = this.props;
    return (
      <View style={categoryStyles.article}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
          {article.title}
        </Text>
        {this.renderBody(article.bodytext)}
        <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>{t("Viimeksi muokattu", lang)} {moment(article.last_modified).format('DD.MM. h:mm')}</Text>
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
    const { view, actions: {setView}, lang } = this.props;
    if (this.props.error !== null || this.props.instructions === null) {
      return (<Text>Ei voitu hakea ohjeita</Text>);
    } else {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Text style={[categoryStyles.smallText, categoryStyles.textColor, {marginRight: 10}]}>
            {t("Tilanne", lang)} {moment(this.props.instructions.timestamp).format('DD.MM. h:mm')}
          </Text>        
          <Navigator initialRouteStack={this.props.routeStack}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    }
  }

  fetchInstructions() {
    console.log("Fetching instructions");
    fetch(config.apiUrl + "/InstructionCategories/Translations?lang=" + this.props.lang.toUpperCase())
      .then((response) => response.json())
      .then((instructions) => {
        this.props.actions.setInstructions(instructions);
      })
      .catch((error) => {
        this.props.actions.setError(error);
        console.log(error);
        Alert.alert("Virhe nettiyhteydessä",
                    "Ohjeiden haku epäonnistui",
                    [{text: "Okei", onPress: () => {}}]);
      });
  }

  onBack() {
    if (this._navigator) {
      this._navigator.pop();
      this.props.actions.popNavigationRoute();
    }
  }

  componentDidMount() {
    if (this.props.instructions === null || this.props.instructions.language.toUpperCase() !== this.props.lang.toUpperCase()) {
      this.fetchInstructions();
    }
    this.refreshListener = this.props.emitter.addListener("refresh", () => this.fetchInstructions());
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
  setError: (error) => ({
    type: "SET_INSTRUCTIONS_ERROR",
    error: error
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
  })
};

export const instructions = (
  state = {instructions: null,
           error: null,
           categoriesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           articlesDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.title !== r2.title}),
           article: "",
           routeStack: [{name: "categories"}]},
  action) => {
    switch (action.type) {
    case "SET_INSTRUCTIONS_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions,
                                       categoriesDataSource: state.categoriesDataSource.cloneWithRows(action.instructions.categories)});
    case "SELECT_INSTRUCTIONS_CATEGORY":
      return Object.assign({}, state, {articlesDataSource: state.articlesDataSource.cloneWithRows(action.category.articles[0]),
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
    }
    return state;
  };

export default connect(state => ({
  instructions: state.instructions.instructions,
  categoriesDataSource: state.instructions.categoriesDataSource,
  articlesDataSource: state.instructions.articlesDataSource,
  article: state.instructions.article,
  error: state.instructions.error,
  routeStack: state.instructions.routeStack,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
