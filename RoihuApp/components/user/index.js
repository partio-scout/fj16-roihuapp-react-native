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
  Alert,
  ScrollView
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
import { setView } from '../navigation/actions';

class User extends Component {

  renderKeys(data, details) {
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
        <Text style={[userStyles.value, categoryStyles.textColor]}>{details[item.key] ? details[item.key] : data[item.key]}</Text>
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
               style={{width: 71, height: 71, margin: 5}}/>
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
               style={{width: 71, height: 71, margin: 5}}/>
      );
    }
  }

  renderUser(data, details, image, navigator) {
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
        <ScrollView>
          <View style={userStyles.userContentContainer}>
            <View>
              {this.renderKeys(data, details)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case "list-image":
      return this.listImages(navigator, this.props.actions.setImage);
    case "user-root":
    default:
      return this.renderUser(this.props.data, this.props.details, this.props.image, navigator);
    }
  }

  render() {
    const { data, error } = this.props;
    if (!isEmpty(data)) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator initialRouteStack={this.props.parentNavigator.getCurrentRoutes()}
                     navigator={this.props.parentNavigator}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}
            configureScene={() => ({
  				...Navigator.SceneConfigs.FloatFromRight,
  			  gestures: {},
			})}/>
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

  reLogin() {
    this.props.actions.removeCredentials();
    this.props.actions.setView("user");
  }

  fetchUserInfo(credentials) {
    console.log("Fetching user info");
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "?access_token=" + credentials.token)
      .then((response) => {
        switch (response.status) {
        case 200:
          return response.json();
        case 401:
          Alert.alert(t("Kirjautuminen vanhentunut", this.props.lang),
                      t("Kirjaudu nähdäksesi päivitetyt tiedot", this.props.lang),
                      [{text: t("Ok", this.props.lang),
                        onPress: () => this.reLogin()}]);
          return Promise.reject("Unauthorized");
        default:
          return Promise.reject("Unknown response");
        }
      })
      .then((user) => {
        console.log("user", user);
        this.props.actions.setUser(user);
      })
      .catch((error) => {
        console.log("Error while fetching user info", error);
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
                               setImage,
                               setDetails,
                               setView}, dispatch)
}))(User);
