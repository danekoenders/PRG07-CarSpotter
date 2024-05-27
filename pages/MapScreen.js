import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import themeContext from '../theme/themeContext';

const MapScreen = ({ route, navigation }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  // Retrieve the theme from the context
  const theme = useContext(themeContext);

  // Retrieve the cars from the route parameters and set them in the state
  useEffect(() => {
    setCars(route.params.cars);
  }, []);

  // handle the click on a car item to navigate to the map
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
    })();
  }, []);

  useEffect(() => {
    // Retrieve the selected car from the route parameters and set it in the state
    if (route.params && route.params.selectedCar) {
      setSelectedCar(route.params.selectedCar);
    }
  }, [route.params]);

  useEffect(() => {
    // When the selected car changes, focus the map on the selected car's marker
    if (selectedCar) {
      // Assuming your car object has `latitude` and `longitude` properties.
      const { latitude, longitude } = selectedCar;
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  }, [selectedCar]);

  // Create a reference to the map
  const mapRef = React.useRef(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.view}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={{
              latitude: 51.91972,
              longitude: 4.47778,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            showsUserLocation={true}
            onUserLocationChange={(e) => {
              e.nativeEvent;
            }}
          >
            {cars.map((car, index) => (
              <Marker
                key={index}
                coordinate={{
                  title: car.title,
                  description: car.description,
                  latitude: car.latitude,
                  longitude: car.longitude,
                }}

                // Make the marker clickable
                onPress={() => setSelectedCar(car)}
              />
            ))}
          </MapView>

          <TouchableOpacity style={[styles.heartButton, { backgroundColor: theme.color }]} onPress={() => navigation.navigate('Saved')}>
            <Icon name="heart" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },

  view: {
    flex: 1,
    padding: 0,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
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

export default MapScreen;
