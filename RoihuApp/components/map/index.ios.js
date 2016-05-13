'use strict';
import React, {
  Component,
  Image,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

class Map extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}
                    bouncesZoom={true}
                    maximumZoomScale={5.0}
                    minimumZoomScale={1.0}>
          <Image source={require('../../android/app/src/main/res/drawable-nodpi/map.png')}/>
        </ScrollView>
      </View>
    );
  }
}

module.exports = Map;
