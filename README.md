# RoihuApp - React Native

Mobile application for Roihu Finnjamboree 2016. Targets both Android and iOS.

## Development

Install tooling for React Native, following instructions here
https://facebook.github.io/react-native/docs/getting-started.html

Install Android SDK and create an emulator (Android Virtual Device, AVD): https://facebook.github.io/react-native/docs/android-setup.html

Change to ```RoihuApp``` directory and run

    npm install

Start an emulator

    android avd

Compile and run the app

    react-native run-android

Alternatively, if the Android application is already installed, start it on the device and run (in ```RoihuApp``` directory)

    npm start

which starts React Native Packager, after which changes are visible in the app (enable ```Live Reload``` for fast feedback).

For starting the app in iOS simulator use

    react-native run-ios

## Running the server (and connecting to it)

Clone the server repository at https://github.com/partio-scout/fj16-roihuapp-backend, make sure PostgreSQL is installed.
Change to the root of the repository and install dependencies with:

    npm install

Start the server with

    NODE_ENV=dev npm start

This allows API browsing at http://0.0.0.0:3000/explorer/

Configure `baseUrl` in `RoihuApp/config.js` so that it points to the server.
