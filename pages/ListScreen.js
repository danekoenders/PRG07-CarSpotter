import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeContext from '../theme/themeContext';

const ListScreen = ({ route, navigation }) => {
  const [cars, setCars] = useState([]);
  const [savedCars, setSavedCars] = useState([]);

  const theme = useContext(themeContext);

  useEffect(() => {
    setCars(route.params.cars);
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

  const handleSaveCar = async (carTitle) => {
    try {
      const index = savedCars.indexOf(carTitle);
      if (index === -1) {
        // Car is not saved, add it to the saved cars list
        const updatedSavedCars = [...savedCars, carTitle];
        setSavedCars(updatedSavedCars);

        await AsyncStorage.setItem('savedCars', JSON.stringify(updatedSavedCars));
        alert('Car saved successfully!');
      } else {
        // Car is already saved, remove it from the saved cars list
        const updatedSavedCars = savedCars.filter((savedCar) => savedCar !== carTitle);
        setSavedCars(updatedSavedCars);

        await AsyncStorage.setItem('savedCars', JSON.stringify(updatedSavedCars));
        alert('Car removed from favorites!');
      }
    } catch (error) {
      console.error('Error saving car:', error);
    }
  };

  // check if the car is saved
  const isCarSaved = (carTitle) => {
    return savedCars.includes(carTitle);
  };

  // handle the click on a car item to navigate to the map
  const handleCarItemClick = (car) => {
    navigation.navigate('Map', { selectedCar: car });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

          <ScrollView style={styles.scrollView}>
            {cars.map((car, index) => (
              <View styles={styles.listView}>

              <TouchableOpacity
                key={index}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                onPress={() => handleCarItemClick(car)}
              >
                <Text style={[styles.textItem, { color: theme.color }]}>{car.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSaveCar(car.title)}
              style={[styles.itemHeartButton, { color: theme.color }]}
              >
                  <Icon
                    name={isCarSaved(car.title) ? 'heart' : 'heart-outline'}
                    size={30}
                    color={isCarSaved(car.title) ? 'red' : theme.color}
                  />
                </TouchableOpacity>
              </View>

            ))}
          </ScrollView>

        </View>
        <TouchableOpacity style={[styles.heartButton, { backgroundColor: theme.color }]} onPress={() => navigation.navigate('Saved')}>
          <Icon name="heart" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 60,
    width: '100%',
  },

  listView: {
    flex: 1,
    flexDirection: 'column',
  },

  carItem: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  itemHeartButton: {
    flex: 1,
  },

  textItem: {
    flex: 1,
    fontSize: 20,
  },

  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },
});

export default ListScreen;
