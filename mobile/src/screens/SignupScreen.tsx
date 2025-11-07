// mobile/src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import GradientBackground from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors } from '../styles/theme';
import { signup } from '../../../shared/src/api/api';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Verify: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

function SignupScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function doSignup() {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !login.trim() || !password.trim()) {
      setMessage('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(firstName, lastName, login, password, email);

      if (res.error && res.error.length > 0) {
        setMessage(res.error);
        return;
      }

      setMessage('✅ Account created! Redirecting to verification...');
      await AsyncStorage.setItem('pending_verification', login);

      setTimeout(() => {
        navigation.navigate('Verify');
      }, 2000);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={commonStyles.authCard}>
            <View style={commonStyles.logoContainer}>
              <View style={commonStyles.logoPlaceholder}>
                <Svg width={60} height={60} viewBox="0 0 24 24" stroke={Colors.primary} strokeWidth={2} fill="none">
                  <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <Circle cx="8.5" cy="7" r="4" />
                  <Line x1="20" y1="8" x2="20" y2="14" />
                  <Line x1="23" y1="11" x2="17" y2="11" />
                </Svg>
              </View>
            </View>

            <Text style={commonStyles.title}>CREATE ACCOUNT</Text>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={login}
                onChangeText={setLogin}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {message ? <Text style={commonStyles.errorMessage}>{message}</Text> : null}

            <TouchableOpacity
              style={[commonStyles.primaryButton, loading && commonStyles.primaryButtonDisabled]}
              onPress={doSignup}
              disabled={loading}
            >
              <Text style={commonStyles.buttonText}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={commonStyles.linkContainer}>
              <Text style={commonStyles.normalText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={commonStyles.link}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default SignupScreen;
