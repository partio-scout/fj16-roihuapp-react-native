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
const map = require('../../images/map.png');

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RCTScaleImageView
         style={{flex: 1, width: 220, height: 400}}
         src={"@drawable/map.png"} />
    );
  }

}
