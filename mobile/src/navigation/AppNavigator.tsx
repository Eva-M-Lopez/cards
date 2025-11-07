import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerifyScreen from '../screens/VerifyScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import CardScreen from '../screens/CardScreen';
import LoggedInHeader from '../screens/LoggedInHeader';

// Define navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Verify: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Cards: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen 
        name="Verify" 
        component={VerifyScreen}
        options={{ title: 'Verify Email' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Forgot Password' }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      <Stack.Screen 
        name="Cards" 
        component={CardScreen}
        options={{ 
          title: 'Flashcards',
          header: () => <LoggedInHeader />,
          headerShown: true
        }}
      />
    </Stack.Navigator>
    
  );
}


export default function AppNavigator() {
  
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const userData = await AsyncStorage.getItem('user_data');
      setIsAuthenticated(!!userData);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  }

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

