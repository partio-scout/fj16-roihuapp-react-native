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

const styles = StyleSheet.create({
  backButton: {padding: 10},
  listItem: {padding: 10},
  section: {flex: 1, flexDirection: 'column'},
  article: {padding: 10},
  refreshButton: {padding: 10}
});

class Instructions extends Component {
  renderCategoryItem(category, navigator) {
    return (
      <View key={"category-" + category.id} style={styles.listItem}>
        <TouchableOpacity onPress={() => {
            this.props.actions.selectCategory(category.articles[0]);
            navigator.push({name: "categories", index: 1});
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
            this.props.actions.selectArticle(article.bodytext);
            navigator.push({name: "article", index: 2});
          }}>
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

  renderScene(route, navigator) {
    const { rootDataSource, categoryDataSource, article } = this.props;
    switch(route.name) {
    case "categories":
      return (
        <View style={styles.section}>
          <TouchableOpacity style={styles.backButton}
                            onPress={() => navigator.pop()}>
            <Text>Takaisin</Text>
          </TouchableOpacity>
          <ListView key={"categories"}
                    dataSource={categoryDataSource}
                    renderRow={(article) => this.renderArticleItem(article, navigator) }
            style={{width: Dimensions.get("window").width}}/>
        </View>
      );
    case "article":
      return (
        <View style={[styles.section, {width: Dimensions.get("window").width}]}>
          <TouchableOpacity style={styles.backButton}
                            onPress={() => navigator.pop()}>
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
        <TouchableOpacity style={styles.refreshButton}
                          onPress={() => this.fetchInstructions()}>
          <Text>Päivitä</Text>
        </TouchableOpacity>
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
          <Navigator initialRoute={{name: "root", index: 0}}
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
  })
};

export const instructions = (
  state = {instructions: {categories: []},
           error: null,
           rootDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           categoryDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
           article: ""},
  action) => {
    switch (action.type) {
    case "SET_ERROR":
      return Object.assign({}, state, {error: action.error});
    case "SET_INSTRUCTIONS":
      return Object.assign({}, state, {instructions: action.instructions,
                                       rootDataSource: state.rootDataSource.cloneWithRows(action.instructions.categories)});
    case "SELECT_CATEGORY":
      return Object.assign({}, state, {categoryDataSource: state.categoryDataSource.cloneWithRows(action.articles)});
    case "SELECT_ARTICLE":
      return Object.assign({}, state, {article: action.article});
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
