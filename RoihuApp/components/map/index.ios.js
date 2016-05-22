'use strict';
import React, {
  Component,
  Dimensions,
  requireNativeComponent
} from 'react-native';

const RCTZoomableMapView = requireNativeComponent('RCTZoomableMapView', null);

class Map extends Component {
  render() {
    return (
      <RCTZoomableMapView style={{flex: 1, backgroundColor: 'white', width: Dimensions.get("window").width}}/>
    );
  }
}

module.exports = Map;
