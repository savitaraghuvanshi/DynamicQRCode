import React, { useState } from "react";
import { Text, View } from "react-native";
import { RNCamera } from "react-native-camera";
import { decompress } from "compress-json";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Dimensions, StyleSheet } from "react-native";

import {
  parseFramesReducer,
  areFramesComplete,
  framesToData,
  progressOfFrames,
} from "qrloop";
import CryptoJS from "crypto-js";

const MultiFrameDynamicQrCodeScanner = ({
  showProgress = true,
  decompressScannedData = false,
  decryptScannedData = false,
  decriptionSecretKey = "changeMeSecretKey",
  onScan = (scannedData) =>
    console.log(
      "This log is in default callback function , onScan param callback function not passed in MultiFrameDynamicQrCodeScanner component , scannedData:",
      scannedData
    ),
  onQRCodeExpire = (isDataExpired) =>
    console.log(
      "This log is in default callback function , onQRCodeExpire param callback function not passed in MultiFrameDynamicQrCodeScanner component , isDataExpired:",
      isDataExpired
    ),
}) => {
  const [frames, setFrames] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleScannedQRCodeData = (event) => {
    let scannedResult = onQRCodeScan(event.data);
    if (scannedResult) {
      onScan(scannedResult);
    }
  };

  const decryptData = (data, key) => {
    var bytes = CryptoJS.AES.decrypt(data.toString(), key);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  };

  const unfoldScannedData = (scanned) => {
    let data = JSON.parse(scanned);
    data = decompressScannedData === true ? decompress(data) : data;
    data =
      decryptScannedData === true
        ? decryptData(data, decriptionSecretKey)
        : data;

    data = JSON.parse(data);
    console.log("scanned data:", data);
    
    if (checkIfDataExpired(data.expiryTime)) {
      onQRCodeExpire(true);
      return;
    }

    return JSON.stringify(data.data);
  };

  const checkIfDataExpired = (expiryTime) => {
    if(expiryTime){
    let currentTime = new Date().getTime();
    console.log("expiryTime:",expiryTime ," >> currentTime:",currentTime);   
    if (currentTime > expiryTime) {
      return true;
    }
  }
  };

  const onQRCodeScan = (data) => {
    try {
      setFrames(parseFramesReducer(frames, data));
      const framesLocal = frames;
      if (areFramesComplete(framesLocal)) {
        let scannedResult = unfoldScannedData(framesToData(frames));
        setProgress(1);
        setCameraActive(false);
        console.log("Scanning progress: ", "100%");
        return scannedResult;
      } else {
        setProgress(progressOfFrames(framesLocal));
        console.log("Scanning progress: ", progress);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const camera = () => {
    let CameraWidth = 0.9 * Dimensions.get("window").width;
    if (cameraActive === true) {
      return (
        <RNCamera
          style={[
            {
              top: 0,
              width: CameraWidth,
              height: CameraWidth,
              borderWidth: 3,
              borderStyle: "solid",
              borderColor: "#0A1C40",
              borderRadius: 3,
              alignItems: "center",
              overflow: "hidden",
              justifyContent: "center",
            },
          ]}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          onBarCodeRead={handleScannedQRCodeData}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel",
          }}
        />
      );
    }
  };

  const progressView = () => {
    let progressPercent = parseInt((progress * 100).toFixed(0));
    if (showProgress === true) {
      return (
        <AnimatedCircularProgress
          style={{ top: 90 ,alignSelf: "center", position: "absolute" }}
          size={90}
          width={3}
          fill={progressPercent}
          tintColor="green"
          backgroundColor="transparent"
        >
          {() => <Text>{progressPercent + "%"}</Text>}
        </AnimatedCircularProgress>
      );
    }
  };

  return (
    <View style={{ flex: 32 }}>
      {camera()}
      {progressView()}
    </View>
  );
};

export default MultiFrameDynamicQrCodeScanner;
