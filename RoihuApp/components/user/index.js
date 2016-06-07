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
import { config } from '../../config';
import { removeCredentials } from '../login/actions';
import { t } from '../../translations';
import { navigationStyles, categoryStyles, userStyles } from '../../styles';
import { isEmpty } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraRollView from './CameraRollView';

class User extends Component {

  renderKeys(data) {
    const keys = [{name: t("Telephone", this.props.lang), key: 'phone'},
                  {name: t("Email", this.props.lang), key: 'email'},
                  {name: t("Public Accounts", this.props.lang), key: 'publicAccounts'},
                  {name: t("Primary Troop", this.props.lang), key: 'primaryTroopAndCity'},
                  {name: t("Disctrict", this.props.lang), key: 'scoutDistrict'},
                  {name: t("Country", this.props.lang), key: 'country'},
                  {name: t("Age level", this.props.lang), key: 'ageGroup'},
                  {name: t("Subcamp", this.props.lang), key: 'subcamp'},
                  {name: t("Camp Troop", this.props.lang), key: 'campUnit'},
                  {name: t("Description", this.props.lang), key: 'description'}];
    return keys.map((item) => (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}} key={item.key}>
        <Text style={[userStyles.key, categoryStyles.textColor]}>{item.name}</Text>
        <Text style={[userStyles.value, categoryStyles.textColor]}>{data[item.key]}</Text>
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
        <TouchableOpacity 
          style={{margin: 5}}
          onPress={() => this.props.pushRoute({name: "list-image"})}
        >
          <Icon style={categoryStyles.textColor} name="add-a-photo" size={65} />
        </TouchableOpacity>
      );
    } else {
      return (
        <Image source={image}
               style={{width: 85, height: 85, margin: 5}}/>
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
      <View>
        <View style={userStyles.userUpperAreaContainer}>
          <View style={{flex: 1}}>
            <View style={userStyles.nameImageContainer}>
              <View style={userStyles.userNameArea}>
                <Text style={[userStyles.nickname, categoryStyles.textColor]}>
                  {data.nickname}
                </Text>
                <Text style={[userStyles.name, categoryStyles.textColor]}>{data.firstname} {data.lastname}</Text>
              </View>
              <TouchableOpacity 
                style={userStyles.userImageArea}
                onPress={() => this.props.pushRoute({name: "list-image"})}
              >
                {this.renderImageSelection(navigator, image)}
              </TouchableOpacity>          
            </View>
          </View>
        </View>
        <View style={userStyles.userContentContainer}>
          <View>
            {this.renderKeys(data)}
          </View>
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

export const setDetails = (details) => ({
  type: "SET_DETAILS",
  details: details
});

export default connect(state => ({
  credentials: state.credentials,
  data: state.user.data,
  details: state.user.details,
  error: state.user.error,
  lang: state.language.lang,
  image: state.user.image
}), (dispatch) => ({
  actions: bindActionCreators({setUser,
                               setError,
                               removeCredentials,
                               setImage, setDetails}, dispatch)
}))(User);
