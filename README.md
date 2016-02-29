# Tekijätilanne

Käykää täyttämässä oma tilanteenne linkissä https://partio.sharepoint.com/sites/roihu/tiimit/elamys/_layouts/15/guestaccess.aspx?guestaccesstoken=933aZ6kKT4kEeed%2fU0WecAA%2ffX6Ky94kAFWK58cxGAA%3d&docid=1c256655ec5734066921e7d18553c2c3e

# RoihuApp - React Native

Mobile application for Roihu. Targets firstly Android, but may work on iOS too.

## Development

Install tooling for React Native, following instructions here
https://facebook.github.io/react-native/docs/getting-started.html#requirements (OSX specific, need workarounds for Linux/Windows)

Install Android SDK and create an emulator (Android Virtual Device, AVD): https://facebook.github.io/react-native/docs/android-setup.html

Change to ```RoihuApp``` directory and run

    npm install

Start an emulator

    android avd

Compile and run the app

    react-native run-android
