'use strict';
import React, {
  AppRegistry,
  Component,
} from 'react-native';

import {App} from './components/app/index.js';

class RoihuApp extends Component {
  render() {
    return (
      <App/>
    );
  }
}

AppRegistry.registerComponent('RoihuApp', () => RoihuApp);
