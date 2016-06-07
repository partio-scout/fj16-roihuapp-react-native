'use strict';
import React, {
  Component,
  View,
  TouchableHighlight,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import t from 'tcomb-form-native';
import { setDetails } from './index';
import editDetailsModel from './EditDetailsModel';
import { styles } from '../../styles';

class EditDetails extends Component {

  saveDetails () {
    console.log('TISSIT');
    console.log(this);
    /*let values = this.refs.form.getValue();
    console.log('VALUES:');
    console.log(values);
    if (values) {

    }*/
  }  

  render() {
    let Form = t.form.Form;

    return (
      <View style={{flex: 1}}>
        <Text style={{marginTop: 10, marginLeft: 10}}>Muokkaa tietoja</Text>
        <Form ref="form" type={editDetailsModel.fields} options={editDetailsModel.options} />
        <TouchableHighlight style={styles.basicButton} onPress={this.saveDetails}>
          <Text style={styles.buttonBarColor}>Tallenna</Text>
        </TouchableHighlight>        
      </View>
    );
  }
}

export default connect(state => ({
  lang: state.language.lang,
  details: state.user.details
}), (dispatch) => ({
  actions: bindActionCreators({setDetails}, dispatch)
}))(EditDetails);