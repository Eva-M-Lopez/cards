import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your pages
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import CardScreen from './src/screens/CardScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';

// Define RootStackParamList for type safety
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Cards: undefined;
  Verify: { login: string };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cards" 
          component={CardScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Verify" 
          component={VerifyScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}