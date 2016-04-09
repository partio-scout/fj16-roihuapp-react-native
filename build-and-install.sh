#!/bin/bash

set -eu

cd RoihuApp
npm install
cd android/
./gradlew --daemon assembleDebug && adb install -r ./app/build/outputs/apk/app-debug.apk
cd ../../
