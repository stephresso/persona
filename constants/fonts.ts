import { Platform, TextStyle } from 'react-native';

/**
 * Custom fonts linked via assets/fonts + UIAppFonts.
 * iOS wants the PostScript / full name; Android wants the file base name.
 */
export const FontFamily = {
  display: Platform.select({
    ios: 'Boldonse-Regular',
    android: 'Boldonse-Regular',
    default: 'Boldonse-Regular',
  }) as string,
  body: Platform.select({
    ios: 'Manrope-Medium',
    android: 'Manrope-Medium',
    default: 'Manrope-Medium',
  }) as string,
  bodySemi: Platform.select({
    ios: 'Manrope-SemiBold',
    android: 'Manrope-SemiBold',
    default: 'Manrope-SemiBold',
  }) as string,
};

export const displayText = (extra?: TextStyle): TextStyle => ({
  fontFamily: FontFamily.display,
  ...extra,
});

export const bodyText = (extra?: TextStyle): TextStyle => ({
  fontFamily: FontFamily.body,
  ...extra,
});
