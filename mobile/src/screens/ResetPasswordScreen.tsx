import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path } from 'react-native-svg';
import GradientBackground from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors, Gradients } from '../styles/theme';
import { resetPassword } from '../../../shared/src/api/api';

type RootStackParamList = {
  Login: undefined;
  ResetPassword: undefined;
};

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ResetPassword'
>;

interface Props {
  navigation: ResetPasswordScreenNavigationProp;
}

function ResetPasswordScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('reset_email').then((storedEmail) => {
      if (storedEmail) {
        setEmail(storedEmail);
      }
    });
  }, []);

  async function doReset() {
    if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setMessage('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email, resetCode, newPassword);

      if (res.error && res.error.length > 0) {
        setMessage(res.error);
      } else {
        setMessage('✅ Password reset successful! Redirecting to login...');
        await AsyncStorage.removeItem('reset_email');
        setTimeout(() => {
          navigation.navigate('Login');
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
                  <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Svg>
              </View>
            </View>

            <Text style={commonStyles.title}>RESET PASSWORD</Text>

            <Text style={commonStyles.subtitle}>
              Resetting password for: <Text style={commonStyles.bold}>{email}</Text>
            </Text>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                value={resetCode}
                onChangeText={setResetCode}
                maxLength={6}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {message ? (
              <Text style={message.includes('✅') ? commonStyles.successMessage : commonStyles.errorMessage}>
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={doReset}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#a0c4e8', '#a0c4e8'] : Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resetButton}
              >
                <Text style={commonStyles.buttonText}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </LinearGradient>
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
  resetButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ResetPasswordScreen;