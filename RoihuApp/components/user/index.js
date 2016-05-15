'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  CameraRoll,
  Navigator,
  BackAndroid,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { removeCredentials } from '../login/actions.js';
import { navigationStyles } from '../../styles.js';
import Settings from '../settings/index.js';
const Icon = require('react-native-vector-icons/MaterialIcons');
const CameraRollView = require('./CameraRollView');

const styles = StyleSheet.create({
  key: {
    flex: 1,
    textAlign: 'right',
    marginRight: 5
  },
  value: {
    flex: 2
  },
  name: {
    fontSize: 20
  },
  nickname: {
    marginTop: 10,
    fontSize: 50
  }
});

var _navigator;

if (Platform.OS === 'android') {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (!_navigator) {
      return false;
    }
    if (_navigator.getCurrentRoutes().length === 1) {
      return false;
    }
    _navigator.pop();
    return true;
  });
}

function last(arr) {
  if (arr.length === 0) {
    return null;
  }
  return arr[arr.length - 1];
}

class User extends Component {

  renderKeys(data) {
    const keys = [{name: "Telephone:", key: 'phone'},
                  {name: "Email:", key: 'email'},
                  {name: "Primary Troop:", key: 'primaryTroopAndCity'},
                  {name: "Disctrict:", key: 'scoutDistrict'},
                  {name: "Country:", key: 'country'},
                  {name: "Age level:", key: 'ageGroup'},
                  {name: "Subcamp:", key: 'subcamp'},
                  {name: "Camp Troop:", key: 'campUnit'},
                  {name: "Description:", key: 'description'}];
    return keys.map((item) => (
      <View style={{flexDirection: 'row'}} key={item.key}>
        <Text style={styles.key}>{item.name}</Text>
        <Text style={styles.value}>{data[item.key]}</Text>
      </View>
    ));
  }

  chooseImage(asset, navigator, setImage) {
    setImage(asset.node.image);
    console.log("asset", asset);
    console.log(setImage);
    navigator.pop();
  }

  renderImage(asset, onSelection) {
    return (
      <TouchableOpacity key={asset} onPress={() => onSelection(asset)}>
        <Image source={asset.node.image}
               resizeMode={'contain'}
               style={{width: 150, height: 150, margin: 5}}/>
      </TouchableOpacity>
    );
  }

  listImages(navigator, setImage) {
    return (
      <View style={{flex: 1}}>
        <CameraRollView
           batchSize={20}
           groupTypes={"All"}
           renderImage={(asset) => this.renderImage(asset, (asset) => this.chooseImage(asset, navigator, setImage))}
          />
      </View>
    );
  }

  pushRoute(navigator, route) {
    this.props.actions.pushUserRoute(route);
    navigator.push(route);
  }

  popRoute(navigator) {
    this.props.actions.popUserRoute();
    navigator.pop();
  }

  renderImageSelection(navigator, image) {
    if (image === null) {
      return (
        <TouchableOpacity style={{margin: 10}}
                          onPress={() => this.pushRoute(navigator, {name: "list-image"})}>
          <Icon name="add-a-photo" size={100} color="#000000"/>
        </TouchableOpacity>
      );
    } else {
      return (
        <Image source={image}
               style={{width: 150, height: 150, margin: 5}}/>
      );
    }
  }

  renderUser(data, image, navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column', width: Dimensions.get('window').width}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
             style={{flex: 1}}
             onPress={() => {
              this.fetchUserInfo(this.props.credentials);
            }}>
            <Text style={{textAlign: 'left', margin: 10}}>
              Päivitä
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
             style={{flex: 1}}
             onPress={() => {
              this.props.actions.removeCredentials(null);
              this.props.actions.setUser({});
            }}>
            <Text style={{textAlign: 'right', margin: 10}}>
              Kirjaudu ulos
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{margin: 10}}
                            onPress={() => this.pushRoute(navigator, {name: "list-image"})}>
            {this.renderImageSelection(navigator, image)}
          </TouchableOpacity>
          <View style={{marginLeft: 10}}>
            <Text style={styles.nickname}>
              {data.nickname}
            </Text>
            <View>
              <Text style={styles.name}>{data.firstname}</Text>
              <Text style={styles.name}>{data.lastname}</Text>
            </View>
          </View>
        </View>
        <View>
          {this.renderKeys(data)}
        </View>
      </View>
    );
  }

  renderSettings(navigator) {
    return (
      <Settings navigator={navigator}/>
    );
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    switch(route.name) {
    case "settings":
      return this.renderSettings(navigator);
    case "list-image":
      return this.listImages(navigator, this.props.actions.setImage);
    case "root":
    default:
      return this.renderUser(this.props.data, this.props.image, navigator);
    }
  }

  renderBackButton() {
    if (this.props.routeStack.length === 1) {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingLeft: 10, paddingTop: 10}}
                          onPress={() => this.popRoute(_navigator)}>
          <Icon name="arrow-back" size={30} color="#000000"/>
        </TouchableOpacity>
      );
    }
  }

  renderSettingsButton() {
    if (last(this.props.routeStack).name === "settings") {
      return null;
    } else {
      return (
        <TouchableOpacity style={{paddingRight: 10, paddingTop: 10}}
                          onPress={() => this.pushRoute(_navigator, {name: "settings"})}>
          <Icon style={{textAlign: 'right'}} name="settings" size={30} color="#000000"/>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const { data, error } = this.props;
    if (!isEmpty(data)) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <View style={{flexDirection: 'row'}}>
            {this.renderBackButton()}
            <View style={{flex: 1}}></View>
            {this.renderSettingsButton()}
          </View>
          <Navigator initialRouteStack={this.props.routeStack}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
      return this.renderUser();
    } else if (error !== null) {
      return (
        <Text>error</Text>
      );
    } else {
      return (
        <Text>No user</Text>
      );
    }
  }

  fetchUserInfo(credentials) {
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "?access_token=" + credentials.token)
      .then((response) => response.json())
      .then((user) => {
        this.props.actions.setUser(user);
      })
      .catch((error) => {
        this.props.actions.setError(error);
      });
  }

  componentDidMount() {
    const { credentials, data } = this.props;
    if (isEmpty(data)) {
      this.fetchUserInfo(credentials);
    }
  }
}

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

const setUser = (data) => ({
  type: "SET_USER",
  data: data
});

const setError = (error) => ({
  type: "SET_USER_ERROR",
  error: error
});

const setImage = (image) => ({
  type: "SET_IMAGE",
  image: image
});

const pushUserRoute = (route) => ({
  type: "PUSH_USER_ROUTE",
  route: route
});

const popUserRoute = () => ({
  type: "POP_USER_ROUTE"
});

export default connect(state => ({
  credentials: state.credentials,
  data: state.user.data,
  error: state.user.error,
  image: state.user.image,
  routeStack: state.user.routeStack
}), (dispatch) => ({
  actions: bindActionCreators({setUser,
                               setError,
                               removeCredentials,
                               setImage,
                               pushUserRoute,
                               popUserRoute}, dispatch)
}))(User);
