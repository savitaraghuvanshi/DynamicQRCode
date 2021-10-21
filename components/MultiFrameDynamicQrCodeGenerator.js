import React, { useState, useEffect } from "react";
import { useWindowDimensions, ActivityIndicator , StyleSheet} from "react-native";
import AnimatedQR from "./AnimatedQR";
import { dataToFrames } from "qrloop";
import { compress } from "compress-json";
import CryptoJS from "crypto-js";

const MultiFrameDynamicQrCodeGenerator = ({
  data,
  doCompress = false,
  doEncrypt = false,
  encriptionSecretKey = "changeMeSecretKey",
  dataSizeInEachFrame = 150,
  loopsToReplayFrame = 4,
  expiryDurationInMillseconds, 
}) => {
  const [frames, setFrames] = useState([]);
  const WINDOW_WIDTH = useWindowDimensions().width;
  const WINDOW_HEIGHT = useWindowDimensions().height;
  const QRCodeSize = Math.round(0.75 * Math.min(WINDOW_HEIGHT, WINDOW_WIDTH));
  const quietZone = 20;

  useEffect(() => {
    const prepareData = async (qrCodeData) => {
      let currentTime = new Date().getTime();
      let data
      if(expiryDurationInMillseconds){
      data = {
        data: qrCodeData,
        expiryTime: currentTime + expiryDurationInMillseconds, 
      };
    }else{
      data = {
        data: qrCodeData        
      };
    }

      data =
        doEncrypt === true
          ? CryptoJS.AES.encrypt(
              JSON.stringify(data),
              encriptionSecretKey
            ).toString()
          : data;
      data = doCompress === true ? compress(data) : data;
      return JSON.stringify(data);
    };
    const setDataFrames = async (preparedData, dataSizeInEachFrame, loopsToReplayFrame) => {
      setFrames(dataToFrames(preparedData, dataSizeInEachFrame, loopsToReplayFrame));
    }

    const convertDataToFrames = async() => {
      let preparedData = await prepareData(data);     
      var time = new Date().getSeconds();
      await setDataFrames(preparedData, dataSizeInEachFrame, loopsToReplayFrame)  
      alert("time in dataToframes : "+(new Date().getSeconds()-time) )
    };
    convertDataToFrames();
  }, []);

  return (frames && frames.length > 0 ) ?
    <AnimatedQR frames={frames} size={QRCodeSize} quietZone={quietZone} />    
    : 
    <ActivityIndicator style={[ActivityIndicatorStyles.container]} color="green"/>  
};

const ActivityIndicatorStyles = StyleSheet.create({
  container: {
    height: 220,
    width: 220,
    alignSelf: 'center',
    paddingTop: 20 ,

  }
});
export default MultiFrameDynamicQrCodeGenerator;
