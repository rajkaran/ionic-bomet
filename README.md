# Bomet (Formerly OFF Scanner)

## Change application version / Launch new version
To create a new release on play store you would need to update version code.
* update versionCode and versionName in `sl-product-scanner\android\app\build.gradle` file.

## Debug application
* For some reason `ionic capacitor run android -l --external` can't find connected devices on Macbook. To make live-reload work from Macbook run below command and then run 'app' from Andriod Studio. `$ ionic capacitor run android -l --external --open`


## Error to tackle
* `[capacitor] ✖ Updating iOS native dependencies with pod install - failed!`. Although application will work with this issue.
* `× Running Gradle build - failed!` delete .gradle folder from android.
* Camera doesn't open instead app crashes on iOS. Add a key-value pair for `NSCameraUsageDescription` and a string to explain the usage. It is the requirement of iOS.
* WebView showing `ERR_CLEARTEXT_NOT_PERMITTED` add **android:usesCleartextTraffic="true"** in application tag in AndroidManifest.xml file
* Your device managemnet settings do not allow using apps from developer "Apple Development:rajkaran.chauhan07@gmail.com". 
    * Go to settings -> General -> Device Management. 
    * Click on Development App. 
    * Click on Trust "Apple Development: rajkaran.chauhan07@gmail.com"

## Change App icon and Splash Image
Create two images app icon and splash screen with sizes 1024X1024 and 2732X2732 respectively. Addition to these images for Android we will have to create two more images of size 432X432 each. Read more [here](https://ionicframework.com/docs/cli/commands/cordova-resources)
* Upload 4 images two in `resources` directory and other two in `resources/android` directory.
    * `resources` directory - icon.png and splash.png
    * `resources/android` directory - icon-background.png and icon-foreground.png
* Run below commands to generate different sized copies from original images
```sh
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

## Change app name
In Android
* Change app_name in `android\app\src\main\res\values\strings.xml` file.

## Debugging
chrome://inspect/#devices

> switch ruby to latest and Homebrew one chruby 3.1.2

## iOS setup
XCode - 13
Target iOS - 12
Mac OS - 11.6.5
cocoapods - 1.11.2

## Deploy
ionic build
ionic cap add android [optional - don't need if android dir exist]
ionic cap add ios [optional- don't need if ios dir exist]
ionic cap copy
ionic cap sync
for iOS only
    chruby 3.1.2
    cd ios/App
    pod install
    cd ../../
ionic cap open android
ionic cap open ios

## Create new files
* ionic g module shared --module=app.module
* ionic g module product --module=app.module --routing
* ionic g page product/search --no-module --module=product/product.module
> delete routing and module file after creating a page as `--no-module` flag isn't working properly. Add page into parent module manually as `--module flag isn't working either`.