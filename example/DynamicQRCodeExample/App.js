import React, {useState, Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  MultiFrameDynamicQrCodeGenerator,
  MultiFrameDynamicQrCodeScanner,
} from 'react-native-multi-frame-dynamic-qr-code';
import proofTestData from './proof-test.json';
import TOTP from './components/TOTP';

import {Colors} from 'react-native/Libraries/NewAppScreen';



const App: () => Node = () => {
  const [showAnimatedQRCode, setShowAnimatedQRCode] = useState(false);
  const [scanAnimatedQRCode, setScanAnimatedQRCode] = useState(false);
  const [useTOTP, setUseTOTP] = useState(false);

  const encriptionDecriptionKey = "sitaEncriptionSecretKey123"

  const handleScannedQRCodeData = scannedData => {
    console.log('scannedData:::::::::::::::', scannedData);
    //setScanAnimatedQRCodeResult(scannedData);
  };

  const onVerifyClick = () => {
    setShowAnimatedQRCode(!showAnimatedQRCode);
  };
  const onScanClick = () => {
    setScanAnimatedQRCode(!scanAnimatedQRCode);
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>

      {useTOTP && (<TOTP/> )}
      
      {!useTOTP &&(
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section>
              <Button
                onPress={onVerifyClick}
                title="Holder Present proof without TOTP"
                color="#008000"
              />

              {showAnimatedQRCode && (
                <MultiFrameDynamicQrCodeGenerator
                  data={proofTestData}
                  doCompress={true}
                  doEncrypt={true}
                  encriptionSecretKey= {encriptionDecriptionKey}
                />
              )}
            </Section>

            <Section>
              <Button
                onPress={onScanClick}
                title="Verifier Scan proof without TOTP"
                color="#841584"
              />
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>)}

      {scanAnimatedQRCode && (
        <MultiFrameDynamicQrCodeScanner
          showProgress={true}
          onScan={handleScannedQRCodeData}
          decompressScannedData={true}
          decryptScannedData = {true}  
          decriptionSecretKey= {encriptionDecriptionKey}
        />
      )}
     
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 0.1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 0.01,
    fontSize: 12,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '900',
  },
});

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default App;
