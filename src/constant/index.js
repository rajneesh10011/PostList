import {Platform} from 'react-native';
import colors from './colors';

const font = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif-light';

const fontRegular = {fontFamily: font, fontWeight: '400'};
const fontSemiBold = {fontFamily: font, fontWeight: '700'};
const fontBold = {fontFamily: font, fontWeight: 'bold'};

const fontFamily = {
  regular: fontRegular,
  semiBold: fontSemiBold,
  bold: fontBold,
};

export {colors, fontFamily};
