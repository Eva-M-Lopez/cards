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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import GradientBackground from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors, Gradients } from '../styles/theme';
import { verify } from '../../../shared/src/api/api';

type RootStackParamList = {
  Login: undefined;
  Verify: undefined;
};

type VerifyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Verify'
>;

interface Props {
  navigation: VerifyScreenNavigationProp;
}

function VerifyScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('pending_verification').then((storedLogin) => {
      if (storedLogin) setLogin(storedLogin);
    });
  }, []);

  async function doVerify() {
    if (!verificationCode.trim()) {
      setMessage('Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      const res = await verify(login, verificationCode);

      if (res.error && res.error.length > 0) {
        setMessage(res.error);
        return;
      }

      setMessage('✅ Email verified! Redirecting to login...');
      await AsyncStorage.removeItem('pending_verification');

      setTimeout(() => {
        navigation.navigate('Login');
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
                <Svg
                  width={60}
                  height={60}
                  viewBox="0 0 24 24"
                  stroke={Colors.primary}
                  strokeWidth={2}
                  fill="none"
                >
                  <Path d="M9 12l2 2 4-4" />
                  <Path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                  <Path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                  <Path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
                </Svg>
              </View>
            </View>

            <Text style={commonStyles.title}>VERIFY YOUR EMAIL</Text>

            <Text style={commonStyles.subtitle}>
              A verification code has been sent. Check the backend terminal for the code.
            </Text>

            <Text style={commonStyles.subtitle}>
              Verifying account: <Text style={commonStyles.bold}>{login}</Text>
            </Text>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={[commonStyles.input, styles.codeInput]}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                value={verificationCode}
                onChangeText={setVerificationCode}
                maxLength={6}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {message ? (
              <Text style={message.includes('✅') ? commonStyles.successMessage : commonStyles.errorMessage}>
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={doVerify}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#a0c4e8', '#a0c4e8'] : Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.verifyButton}
              >
                <Text style={commonStyles.buttonText}>
                  {loading ? 'Verifying...' : 'Verify'}
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
  codeInput: {
    textAlign: 'center',
    letterSpacing: 4,
  },
  verifyButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default VerifyScreen;