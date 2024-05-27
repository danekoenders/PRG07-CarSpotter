import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeContext from '../theme/themeContext';

const SavedScreen = () => {
  const [savedCars, setSavedCars] = useState([]);

  const theme = useContext(themeContext);
  
  // retrieve the saved cars from storage
  useEffect(() => {
    getSavedCars();
  }, []);

  // retrieve the saved cars from storage
  const getSavedCars = async () => {
    try {
      const savedCarsJson = await AsyncStorage.getItem('savedCars');
      if (savedCarsJson !== null) {
        setSavedCars(JSON.parse(savedCarsJson));
      }
    } catch (error) {
      console.error('Error retrieving saved cars:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.header, { color: theme.color }]}>
            Your favorites
          </Text>

          {savedCars.length > 0 ? (
            savedCars.map((car, index) => (
              <View key={index} style={{ marginBottom: 10 }} >
                <Text style={[styles.textItem, { color: theme.color }]}>{car}</Text>
              </View>
            ))
          ) : (
            <Text>No saved cars found.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 16,
  },

  textItem: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default SavedScreen;
