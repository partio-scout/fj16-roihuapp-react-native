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
  Navigator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { removeCredentials } from '../login/actions.js';
import { navigationStyles } from '../../styles.js';
import { isEmpty } from '../../utils.js';
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
    this.props.popRoute();
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

  renderImageSelection(navigator, image) {
    if (image === null) {
      return (
        <TouchableOpacity style={{margin: 10}}
                          onPress={() => this.props.pushRoute({name: "list-image"})}>
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

  renderLogoutButton() {
    return (
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
    );
  }

  renderUser(data, image, navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column', width: Dimensions.get('window').width}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{margin: 10}}
                            onPress={() => this.props.pushRoute({name: "list-image"})}>
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

  renderScene(route, navigator) {
    switch(route.name) {
    case "list-image":
      return this.listImages(navigator, this.props.actions.setImage);
    case "user-root":
    default:
      return this.renderUser(this.props.data, this.props.image, navigator);
    }
  }

  render() {
    const { data, error } = this.props;
    if (!isEmpty(data)) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator initialRouteStack={this.props.parentNavigator.getCurrentRoutes()}
                     navigator={this.props.parentNavigator}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
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
    console.log("Fetching user info");
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

  componentWillMount() {
    this.refreshListener = this.props.refreshEventEmitter.addListener("refresh",
                                                                      () => this.fetchUserInfo(this.props.credentials));
  }

  componentWillUnmount() {
    this.refreshListener.remove();
  }

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

export default connect(state => ({
  credentials: state.credentials,
  data: state.user.data,
  error: state.user.error,
  image: state.user.image
}), (dispatch) => ({
  actions: bindActionCreators({setUser,
                               setError,
                               removeCredentials,
                               setImage}, dispatch)
}))(User);
