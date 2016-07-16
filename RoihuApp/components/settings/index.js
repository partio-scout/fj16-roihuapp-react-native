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
import { t, setLanguage } from '../../translations';
import { styles, categoryStyles } from '../../styles';
import DeviceInfo from 'react-native-device-info';

class Settings extends Component {
  render() {
    return (
      <View style={categoryStyles.article}>
      <ScrollView>
        <View style={categoryStyles.articleTitleContainer}>
          <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
            {t("Kieli", this.props.lang)}
          </Text>
        </View>
        <View style={categoryStyles.articleContentContainer}>
          <Picker selectedValue={this.props.lang}
                  prompt={t("Kieli", this.props.lang)}
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
            {DeviceInfo.getVersion()}{"\n"}{"\n"}{t("Versiotieto-content", this.props.lang)}
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
        <View style={[categoryStyles.articleContentContainer, styles.content]}>
          <Text style={[categoryStyles.textColor, {textAlign: 'center'}]}>
            <Text style={categoryStyles.bold}>{t("Toiminnallisuus, projektipäällikkyys", this.props.lang)}</Text>
            <Text>
              {"\n"}Sakari Kouti
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Käyttöliittymä", this.props.lang)}</Text>
            <Text>
              {"\n"}Sakari Kouti
              {"\n"}Kimmo Koskinen
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Ohjelmointi", this.props.lang)}</Text>
            <Text>
              {"\n"}Kimmo Koskinen
              {"\n"}Kalle Haavisto
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Ulkoasu", this.props.lang)}</Text>
            <Text>
              {"\n"}Henna Heikkilä (UX)
              {"\n"}Mira Moisio
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Ikonit", this.props.lang)}</Text>
            <Text>
              {"\n"}Mira Moisio
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Backend-ohjelmointi", this.props.lang)}</Text>
            <Text>
              {"\n"}Matias Turunen
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Paikka- ja kalenteri-data", this.props.lang)}</Text>
            <Text>
              {"\n"}Jaakko Honkala
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Kartta", this.props.lang)}</Text>
            <Text>
              {"\n"}Putte Huima
              {"\n"}Mia Peltoniemi
            </Text>
            {"\n"}{"\n"}
            <Text style={categoryStyles.bold}>{t("Lisäksi apuna", this.props.lang)}</Text>
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
