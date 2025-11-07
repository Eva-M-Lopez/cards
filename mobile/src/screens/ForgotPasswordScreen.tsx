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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Line } from 'react-native-svg';
import GradientBackground from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors } from '../styles/theme';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

function ForgotPasswordScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function requestReset() {
    if (!email.trim()) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    const obj = { email: email };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(`${API_URL}/api/request-password-reset`, {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await response.json();

      if (res.error && res.error.length > 0) {
        setMessage(res.error);
      } else {
        setMessage('Reset code sent! Check your email (or backend logs for testing).');
        await AsyncStorage.setItem('reset_email', email);
        setTimeout(() => {
          navigation.navigate('ResetPassword');
        }, 2000);
      }
    } catch (error: any) {
      setMessage(error.toString());
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
                  <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <Line x1="2" y1="2" x2="22" y2="22" />
                </Svg>
              </View>
            </View>

            <Text style={commonStyles.title}>FORGOT PASSWORD</Text>

            <Text style={commonStyles.subtitle}>
              Enter your email address to receive a reset code.
            </Text>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {message ? <Text style={commonStyles.errorMessage}>{message}</Text> : null}

            <TouchableOpacity
              style={[commonStyles.primaryButton, loading && commonStyles.primaryButtonDisabled]}
              onPress={requestReset}
              disabled={loading}
            >
              <Text style={commonStyles.buttonText}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={commonStyles.backLink}>Back to Login</Text>
            </TouchableOpacity>
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

export default ForgotPasswordScreen;