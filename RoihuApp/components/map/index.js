'use strict';
import React, {
  Component,
  View,
  Text,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MapComponent } from './MapComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { infoStyles, navigationStyles, styles, modalStyles } from '../../styles';


class Map extends Component {

  renderTopBar() {
    return(
      <View style={infoStyles.topNavigationBar}>
        <TouchableOpacity style={{paddingRight: 10, paddingTop: 10, flex: 1}} onPress={() => this.props.actions.setMarkers(true)}>
          <Icon style={[navigationStyles.mapButton, styles.buttonBarIcon]} name="place" />
        </TouchableOpacity>
      </View>
    );        
  }

  renderMarkers() {
    return(
      <TouchableOpacity onPress={() => this.props.actions.setMarkers(false)}>
        <Modal
          transparent={true}
          visible={this.props.markers}
          onRequestClose={() => this.props.actions.setMarkers(false)}
          >
          <View style={modalStyles.background}>
            <View style={modalStyles.innerContainer}>
              <Text style={modalStyles.header}>Karttamerkit</Text>
              <Image 
                style={modalStyles.mapImage}
                source={require('../../images/Karttamerkit-feikki.png')} />
              <TouchableOpacity style={styles.basicButton} onPress={() => this.props.actions.setMarkers(false)}>
                <Text style={styles.buttonBarColor}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>     
    );
  }

  render() {
    return (
      <View style={[infoStyles.container, {width: Dimensions.get("window").width}]}>
        {this.renderTopBar()}
        <MapComponent />
        {this.renderMarkers()}
      </View>

    );
  }
}

const actions = {
  setMarkers: (visible) => ({
    type: "SET_MARKERS",
    markers: visible
  })
};

export default connect(state => ({
  markers: state.map.markers,
}), (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
}))(Map);