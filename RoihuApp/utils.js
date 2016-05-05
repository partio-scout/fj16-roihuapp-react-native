'use strict';
import React, {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { navigationStyles } from './styles.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

export function renderBackButton(navigator) {
  return (
    <TouchableOpacity style={navigationStyles.backButton}
                      onPress={() => navigator.pop()}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="arrow-back" size={30} color="#000000"/>
        <Text>Takaisin</Text>
      </View>
    </TouchableOpacity>
  );
}
