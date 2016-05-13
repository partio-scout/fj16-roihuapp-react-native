'use strict';
import React, {
  Component,
  View,
  Text,
  Dimensions,
  requireNativeComponent,
  PropTypes
} from 'react-native';

var iface = {
  name: 'ScaleImageView',
  propTypes: {
    ...View.propTypes,
    src: PropTypes.string
  }
};

const RCTScaleImageView = requireNativeComponent('RCTScaleImageView', iface);

class Map extends Component {
  render() {
    return (
      <RCTScaleImageView
         style={{flex: 1, width: Dimensions.get("window").width}}
         src={"android.resource://com.roihuapp/drawable/map"} />
    );
  }
}

module.exports = Map;
