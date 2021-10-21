// main index.js

import { NativeModules } from 'react-native';
import MultiFrameDynamicQrCodeGenerator  from './components/MultiFrameDynamicQrCodeGenerator';
import MultiFrameDynamicQrCodeScanner  from './components/MultiFrameDynamicQrCodeScanner';

const { MultiFrameDynamicQrCode } = NativeModules;

export default MultiFrameDynamicQrCode;
export {MultiFrameDynamicQrCodeGenerator , MultiFrameDynamicQrCodeScanner}
