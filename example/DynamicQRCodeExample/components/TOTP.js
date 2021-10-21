import React, {useState, Node, useEffect} from 'react';
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
import proofTestData from '../proof-test.json';
import {
  TOTPActivator,
  TOTPVerifier,
  disableTOTP,
  verifyTOTP,
  SecretGenerator,
  generateTOTPForUser,
  QrCodeSecretScanner,
  StorageType,
  TOTPGenerator,
} from 'sita-totp';


import {Colors} from 'react-native/Libraries/NewAppScreen';



const TOTP: () => Node = () => {
  const [showAnimatedQRCode, setShowAnimatedQRCode] = useState(false);
  const [scanAnimatedQRCode, setScanAnimatedQRCode] = useState(false);
  const [scanAnimatedQRCodeResult, setScanAnimatedQRCodeResult] =
    useState(null);

  const [enableTOTP, setEnableTOTP] = useState(false);
  const [shareSecret, setShareSecret] = useState(false);
  const [shareTOTP, setShareTOTP] = useState(false);
  const [verify, setVerify] = useState(false);
  const [scanTOTPQRCode, setscanTOTPQRCode] = useState(false);
  const [scanAnimatedQRCodeWithTOTP, setScanAnimatedQRCodeWithTOTP] =
    useState(false);

  const [proofData, setProofData] = useState(null);

  let user = 'SavitaHolder8';
  const period = 300;

  const DynamicQRCodeComponent = () => {
    const setData = async () => {
      console.log(
        'custom MultiFrameDynamicQrCodeGenerator componenent rendered',
      );
      let data = JSON.stringify(
        await addSecurity(proofTestData, user, StorageType.CACHE, period),
      );
      setProofData(data);
      console.log('JSon after set data', data);
    };
    setData();

    return (
      shareTOTP &&
      proofData && (
        <MultiFrameDynamicQrCodeGenerator data={proofData} doCompress={true} />
      )
    );
  };

  const addSecurity = async (proof, user, storageType, period) => {
    var JSONObj = {};
    let totp = await generateTOTPForUser(user, storageType, period);
    console.log('totp', totp);
    JSONObj['user'] = user;
    JSONObj['totp'] = totp;
    JSONObj['proof'] = proof;
    return JSONObj;
  };

  const handleScannedQRCodeData = scannedData => {
    console.log('scannedData:::::::::::::::', scannedData);
    setScanAnimatedQRCodeResult(scannedData);
  };

  const handleScannedQRCodeDataWithTOTP = scannedData => {
    // console.log('scannedData:::::::::::::::', scannedData);
    setScanAnimatedQRCodeResult(scannedData);

    //console.log('scannedData user:::::::::::::::', scannedData.user);

    let json = JSON.parse(JSON.parse(scannedData));
    console.log('parsed:::::::::::::::', json);

    let user = json.user;
    let totp = json.totp;
    let proof = json.proof;

    console.log('user:::::::::::::::', user);
    console.log('totp:::::::::::::::', totp);
    console.log('proof:::::::::::::::', proof);

    verifyTOTP(user, totp, StorageType.CACHE, period);
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
                onPress={() => setShareSecret(!shareSecret)}
                title="Holder Share Secret"
                color="#008000"
              />
            </Section>

            {shareSecret && (
              <Section>
                <SecretGenerator user="SavitaHolder8" />
              </Section>
            )}

            <Section>
              <Button
                onPress={() => setscanTOTPQRCode(!scanTOTPQRCode)}
                title="verifier Scan Secret"
                color="#841584"
              />
            </Section>

            <Section>
              <Button
                onPress={() => setShareTOTP(!shareTOTP)}
                title="Holder Share proof (with TOTP)"
                color="#008000"
              />
            </Section>

            {shareTOTP && (
              <Section>
                <TOTPGenerator
                  user="SavitaHolder8"
                  period={period}
                  storageType={StorageType.CACHE}
                  QRCodeComponent={DynamicQRCodeComponent}
                />
              </Section>
            )}

            <Section>
              <Button
                onPress={() =>
                  setScanAnimatedQRCodeWithTOTP(!scanAnimatedQRCodeWithTOTP)
                }
                title="Verifier Scan proof (with TOTP)"
                color="#841584"
              />
            </Section>

            <Section>
              <Button
                onPress={() => setVerify(!verify)}
                title="Verifier Verify TOTP"
                color="#841584"
              />
            </Section>

            {verify && (
              <Section title="Verifier Verify TOTP">
                <TOTPVerifier
                  user="SavitaHolder8"
                  storageType={StorageType.CACHE}
                  period={period}
                />
              </Section>
            )}

            <Section>
              <Button
                onPress={() => setEnableTOTP(!enableTOTP)}
                title="Enable 2 Factor Authentication(DB)"
                color="#0000FF"
              />
            </Section>
            {enableTOTP && (
              <Section title="Scan this qr code from google authenticator">
                <TOTPActivator
                  user="SavitaHolder8"
                  issuer="Sita"
                  period={period}
                />
              </Section>
            )}

            {enableTOTP && (
              <Section title="Enter 6 digit TOTP code from google authenticator">
                <TOTPVerifier
                  user="SavitaHolder8"
                  storageType={StorageType.DB}
                  period={period}
                />
              </Section>
            )}

            <Section>
              <Button
                onPress={() => {
                  disableTOTP('SavitaHolder8', StorageType.DB);
                  // alert('totp disabled');
                }}
                title="Disable 2 Factor Authentication(DB)"
                color="#0000FF"
                accessibilityLabel="Learn more about this purple button"
              />
            </Section>

            <Section>
              <Button
                onPress={() => {
                  disableTOTP('SavitaHolder8', StorageType.CACHE);
                  //alert('totp disabled');
                }}
                title="Disable 2 Factor Authentication(Cache)"
                color="#0000FF"
                accessibilityLabel="Learn more about this purple button"
              />
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>

      {scanTOTPQRCode && (
        <QrCodeSecretScanner onScan={handleScannedQRCodeData} />
      )}

      {scanAnimatedQRCodeWithTOTP && (
        <MultiFrameDynamicQrCodeScanner
          showProgress={true}
          decompressScannedData={true}
          onScan={handleScannedQRCodeDataWithTOTP}
        />
      )}
    </>
  );
};

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

export default TOTP;
