/*import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';

const { width: viewportWidth } = Dimensions.get('window');

const images = [
  { source: require('../assets/yachts-monaco-harbor.jpg'), title: 'Image 1' },
  { source: require('../assets/mesmerizing-shot-capturing-beauty-basilica-di-santa-maria-della-salute-venice-italy.jpg'), title: 'Image 2' },
  { source: require('../assets/mesmerizing-view-silhouette-tree-savanna-plains-sunset.jpg'), title: 'Image 3' },
];

const Slideshow = () => {
  return (
      <PagerView style={{ flex: 1 }} initialPage={0}>
        {images.map(({ source, title }, index) => (
            <View style={styles.page} key={index}>
              <Image source={source} style={styles.image} />
              <Text style={styles.title}>{title}</Text>
            </View>
        ))}
      </PagerView>
  );
};

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: viewportWidth,
    height: 200,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Slideshow;*/
