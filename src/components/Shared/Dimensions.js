import { Dimensions } from 'react-native';

export const refDimensions = {
  width: 375,
  height: 667,
};
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const dimensions = {
  width: WIDTH,
  height: HEIGHT,
  widthWeight: WIDTH / refDimensions.width,
  heightWeight: HEIGHT / refDimensions.height,
  fontWeight: (WIDTH / refDimensions.width < HEIGHT / refDimensions.height) ?
            WIDTH / refDimensions.width : HEIGHT / refDimensions.height,
};
