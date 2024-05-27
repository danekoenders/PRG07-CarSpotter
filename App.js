import * as React from 'react';
import { useState, useEffect } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EventRegister } from 'react-native-event-listeners';
import theme from './theme/theme';
import themeContext from './theme/themeContext';

import ListScreen from './pages/ListScreen';
import MapScreen from './pages/MapScreen';
import SavedScreen from './pages/SavedScreen';
import SettingsScreen from './pages/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// The bottom tab navigator
function MapStack({ cars }) {
  return (
    <Stack.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        initialParams={{ cars }}
      />
      <Stack.Screen name="Saved" component={SavedScreen} />
    </Stack.Navigator>
  );
}

// The bottom tab navigator
function ListStack({ cars }) {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="List"
        component={ListScreen}
        initialParams={{ cars }}
      />
    </Stack.Navigator>
  );
}

// The bottom tab navigator
function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// The main app component
function App() {
  const [loading, setLoading] = useState(true); // Set the initial state to 'true'
  const [cars, setCars] = useState([]);

  const getCars = async () => {
    try {
      const response = await fetch('https://stud.hosted.hr.nl/0993153/carspotter.json');
      const json = await response.json();
      setCars(json.cars);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
      setDarkMode(data)

    })
    return () => {
      EventRegister.removeAllListeners(listener)
    }
  }, [darkMode])

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <NavigationContainer theme={darkMode === true ? DarkTheme: DefaultTheme}>
        <Tab.Navigator
          initialRouteName="Feed"
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: '#0000e6' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'MapStack') {
                iconName = focused ? 'map-marker' : 'map-marker-outline';
              } else if (route.name === 'ListStack') {
                iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
              } else if (route.name === 'SettingsStack') {
                iconName = focused ? 'cog' : 'cog-outline';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="MapStack"
            component={() => <MapStack cars={cars} />}
            options={{
              tabBarLabel: 'Map',
              title: 'CarSpotter',
            }}
          />
          <Tab.Screen
            name="ListStack"
            component={() => <ListStack cars={cars} />}
            options={{
              tabBarLabel: 'List',
              title: 'List',
            }}
          />
          <Tab.Screen
            name="SettingsStack"
            component={SettingsStack}
            options={{
              tabBarLabel: 'Settings',
              title: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </themeContext.Provider>
  );
}

export default App;
