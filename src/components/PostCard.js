import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Spacer} from '.';
import { fontFamily, colors } from '../constant';

const postCard = ({id, imageUrl, title, description}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{uri: imageUrl}}
        style={styles.image}
        imageStyle={styles.backgroundImage}>
        <Spacer width={10} />
        <Text style={styles.id}>{`#${id}`}</Text>
      </ImageBackground>
      <Spacer height={10} />
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Spacer height={5} />
      <Text numberOfLines={3} style={styles.description}>
        {description}
      </Text>
    </View>
  );
};

export default React.memo(postCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.secondary,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 165,
    paddingVertical: 10,
    alignItems: 'flex-end',
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.42,
    shadowRadius: 4.22,
    elevation: 3,
  },
  backgroundImage: {
    borderRadius: 10,
    width: '100%',
  },
  id: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
     ...fontFamily.semiBold,
  },
  title: {
    fontSize: 16,
    color: colors.primaryText,
      ...fontFamily.semiBold,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondaryText,
     ...fontFamily.regular,
  },
});
