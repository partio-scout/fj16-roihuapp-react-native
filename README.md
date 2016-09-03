# RoihuApp - React Native

Mobile application for Roihu Finnjamboree 2016. Targets both Android and iOS.

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
