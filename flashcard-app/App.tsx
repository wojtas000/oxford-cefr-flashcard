import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeckProvider } from './context/DeckContext';
import { HomeScreen } from './screens/HomeScreen';
import { StudyScreen } from './screens/StudyScreen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#11111B', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#89B4FA" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DeckProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#11111B' }
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Study" component={StudyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </DeckProvider>
    </GestureHandlerRootView>
  );
}
