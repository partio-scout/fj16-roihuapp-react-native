'use strict';
import React, {
  Component,
  View,
  requireNativeComponent,
  Dimensions,
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

export class MapComponent extends Component {
  render() {
    return (
      <RCTScaleImageView
         style={{flex: 1, width: Dimensions.get("window").width}}
         src={"android.resource://com.roihuapp/drawable/map"} />
    );
  }
}