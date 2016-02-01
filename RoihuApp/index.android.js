'use strict';
import React, {
  AppRegistry,
  Component
} from 'react-native';

import {Main} from './components.js';

class RoihuApp extends Component {
  render() {
      return (
       <Main/>
    );
  }
}

AppRegistry.registerComponent('RoihuApp', () => RoihuApp);
