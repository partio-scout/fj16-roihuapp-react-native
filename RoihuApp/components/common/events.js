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
  if (event.subcamp != '') {
    return t("Vain alaleirille", lang) + ' ' + event.subcamp + '\n';
  } else if (event.camptroop != '') {
    return t("Vain leirilippukunnalle", lang) + ' ' + event.camptroop + '\n';
  } else {
    return '';
  }
}

function renderAgeGroups(event, lang) {
  if (event.ageGroups != '') {
    return event.ageGroups.replace('|', ', ');
  } else {
    return t("Kaikille ikäkausille", lang);
  }
}

function renderParticipantCount(event, lang) {
  return (
    <View style={calendarStyles.eventDetailContainer}>
      <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Osallistumassa", lang)}</Text>
      <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.participantCount}</Text>
    </View>
  );
}
export function renderEvent(event, lang) {
  return (
    <View style={categoryStyles.article}>
      <View style={categoryStyles.articleTitleContainer}>
        <Text style={[categoryStyles.articleTitle, categoryStyles.textColor]}>
          {event.name}
        </Text>
      </View>
      <ScrollView style={categoryStyles.articleContentContainer}>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Kenelle", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>
            {renderAudience(event, lang)}
            {renderAgeGroups(event, lang)}
          </Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Alkaa", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{moment(event.startTime).format(t("Timestamp", lang))}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Päättyy", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{moment(event.endTime).format(t("Timestamp", lang))}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Sijainti", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.grid_latitude}{event.grid_longitude}</Text>
        </View>
        <View style={calendarStyles.eventDetailContainer}>
          <Text style={[calendarStyles.eventDetailTitle, categoryStyles.textColor]}>{t("Paikka", lang)}</Text>
          <Text style={[calendarStyles.eventDetailContent, categoryStyles.textColor]}>{event.locationName}</Text>
        </View>
          <Text style={categoryStyles.textColor}>{event.description}</Text>
        <Text style={[categoryStyles.smallText, categoryStyles.textColor]}>
          {t("Viimeksi muokattu", lang)} {moment(event.lastModified).format(t("Timestamp", lang))}
        </Text>
      </ScrollView>
    </View>
  );
}

export function renderEventRow(event, navigator, selectEvent, lang, rowID) {
  return (
    <View key={"event-" + rowID} style={[categoryStyles.listItem]}>
      <TouchableOpacity style={categoryStyles.listItemTouchArea} onPress={() => {
          const route = {name: "event"};
          selectEvent(event, route);
          navigator.push(route);
        }}>
        <Text style={[categoryStyles.textColor, {flex: 1.5}]}>
          <Text>
            {moment(event.startTime).locale(lang).format("MMM DD.M.")}{"\n"}
          </Text>
          <Text>
            {moment(event.startTime).format(t("Time", lang))}
          </Text>
        </Text>
        <Text style={[categoryStyles.textColor, {flex: 4.5}]}>{event.name.slice(0,35).toUpperCase()}{event.name.length > 35 ? '...' : ''}</Text>
      </TouchableOpacity>
    </View>
  );
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

export function fetchEvents(logStart, setFetchStatus, apiPath, queryData, setData, lang, failedToFetchMessage) {
  console.log(logStart);
  const fetchParams = Object.assign({method: "GET"});
  const filterString = getQueryString(queryData, lang);
  const textSearch = (queryData.searchString !== null) ? "&textfilter=" + queryData.searchString : '';
  setFetchStatus("STARTED");
  fetch(config.apiUrl + apiPath + "?lang=" + lang.toUpperCase() + "&filter=" + filterString + textSearch, fetchParams)
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
      setFetchStatus("COMPLETED");
    })
    .catch((error) => {
      setFetchStatus("ERROR");
      console.log(error);
      Alert.alert(t("Virhe nettiyhteydessä", lang),
                  failedToFetchMessage,
                  [{text: "Ok", onPress: () => {}}]);
    });
}
