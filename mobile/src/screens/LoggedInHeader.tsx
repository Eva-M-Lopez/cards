import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';

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
              // Reset navigation stack
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
        <View style={styles.userAvatar}>
          <Svg width={24} height={24} viewBox="0 0 24 24" stroke="#4A90E2" strokeWidth={2} fill="none">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
          </Svg>
        </View>
        <Text style={styles.userName}>Welcome, {userName}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={doLogout}>
        <Svg width={20} height={20} viewBox="0 0 24 24" stroke="#e74c3c" strokeWidth={2} fill="none">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <Polyline points="16,17 21,12 16,7" />
          <Line x1="21" y1="12" x2="9" y2="12" />
        </Svg>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#ffe8e8',
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default LoggedInHeader;