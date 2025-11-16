import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { Gradients, Colors, Spacing, FontSizes } from '../styles/theme';

type RootStackParamList = {
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function LoggedInHeader() {
  const navigation = useNavigation<NavigationProp>();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getCurrentUserName();
  }, []);

  async function getCurrentUserName() {
    try {
      const data = await AsyncStorage.getItem('user_data');
      if (data) {
        const userData = JSON.parse(data);
        setUserName(`${userData.firstName} ${userData.lastName}`);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  }

  async function doLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user_data');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.userAvatar}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
          </Svg>
        </LinearGradient>
        <Text style={styles.userName}>Welcome, {userName}</Text>
      </View>

      <TouchableOpacity onPress={doLogout} activeOpacity={0.7}>
        <LinearGradient
          colors={Gradients.error}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoutButton}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <Polyline points="16,17 21,12 16,7" />
            <Line x1="21" y1="12" x2="9" y2="12" />
          </Svg>
          <Text style={styles.logoutText}>Log Out</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    gap: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },
});

export default LoggedInHeader;