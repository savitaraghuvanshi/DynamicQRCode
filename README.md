# react-native-multi-frame-dynamic-qr-code

QR code has limitation of character , This library has a component which take a big blob of data in input fragment it in to smaller parts and create multi animated frames also it has custom scanner which read animated frames merge it back to big blob

### MultiFrameDynamicQrCodeGenerator

This component take a big blob of data in input , fragment it in to smaller parts , and create multi frame dynamic QR code animation .

### MultiFrameDynamicQrCodeScanner

This component scan each animated frame merge in to sequence and form scanned big blob .

### Usage

<img src="https://user-images.githubusercontent.com/211411/46581095-0c663300-ca32-11e8-8366-5d4205a6e14f.gif" width="450" valign="top" /> 
<img src="https://user-images.githubusercontent.com/211411/46581275-1db13e80-ca36-11e8-9053-325b75511883.gif" width="400" />

```
Install and link to this library then to use 


import {MultiFrameDynamicQrCodeGenerator,MultiFrameDynamicQrCodeScanner} from 'react-native-multi-frame-dynamic-qr-code';

 <MultiFrameDynamicQrCodeGenerator data={proofTestData} doCompress={true}/>
 <MultiFrameDynamicQrCodeScanner showProgress={true} decompressScannedData={true} onScan={handleScannedQRCodeData} />

Note : Only if in MultiFrameDynamicQrCodeGenerator you pass doCompress true then in MultiFrameDynamicQrCodeScanner decompressScannedData true , by default they are false .

Added example project in same folder example/DynamicQRCodeExample



To use camera you must need to :

npm install react-native-camera --save

Android :
https://github.com/react-native-camera/react-native-camera/blob/HEAD/docs/installation.md#requirements
you must ask for camera permission:

  <uses-permission android:name="android.permission.CAMERA" />

To enable video recording feature you have to add the following code to the AndroidManifest.xml:

  <uses-permission android:name="android.permission.RECORD_AUDIO"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

iOS : 
you must update Info.plist with a usage description for camera

...
<key>NSCameraUsageDescription</key>
<string>Your own description of the purpose</string>

android/app/build.gradle : with in adnroid > look for defaultConfig > inser line missingDimensionStrategy 'react-native-camera', 'general' as below
android {
...
defaultConfig {
...
missingDimensionStrategy 'react-native-camera', 'general' <-- insert this line
}
}


```
