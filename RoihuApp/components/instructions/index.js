'use strict';
import React, {
  Component,
  View,
  Dimensions,
  Text,
  ViewPagerAndroid,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';

class Instructions extends Component {
  render() {
    const { instructions, error } = this.props;
    if (error !== null) {
      return (<Text>Ei voitu hakea ohjeita</Text>);
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => this.fetchInstructions() }>
            <Text>Päivitä</Text>
          </TouchableOpacity>
          <Text>{instructions.categories.length} ohje kategoriaa</Text>
        </View>);
    }
  }

  fetchInstructions() {
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
    const { instructions } = this.props;
    if (instructions.length === 0) {
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
  })
};

export default connect(state => ({
  instructions: state.instructions.instructions,
  error: state.instructions.error
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Instructions);
