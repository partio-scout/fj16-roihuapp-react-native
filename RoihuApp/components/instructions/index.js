'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  ViewPagerAndroid,
  TouchableOpacity,
  ListView,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';

const styles = StyleSheet.create({
  backButton: {padding: 5},
  listItem: {padding: 10},
  section: {flex: 1, flexDirection: 'column'},
  article: {padding: 10}
});

class Instructions extends Component {
  renderCategoryItem(category) {
    return (
      <View key={"category-" + category.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => this.props.actions.selectCategory(category.articles[0])}>
          <Text>{category.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderArticleItem(article) {
    return (
      <View key={"article-" + article.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => this.props.actions.selectArticle(article.bodytext)}>
          <Text>{article.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderArticleBody(body) {
    return (
      body.split('\\n').map((paragraph, index) => (<Text key={"paragraph-" + index}>{paragraph}</Text>))
    );
  }

  render() {
    const { error, view, rootDataSource, categoryDataSource, article } = this.props;
    console.log("article", article);
    if (error !== null) {
      return (<Text>Ei voitu hakea ohjeita</Text>);
    } else {
      switch(view) {
      case "categories":
        return (
          <View style={styles.section}>
            <TouchableOpacity style={styles.backButton}
                              onPress={() => this.props.actions.setView("root")}>
              <Text>Takaisin</Text>
            </TouchableOpacity>
            <ListView key={"categories"}
                      dataSource={categoryDataSource}
                      renderRow={(article) => this.renderArticleItem(article) }
              style={{width: Dimensions.get("window").width}}/>
          </View>
        );
      case "article":
        return (
          <View style={[styles.section, {width: Dimensions.get("window").width}]}>
            <TouchableOpacity style={styles.backButton}
                              onPress={() => this.props.actions.setView("categories")}>
              <Text>Takaisin</Text>
            </TouchableOpacity>
            <View style={styles.article}>
               {this.renderArticleBody(article)}
            </View>
          </View>
        );
      }
      return (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => this.fetchInstructions()}>
            <Text>Päivitä</Text>
          </TouchableOpacity>
          <ListView key={"root"}
                    dataSource={rootDataSource}
                    renderRow={(category) => this.renderCategoryItem(category) }
            style={{width: Dimensions.get("window").width}}/>
        </View>
      );
    }
  }

  fetchInstructions() {
    console.log("Fetching instructions");
    fetch(config.baseUrl + "/InstructionCategories/Translations?lang=FI")
      .then((response) => response.json())
      .then((instructions) => {
        this.props.actions.setInstructions(instructions);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  componentDidMount() {
    if (this.props.instructions.categories.length === 0) {
      this.fetchInstructions();
    }
  }
}

const actions = {
  setInstructions: (instructions) => ({
    type: "SET_INSTRUCTIONS",
    instructions: instructions
  }),
  setError: (error) => ({
    type: "SET_ERROR",
    error: error
  }),
  selectCategory: (articles) => ({
    type: "SELECT_CATEGORY",
    articles: articles
  }),
  selectArticle: (article) => ({
    type: "SELECT_ARTICLE",
    article: article
  }),
  setView: (view) => ({
    type: "SET_INSTRUCTION_VIEW",
    view: view
  })
};

export const instructions = (
  state = {instructions: {categories: []},
           error: null,
           rootDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           categoryDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           view: "root",
           article: ""},
  action) => {
    switch (action.type) {
    case "SET_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions,
                                       rootDataSource: state.rootDataSource.cloneWithRows(action.instructions.categories),
                                       view: "root"});
    case "SELECT_CATEGORY":
      return Object.assign({}, state, {categoryDataSource: state.categoryDataSource.cloneWithRows(action.articles),
                                       view: "categories"});
    case "SELECT_ARTICLE":
      console.log("article selected", action.article);
      return Object.assign({}, state, {article: action.article,
                                       view: "article"});
    case "SET_INSTRUCTION_VIEW":
      return Object.assign({}, state, {view: action.view});
    }
    return state;
  };

export default connect(state => ({
  instructions: state.instructions.instructions,
  rootDataSource: state.instructions.rootDataSource,
  categoryDataSource: state.instructions.categoryDataSource,
  view: state.instructions.view,
  article: state.instructions.article,
  error: state.instructions.error
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
