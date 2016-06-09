'use strict';
import React, {
  Component,
  ScrollView,
  View,
  Picker,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { t, setLanguage } from '../../translations.js';
import { categoryStyles } from '../../styles.js';


class Settings extends Component {
  render() {
    return (
      <View style={categoryStyles.article}>
      <ScrollView>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            Kieli
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <Picker selectedValue={this.props.lang}
                  prompt={"Kieli"}
                  onValueChange={(lang) => this.props.actions.setLanguage(lang)}>
            <Picker.Item label="Suomi" value="fi" />
            <Picker.Item label="Svenska" value="sv" />
            <Picker.Item label="English" value="en" />
          </Picker>
        </View>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {t("Versiotieto", this.props.lang)}
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <Text style={categoryStyles.textColor}>
            1.0{"\n"}Suomen Partiolaiset - Finlands Scouter ry
          </Text>  
        </View>         
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {t("Huomautuksia versiosta", this.props.lang)}
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <Text style={categoryStyles.textColor}>
            - Kalenteri-osio puuttuu vielä.{"\n"}
            - Tapahtumahaku-osio puuttuu vielä.{"\n"}
            - Kartta ei ole lopullinen.{"\n"}
            - Ohjeet-osion artikkelit ovat kohta vaihtumassa todellisiksi.{"\n"}
            - Paikat-osiosta puuttuu vielä paljon paikkoja.{"\n"}
            - Aktiviteetit-osio on tekstien puolesta valmis, mutta suoritusten lukumäärätietoja tulee vielä lisää.{"\n"}
            - Minä-osio näyttää vain yhden testikäyttäjän tiedot.{"\n"}
          </Text>  
        </View>         
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {t("Palaute", this.props.lang)}
          </Text>
        </View> 
        <View style={categoryStyles.articleContentContainer}>
          <Text style={categoryStyles.textColor}>
            {t("Palaute teksti", this.props.lang)}
          </Text>  
        </View> 
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {t("Tekijät", this.props.lang)}
          </Text>
        </View>  
        <View style={categoryStyles.articleContentContainer}>
          <Text style={categoryStyles.textColor}>
            <Text style={categoryStyles.bold}>Toiminnallisuus, projektipäällikkyys</Text>
            <Text>
              {"\n"}Sakari Kouti
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Käyttöliittymä</Text>
            <Text>
              {"\n"}Sakari Kouti
              {"\n"}Kimmo Koskinen
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Ohjelmointi</Text>
            <Text>
              {"\n"}Kimmo Koskinen
              {"\n"}Kalle Haavisto
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Ulkoasu</Text>
            <Text>
              {"\n"}Henna Heikkilä
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Ikonit</Text>
            <Text>
              {"\n"}Mira Moisio
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Backend-ohjelmointi</Text>
            <Text>
              {"\n"}Matias Turunen
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Paikka- ja kalenteri-data</Text>
            <Text>
              {"\n"}Jaakko Honkala
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>Lisäksi apuna</Text>
            <Text>
              {"\n"}Antti Auranen
              {"\n"}Niilo Jaakkola
              {"\n"}Atte Pohjanmaa
              {"\n"}Emil Virkki
            </Text>
          </Text>  
        </View>   
        </ScrollView>                                    
      </View>
    );
  }
}

export default connect(state => ({
  lang: state.language.lang
}), (dispatch) => ({
  actions: bindActionCreators({setLanguage}, dispatch)
}))(Settings);
