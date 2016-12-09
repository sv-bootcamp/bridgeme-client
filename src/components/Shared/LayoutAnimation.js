const animationStyle = (props) => {
  const { layout, position, scene } = props;
  const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';
  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const width = layout.initWidth;
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 0.5],
  });

  const scale = position.interpolate({
    inputRange,
    outputRange: [1, 1, 0.95],
  });

  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'fade':
      translateX = 0;
      translateY = 0;
      break;
    case 'horizontal':
      translateX = position.interpolate({
        inputRange,
        outputRange: [width, 0, 0],
      });
      break;
    case 'vertical':
      translateY = position.interpolate({
        inputRange,
        outputRange: [height, 0, 0],
      });
      break;
  }
};

export default animationStyle;
