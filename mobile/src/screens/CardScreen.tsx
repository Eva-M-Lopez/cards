import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { commonStyles } from '../styles/commonStyles';
import { Colors, Spacing } from '../styles/theme';

function CardScreen() {
  const [message, setMessage] = useState('');
  const [studyTopic, setStudyTopic] = useState('');

  function generateFlashcards(): void {
    if (!studyTopic.trim()) {
      setMessage('Please enter a topic to study.');
      return;
    }

    // Placeholder function - not connected to any AI yet
    setMessage(`Ready to generate flashcards for: ${studyTopic}`);
    console.log('Generate flashcards clicked for topic:', studyTopic);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={commonStyles.iconContainer}>
            <View style={commonStyles.sectionIcon}>
              <Svg width={30} height={30} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
                <Path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </Svg>
            </View>
          </View>

          <Text style={commonStyles.sectionTitle}>FLASHCARD GENERATOR</Text>

          <Text style={commonStyles.instructionText}>
            What would you like to learn about?{'\n'}
            (e.g., Biology II, cell division and mitosis)
          </Text>

          <View style={commonStyles.inputGroup}>
            <TextInput
              style={commonStyles.textArea}
              placeholder="Type here..."
              placeholderTextColor="#999"
              value={studyTopic}
              onChangeText={setStudyTopic}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.generateButton} onPress={generateFlashcards}>
            <Svg width={20} height={20} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
              <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </Svg>
            <Text style={commonStyles.buttonText}>Generate Flashcards</Text>
          </TouchableOpacity>

          {message ? (
            <View style={commonStyles.resultMessage}>
              <Text style={commonStyles.resultMessageText}>{message}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 400,
  },
  generateButton: {
    backgroundColor: Colors.purple,
    padding: Spacing.md,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default CardScreen;