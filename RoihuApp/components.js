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

export class Main extends Component {
  render() {
    return (
        <View style={styles.main}>
            <View style={styles.content}>
                <Text>1</Text>
                <Text>2</Text>
                <Text>3</Text>
                <Text>4</Text>
                <Text>5</Text>
            </View>
            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.button}
                                  onPress={this._handlePress}>
                    <Image source={require('./icons/calendar.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={this._handlePress}>
                    <Image source={require('./icons/pin.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
  }

  _handlePress(event) {
    console.log('Pressed!');
  }
}
