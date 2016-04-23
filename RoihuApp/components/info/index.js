'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { config } from '../../config.js';
import { removeCredentials } from '../login/actions.js';

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

class Info extends Component {

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

  renderInfo() {
    const { data } = this.props;
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
              this.props.actions.setInfo({});
            }}>
            <Text style={{textAlign: 'right', margin: 10}}>
              Kirjaudu ulos
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Image source={require('../../images/saku.png')}/>
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

  render() {
    const { data, error } = this.props;
    if (!isEmpty(data)) {
      return this.renderInfo();
    } else if (error !== null) {
      return (
        <Text>error</Text>
      );
    } else {
      return (
        <Text>No info</Text>
      );
    }
  }

  fetchUserInfo(credentials) {
    fetch(config.apiUrl + "/RoihuUsers/" + credentials.userId + "?access_token=" + credentials.token)
      .then((response) => response.json())
      .then((info) => {
        this.props.actions.setInfo(info);
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

const setInfo = (data) => ({
  type: "SET_INFO",
  data: data
});

const setError = (error) => ({
  type: "SET_ERROR",
  error: error
});

export default connect(state => ({
  credentials: state.credentials,
  data: state.info.data,
  error: state.info.error
}), (dispatch) => ({
  actions: bindActionCreators({setInfo, setError, removeCredentials}, dispatch)
}))(Info);
