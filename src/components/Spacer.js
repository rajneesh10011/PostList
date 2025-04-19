import {View} from 'react-native';
import React from 'react';

const Spacer = ({height, width}) => {
  return <View style={{height, width}} />;
};

export default React.memo(Spacer);
