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
import { renderBackButton } from '../../utils.js';
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

var _navigator;

if (Platform.OS === 'android') {
  BackAndroid.addEventListener('hardwareBackPress', () => {
    if (!_navigator) {
      return false;
    }
    if (_navigator.getCurrentRoutes().length === 1  ) {
      return false;
    }
    _navigator.pop();
    return true;
  });
}

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
          <TextInput value={this.state.text}
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
          <Navigator initialRoute={{name: "root"}}
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}/>
        </View>
      );
    } else {
      return (
        this.props.children
      );
    }
  }

  renderRootScene(navigator) {
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
        <TouchableOpacity onPress={() => navigator.push({name: "partioid"}) }>
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
            navigator.push({name: "email"});
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

  renderEmailScene(navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {renderBackButton(navigator)}
        <EmailLogin email={this.props.email}
                    send={(text) => {
                      this.props.actions.setEmail(text);
                      fetch(config.apiUrl + "/emailLogin", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({email: text})
                      }).then((response) => {
                        if (response.status == 200) {
                          navigator.push({name: "email-send-success"});
                        } else {
                          navigator.push({name: "email-send-error"});
                        }
                      }).catch((error) => {
                        navigator.push({name: "email-send-error"});
                        console.log("error", error);
                      });
          }}/>
      </View>
    );
  }

  renderEmailSendSuccess(navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <TouchableOpacity onPress={() => navigator.popToTop()}>
          <Text>
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

  renderEmailSendError(navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <TouchableOpacity onPress={() => navigator.pop()}>
          <View style={[navigationStyles.backButton, {flexDirection: 'row', alignItems: 'center'}]}>
            <Icon name="arrow-back" size={30} color="#000000"/>
            <Text>Lähetä uudelleen</Text>
          </View>
        </TouchableOpacity>
        <Text style={{
                marginTop: 50,
                textAlign: 'center'
              }}>
          Lähetys epäonnistui :/
        </Text>
      </View>
    );
  }

  renderPartioIDLogin(navigator) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {renderBackButton(navigator)}
        <Login uri={config.loginUrl}/>
      </View>
    );
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    switch(route.name) {
    case "email":
      return this.renderEmailScene(navigator);
    case "email-send-success":
      return this.renderEmailSendSuccess(navigator);
    case "email-send-error":
      return this.renderEmailSendError(navigator);
    case "partioid":
      return this.renderPartioIDLogin(navigator);
    case "root":
    default:
      return this.renderRootScene(navigator);
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
