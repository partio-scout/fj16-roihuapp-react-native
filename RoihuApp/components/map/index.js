'use strict';
import React, {
  Component,
  Image,
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

// Refer to map resource so that packager includes it and allows
// using 'android.resource://' URI as reference.
// Packager translates /images/map.jpg to 'res/drawable-mdpi-v4/images_map.jpg'.
// Resulting resource URI is 'android.resource://com.roihuapp/drawable/images_map'
const map = require('../../images/map.jpg');

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RCTScaleImageView
         style={{flex: 1, width: Dimensions.get("window").width}}
         src={"android.resource://com.roihuapp/drawable/images_map"} />
    );
  }

}
