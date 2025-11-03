import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
// Import other screens as you create them
// import CardsScreen from './screens/CardsScreen';
// import SignUpScreen from './screens/SignUpScreen';
// import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

export type RootStackParamList = {
  Login: undefined;
  Cards: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hide header for custom designs
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Add other screens as you create them */}
        {/* <Stack.Screen name="Cards" component={CardsScreen} /> */}
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
        {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}