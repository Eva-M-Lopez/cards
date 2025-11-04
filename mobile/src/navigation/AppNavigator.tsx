// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
//import CardsScreen from '../screens/CardsScreen'; // Create this
//import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; // Create this
//import SignupScreen from '../screens/SignupScreen'; // Create this

export type RootStackParamList = {
  Login: undefined;
  Cards: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}