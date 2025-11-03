import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { apiClient } from '@cards/shared';

type CardScreenProps = NativeStackScreenProps<RootStackParamList, 'Cards'>;

export default function CardScreen({ navigation }: CardScreenProps) {
  const [card, setCard] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user ID - in a real app, this would come from authentication context
  const userId = 1;

  const handleAddCard = async () => {
    if (!card.trim()) return;

    try {
      const response = await apiClient.addCard(userId, card);
      
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      setCard('');
      fetchCards();
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const fetchCards = async (search = '') => {
    try {
      const response = await apiClient.searchCards(userId, search);
      
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      setCards(response.results);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cards');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cards</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cards"
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            fetchCards(text);
          }}
        />
      </View>
      <View style={styles.addCardContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new card"
          value={card}
          onChangeText={setCard}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardItem}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  addCardContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
});