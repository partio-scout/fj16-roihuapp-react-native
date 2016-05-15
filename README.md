# RoihuApp - React Native

Mobile application for Roihu Finnjamboree 2016. Targets firstly Android, but may work on iOS too.

## Progress Status

The link https://partio.sharepoint.com/sites/roihu/tiimit/elamys/_layouts/15/guestaccess.aspx?guestaccesstoken=FTGwIxZVpCYVa2RGi8XYNNkVK5PJZj0Q7OLCfMAAWBY%3d&docid=0637c55097a274bf0a1c851c414f0efb3 contains the progress status for this React Native project, as well as the sibling Cordova project, and the backend project.

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

Alternatively, if the Android application is already installed, start it on the device and run (in ```RoihuApp``` directory)

    npm start

, which starts React Native Packager, after which changes are visible in the app (enable ```Live Reload``` for fast feedback).
