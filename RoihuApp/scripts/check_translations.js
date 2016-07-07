'use strict';

const fs = require('fs');
var R = require('ramda');

const findMissingTranslations = (data, lang) => R.filter((string) => new RegExp("^" + lang.toUpperCase() + ".? ").test(string), data[lang]);

if (require.main === module) {
  const strings = JSON.parse(fs.readFileSync('strings.json', 'utf8'));

  let exit = 0;
  const keyCountPerLang = R.map((lang) => Object.keys(lang).length, strings);
  if (new Set(R.values(keyCountPerLang)).size !== 1) {
    console.log("Different amount of translation keys per language!", keyCountPerLang);
    exit = 1;
  }
  const missingEn = findMissingTranslations(strings, "en");
  if (!R.isEmpty(missingEn)) {
    console.log("Missing english translations", missingEn);
    exit = 1;
  }
  const missingSv = findMissingTranslations(strings, "sv");
  if (!R.isEmpty(missingSv)) {
    console.log("Missing swedish translations", missingSv);
    exit = 1;
  }
  process.exit(exit);
}
