import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {fontFamily, colors} from '../constant';

const Header = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 1.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    color: colors.primaryText,
    ...fontFamily.semiBold,
  },
});
