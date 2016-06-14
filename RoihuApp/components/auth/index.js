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
import { t } from '../../translations.js';
import { categoryStyles } from '../../styles.js';
const Icon = require('react-native-vector-icons/MaterialIcons');

const styles = StyleSheet.create({
  bigButton: {
	alignItems: 'center',
	backgroundColor: '#18A771',
	marginTop: 50,
	marginBottom: 5,
  alignSelf: 'stretch',
  height: 40,
  justifyContent: 'center'
  },
  bigButton2: {
  alignItems: 'center',
  backgroundColor: '#18A771',
  marginTop: 10,
  marginBottom: 5,
  alignSelf: 'stretch',
  height: 40,
  justifyContent: 'center'
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
        	<View style={categoryStyles.textInputContainer2}>
	          <TextInput style={categoryStyles.textInput}
	                     value={this.state.text}
	                     autoCapitalize={'none'}
	                     autoCorrect={false}
	                     onSubmitEditing={() => this.props.send(this.state.text)}
	                     onChangeText={(text) => this.setState({text})}
	                     placeholder={t("sähköpostiosoite placeholder", this.props.lang)}/>
	        </View>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <TouchableOpacity style={styles.bigButton2}
                            onPress={() => this.props.send(this.state.text)}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {t("lähetä nappi", this.props.lang)}
            </Text>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', color: 'black'}}>
              {t("E-mail kirjautumisen teksti", this.props.lang)}
          </Text>
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
                     renderScene={(route, navigator) => this.renderScene(route, navigator)}
            configureScene={() => ({
  				...Navigator.SceneConfigs.FloatFromRight,
  			  gestures: {},
			})}/>
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

  renderPartioIdLogin() {
    return (
      <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center'}
            }>
        <Text style={{
                marginTop: 40,
                marginBottom: 10,
                textAlign: 'center',
                color: 'black',
                fontWeight: 'bold',
                fontSize: 20
              }}>
          {t("login title", this.props.lang)}
        </Text>
        <View style={styles.bigButton}>
          <TouchableOpacity onPress={() => this.props.pushRoute({name: "partioid"}) }>
            <Text style={{
                    margin: 15,
                    textAlign: 'center',
                    fontSize: 20,
                    color: 'white'
                  }}>
              {t("Kirjaudu Partioid:llä", this.props.lang)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderEmailLogin() {
    return (
      <View style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center'}
            }>
      	<View style={styles.bigButton}>
	      <TouchableOpacity onPress={() => {
	          this.props.pushRoute({name: "email"});
	        }}>
		    <Text style={{
		            margin: 15,
	                  textAlign: 'center',
	                  fontSize: 20,
	                  color: 'white'
		            }}>
		        {t("Kirjaudu sähköpostiosoitteella", this.props.lang)}
		      </Text>
	        </TouchableOpacity>
        </View>
           <Text style={{
	           	   textAlign: 'center',
	           	   color: 'black'
      		     }}>
		     {t("Sähköpostillakirjautumiskäsky", this.props.lang)}
		   </Text>
      </View>
    );
  }

  renderRootScene() {
    return (
      <View>
        {this.renderPartioIdLogin()}
        {this.renderEmailLogin()}
      </View>
    );
  }

  renderEmailScene() {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <EmailLogin email={this.props.email}
                    lang={this.props.lang}
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
        <TouchableOpacity onPress={() => this.props.resetTo({name: "auth-root"})}>
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
    case "auth-root":
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
  email: state.loginMethod.email,
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators({setCredentials, setEmail}, dispatch)
}))(Auth);
