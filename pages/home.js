import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import Slideshow from '../Components/slideCompo';
import DateTimePicker from '@react-native-community/datetimepicker';
import Search from "../Components/Search";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Search/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
