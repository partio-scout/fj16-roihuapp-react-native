'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  Navigator,
  TouchableOpacity,
  ListView,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { navigationStyles } from '../../styles.js';

const styles = StyleSheet.create({
  listItem: {padding: 10},
  section: {flex: 1, flexDirection: 'column'},
  article: {padding: 10}
});

var _navigator;

class Instructions extends Component {

  renderCategoryItem(category, navigator) {
    return (
      <View key={"category-" + category.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            const route = {name: "categories"};
            this.props.actions.selectCategory(category.articles[0], route);
            navigator.push(route);
          }}>
          <Text>{category.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderArticleItem(article, navigator) {
    return (
      <View key={"article-" + article.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            const route = {name: "article"};
            this.props.actions.selectArticle(article, route);
            navigator.push(route);
          }}>
          <Text>{article.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody(body) {
    return (
      body.split('\\n').map((paragraph, index) => (<Text key={"paragraph-" + index}>{paragraph}</Text>))
    );
  }

  renderArticle(article) {
    return (
      <View>
        <Text style={{textAlign: 'center', marginBottom: 20}}>
          {article.title}
        </Text>
        {this.renderBody(article.bodytext)}
      </View>
    );
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    const { rootDataSource, categoryDataSource, article } = this.props;
    switch(route.name) {
    case "categories":
      return (
        <View style={styles.section}>
          <ListView key={"categories"}
                    dataSource={categoryDataSource}
                    renderRow={(article) => this.renderArticleItem(article, navigator) }
            style={{width: Dimensions.get("window").width}}/>
        </View>
      );
    case "article":
      return (
        <View style={[styles.section, {width: Dimensions.get("window").width}]}>
          <View style={styles.article}>
            {this.renderArticle(article)}
          </View>
        </View>
      );
    }
    return (
      <View style={styles.section}>
        <ListView key={"root"}
                  dataSource={rootDataSource}
                  renderRow={(category) => this.renderCategoryItem(category, navigator) }
          style={{width: Dimensions.get("window").width}}/>
      </View>
    );
  }

  render() {
    if (this.props.error !== null) {
      return (<Text>Ei voitu hakea ohjeita</Text>);
    } else {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator initialRoute={{name: "root"}}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    }
  }

  fetchInstructions() {
    console.log("Fetching instructions");
    fetch(config.apiUrl + "/InstructionCategories/Translations?lang=FI")
      .then((response) => response.json())
      .then((instructions) => {
        this.props.actions.setInstructions(instructions);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  onBack() {
    if (_navigator) {
      _navigator.pop();
      this.props.actions.popNavigationRoute();
    }
  }

  componentDidMount() {
    if (this.props.instructions.categories.length === 0) {
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
  selectCategory: (articles, route) => ({
    type: "SELECT_CATEGORY",
    articles: articles,
    route: route
  }),
  selectArticle: (article, route) => ({
    type: "SELECT_ARTICLE",
    article: article,
    route: route
  }),
  popNavigationRoute: () => ({
    type: "POP_INSTRUCTIONS_ROUTE"
  })
};

export const instructions = (
  state = {instructions: {categories: []},
           error: null,
           rootDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           categoryDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           article: "",
           navigationStack: [{name: "root"}]},
  action) => {
    switch (action.type) {
    case "SET_INSTRUCTIONS_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions,
                                       rootDataSource: state.rootDataSource.cloneWithRows(action.instructions.categories)});
    case "SELECT_CATEGORY":
      return Object.assign({}, state, {categoryDataSource: state.categoryDataSource.cloneWithRows(action.articles),
                                       navigationStack: state.navigationStack.concat(action.route)});
    case "SELECT_ARTICLE":
      return Object.assign({},
                           state,
                           {article: action.article,
                            navigationStack: state.navigationStack.concat(action.route)});
    case "POP_INSTRUCTIONS_ROUTE":
      const newStack = Object.assign([], state.navigationStack);
      newStack.pop();
      return Object.assign({},
                           state, {navigationStack: newStack});
    }
    return state;
  };

export default connect(state => ({
  instructions: state.instructions.instructions,
  rootDataSource: state.instructions.rootDataSource,
  categoryDataSource: state.instructions.categoryDataSource,
  article: state.instructions.article,
  error: state.instructions.error
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
