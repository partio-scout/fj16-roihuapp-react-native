'use strict';
import React, {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import moment from 'moment';
import { t } from '../../translations';
import { config } from '../../config';
import { calendarStyles, categoryStyles, styles } from '../../styles';


function renderAudience(event, lang) {
  if (event.subcamp !== '') {
    return t("Vain alaleirille", lang);
  } else if (event.camptroop !== '') {
    return t("Vain leirilippukunnalle", lang);
  } else {
    return t("Kaikille", lang);
  }
}

export function renderEvent(navigator, event, lang) {
  return (
    <View style={categoryStyles.article}>
      <View style={categoryStyles.articleTitleContainer}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
          {event.name}
        </Text>
      </View>
      <View style={categoryStyles.articleContentContainer}>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Kenelle", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>
            {renderAudience(event, lang)}
            {"\n"}{event.ageGroups}
          </Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Päivämäärä", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{moment(event.startTime).format(t("Timestamp", lang))}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Kellonaika", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{moment(event.startTime).format(t("Time", lang))}{moment(event.endTime).format(t("Time", lang))}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Sijainti", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.grid_latitude}{event.grid_longitude}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Paikka", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.locationName}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Osallistumassa", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.participantCount}</Text>
        </View>
        <ScrollView style={{flex: 1}}>
          <Text style={categoryStyles.textColor}>{event.description}</Text>
        </ScrollView>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>
          {t("Viimeksi muokattu", lang)} {moment(event.lastModified).format(t("Timestamp", lang))}
        </Text>
      </View>
    </View>
  );
}

export function renderEvents(event, navigator, selectEvent, lang, rowID) {
  return (
    <View key={"event-" + rowID} style={[categoryStyles.listItem]}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          const route = {name: "event"};
          selectEvent(event, route);
          navigator.push(route);
        }}>
        <Text style={[categoryStyles.textColor, {flex: 1.5}]}>
          <Text>
            {moment(event.startTime).format(t("Date", lang))}{"\n"}
          </Text>
          <Text>
            {moment(event.startTime).format(t("Time", lang))}
          </Text>
        </Text>
        <Text style={[categoryStyles.textColor, {flex: 4.5}]}>{event.name.slice(0,35).toUpperCase()}{event.name.length > 35 ? '...' : ''}</Text>
      </TouchableOpacity>
    </View>
  )
}

function getStartHour(hour) {
  return (hour <= 10) ? '0' + (hour - 1) : hour - 1;
}

function getQueryString(data, lang) {
  let queryFields = {};
  let filterString = {};

  if (data.date !== null) {
    let tomorrow = parseInt(data.date) + 1;
    let startTime = (data.startTime !== null || parseInt(data.startTime) > 0) ? "T" + getStartHour(parseInt(data.startTime)) + ":59:59.000Z" : "T00:00:00.000Z";
    let day = "2016-07-" + data.date + startTime;
    let nextDay = "2016-07-" + tomorrow + "T00:00:00.000Z";
    Object.assign(queryFields, { "startTime": { "between": [day, nextDay] }});
  }

  if (data.startTime !== null) {

  }

  if (data.ageGroup !== null) {
    Object.assign(queryFields, { "ageGroups": { "like": '%' + t(data.ageGroup, lang) + '%' }});
  }

  if (Object.keys(queryFields).length === 1) {
    filterString = { "where" : queryFields };
  } else if (Object.keys(queryFields).length > 1) {
    filterString = { "where" : { "and" : [queryFields] }};
  }

  return encodeURI(JSON.stringify(filterString));
}

export function fetchEvents(apiPath, queryData, setData, lang) {
  const fetchParams = Object.assign({method: "GET"});
  const filterString = getQueryString(queryData, lang);

  fetch(config.apiUrl + apiPath + "?lang=" + lang.toUpperCase() + "&filter=" + filterString, fetchParams)
    .then((response) => {
      switch (response.status) {
      case 304:
        console.log("cache valid");
        return Promise.resolve({cached: true});
      case 200:
        console.log("cache invalid");
      default:
        return response.json();
      }
    })
    .then((data) => {
      if (!data.cached) {
        setData(queryData, data);
      }
    })
    .catch((error) => {
      console.log(error);
      Alert.alert(t("Virhe nettiyhteydessä", lang),
                  'Tapahtumien haku epäonnistui',
                  [{text: "Ok", onPress: () => {}}]);
    });
}