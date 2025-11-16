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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Line } from 'react-native-svg';
import GradientBackground from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors, Gradients } from '../styles/theme';
import { loginUser } from '../../../shared/src/api/api';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Cards: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

function LoginScreen({ navigation }: Props) {
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (!loginName.trim() || !loginPassword.trim()) {
      setMessage('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(loginName, loginPassword);

      if (res.id <= 0 || res.error) {
        setMessage(res.error || 'User/Password combination incorrect');
        return;
      }

      const user = {
        firstName: res.firstName,
        lastName: res.lastName,
        id: res.id,
      };
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      setMessage('');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Cards' }],
      });
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
                  <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <Line x1="9" y1="3" x2="9" y2="21" />
                </Svg>
              </View>
            </View>

            <Text style={commonStyles.title}>LOGIN</Text>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={loginName}
                onChangeText={setLoginName}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={commonStyles.inputGroup}>
              <TextInput
                style={commonStyles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={loginPassword}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {message ? <Text style={commonStyles.errorMessage}>{message}</Text> : null}

            <TouchableOpacity
              onPress={doLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#a0c4e8', '#a0c4e8'] : Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}
              >
                <Text style={commonStyles.buttonText}>
                  {loading ? 'Logging in...' : 'Log in'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.additionalLinks}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={commonStyles.link}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={commonStyles.linkContainer}>
                <Text style={commonStyles.normalText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={commonStyles.link}>Sign Up</Text>
                </TouchableOpacity>
              </View>
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
  loginButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  additionalLinks: {
    alignItems: 'center',
  },
});

export default LoginScreen;