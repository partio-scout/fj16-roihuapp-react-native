'use strict';
import React, {
  Component,
  View,
  Linking,
  Text,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  TextInput,
  StyleSheet,
  Platform,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCredentials } from '../login/actions.js';
import Login from '../login/index.js';
import { config } from '../../config.js';
import { parseCredentials } from '../auth/utils.js';
import { navigationStyles } from '../../styles.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

const styles = StyleSheet.create({
  sendButton: {
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    width: 100,
    borderRadius: 10
  }
});

class EmailLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.email
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop: 60}}>
          <Text style={{textAlign: 'center'}}>
            Antamalla sähköpostiosoitteesi saat kirjautumislinkin
          </Text>
          <TextInput style={{borderColor: 'gray', borderWidth: 1, height: 40, margin: 10}}
                     value={this.state.text}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                     onSubmitEditing={() => this.props.send(this.state.text)}
                     onChangeText={(text) => this.setState({text})}/>
        </View>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <TouchableOpacity style={styles.sendButton}
                            onPress={() => this.props.send(this.state.text)}>
            <Text style={{textAlign: 'center'}}>
              Lähetä
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Auth extends Component {
  render() {
    const { credentials } = this.props;
    return (
      <View style={{flex: 1}}>{this.renderChildren(credentials)}</View>
    );
  }

  renderChildren(credentials) {
    if (credentials === null) {
      return (
        <View style={{flex: 1, width: Dimensions.get("window").width}}>
          <Navigator initialRouteStack={this.props.parentNavigator.getCurrentRoutes()}
                     navigator={this.props.parentNavigator}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    } else {
      return React.cloneElement(this.props.children,
                                {parentNavigator: this.props.parentNavigator,
                                 pushRoute: this.props.pushRoute,
                                 refreshEventEmitter: this.props.refreshEventEmitter,
                                 popRoute: this.props.popRoute});
    }
  }

  renderRootScene() {
    return (
      <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center'}
            }>
        <Image source={require('../../images/logo_white.png')}
               style={{margin: 20}}/>
        <Text style={{
                padding: 15,
                textAlign: 'center'
              }}>
          Kirjautuminen vaaditaan omien tietojen näkemiseksi
        </Text>
        <TouchableOpacity onPress={() => this.props.pushRoute({name: "partioid"}) }>
          <Text style={{
                  padding: 15,
                  textAlign: 'center',
                  fontSize: 20,
                  color: 'blue'
                }}>
            Kirjaudu PartioID:llä
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            this.props.pushRoute({name: "email"});
          }}>
          <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              Jos et ole Suomen Partiolaisten jäsen, kirjaudu
            </Text>
            <Text style={{textAlign: 'center', fontSize: 20, color: 'blue'}}>
              Sähköpostiosoitteella
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderEmailScene() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <EmailLogin email={this.props.email}
                    send={(text) => {
                      this.props.actions.setEmail(text);
                      fetch(config.apiUrl + "/RoihuUsers/emailLogin", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({email: text})
                      }).then((response) => {
                        if (response.status == 200) {
                          this.props.pushRoute({name: "email-send-success"});
                        } else {
                          this.props.pushRoute({name: "email-send-error"});
                        }
                      }).catch((error) => {
                        this.props.pushRoute({name: "email-send-error"});
                        console.log("error", error);
                      });
          }}/>
      </View>
    );
  }

  renderEmailSendSuccess() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <TouchableOpacity onPress={() => this.props.resetTo({name: "root"})}>
          <Text style={{marginLeft: 10, marginTop: 10}}>
            Palaa kirjautumisruutuun
          </Text>
        </TouchableOpacity>
        <Text style={{
                marginTop: 50,
                textAlign: 'center'
              }}>
          Tarkista sähköpostisi, löydät sieltä kirjautumislinkin!
        </Text>
      </View>
    );
  }

  renderEmailSendError() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{
                marginTop: 50,
                textAlign: 'center'
              }}>
          Lähetys epäonnistui :/
        </Text>
      </View>
    );
  }

  renderPartioIDLogin() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Login uri={config.loginUrl}
               resetRoutes={() => this.props.resetTo({name: "user-root"})}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    switch(route.name) {
    case "email":
      return this.renderEmailScene();
    case "email-send-success":
      return this.renderEmailSendSuccess();
    case "email-send-error":
      return this.renderEmailSendError();
    case "partioid":
      return this.renderPartioIDLogin();
    case "root":
    default:
      return this.renderRootScene();
    }
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const [userId, token] = parseCredentials(url);
        if (userId && token) {
          this.props.actions.setCredentials({token: token, userId: userId});
        }
      }
    });
  }
}

export const loginMethod = (
  state = {email: null},
  action) => {
    switch (action.type) {
    case "SET_EMAIL":
      return Object.assign({}, state, {email: action.email});
    }
    return state;
  };

const setEmail = (email) => ({
  type: "SET_EMAIL",
  email: email
});

export default connect(state => ({
  credentials: state.credentials,
  email: state.loginMethod.email
}), (dispatch) => ({
  actions: bindActionCreators({setCredentials, setEmail}, dispatch)
}))(Auth);
