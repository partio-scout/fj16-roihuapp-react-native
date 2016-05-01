'use strict';
import React, {
  Text,
  TouchableOpacity,
} from 'react-native';
import { navigationStyles } from './styles.js';

export function renderBackButton(navigator) {
  return (
    <TouchableOpacity style={navigationStyles.backButton}
                      onPress={() => navigator.pop()}>
      <Text>Takaisin</Text>
    </TouchableOpacity>
  );
}
