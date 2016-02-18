'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import {styles} from './styles.js';
import {Map} from './components/map.js';
import {Calendar} from './components/calendar.js';

export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "calendar"
    };
  }

  render() {
    return (
        <View style={styles.main}>
            <View style={styles.content}>
                {this.renderView()}
            </View>
            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.button}
                                  onPress={(() => this.changeView("calendar"))}>
                    <Image source={require('./icons/calendar.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={(() => this.changeView("map"))}>
                    <Image source={require('./icons/pin.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
  }

  changeView(view) {
    this.setState({
      view: view
    });
  }

  renderView() {
    switch (this.state.view) {
    case "calendar":
      return (<Calendar/>);
      break;
    case "map":
      return (<Map/>);
      break;
    default:
      return (<Calendar/>);
    }
  }

};
