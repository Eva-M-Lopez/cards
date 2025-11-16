import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import {
  generateFlashcards,
  getFlashcardSets,
  generateTest,
  deleteFlashcardSet,
  storeTestScore,
} from '../../../shared/src/api/api';
import type { Flashcard, FlashcardSet, TestQuestion } from '../../../shared/src/api/api';
import { GradientBackground } from '../styles/GradientBackground';
import { commonStyles } from '../styles/commonStyles';
import { Colors, Spacing, FontSizes, BorderRadius, Gradients } from '../styles/theme';

export default function CardScreen() {
  // User state
  const [userId, setUserId] = useState<number | null>(null);

  // UI state
  const [message, setMessage] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'all'>('generate');
  const [allFlashcardSets, setAllFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);

  // Test state
  const [isTestMode, setIsTestMode] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestQuestion[]>([]);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const ud = JSON.parse(userData);
        setUserId(ud.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async function generateFlashcardsHandler(): Promise<void> {
    if (!studyTopic.trim()) {
      setMessage('Please enter a topic to study.');
      return;
    }

    if (!userId) {
      setMessage('User not logged in');
      return;
    }

    setIsLoading(true);
    setMessage('AI is generating flashcards... Please wait.');
    setFlashcards([]);

    try {
      const generatedFlashcards = await generateFlashcards(studyTopic.trim(), userId);
      setFlashcards(generatedFlashcards);
      setMessage(`Generated ${generatedFlashcards.length} flashcards for: ${studyTopic}`);
      setStudyTopic('');
    } catch (error) {
      setMessage('AI service temporarily unavailable. Please try again.');
      setFlashcards([]);
      console.error('Flashcard generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllFlashcardSets(): Promise<void> {
    if (!userId) return;

    try {
      const sets = await getFlashcardSets(userId);
      setAllFlashcardSets(sets);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  }

  function selectFlashcardSet(set: FlashcardSet) {
    setSelectedSet(set);
    setFlashcards(set.flashcards);
  }

  function switchTab(tab: 'generate' | 'all') {
    setActiveTab(tab);
    if (tab === 'all') {
      fetchAllFlashcardSets();
      setFlashcards([]);
      setSelectedSet(null);
    } else {
      setSelectedSet(null);
    }
    setIsTestMode(false);
    setCurrentTest([]);
    setShowResults(false);
  }

  async function generateTestHandler(setId: string) {
    if (!userId) return;

    setIsGeneratingTest(true);

    try {
      const testQuestions = await generateTest(setId, userId);
      setCurrentTest(testQuestions);
      setTestAnswers(new Array(testQuestions.length).fill(-1));
      setCurrentQuestion(0);
      setIsTestMode(true);
      setShowResults(false);
      
      // Store the selected set for test
      const setForTest = allFlashcardSets.find(set => set._id === setId);
      if (setForTest) {
        setSelectedSet(setForTest);
      }
    } catch (error) {
      setMessage('Failed to generate test. Please try again.');
      console.error('Test generation error:', error);
    } finally {
      setIsGeneratingTest(false);
    }
  }

  function selectAnswer(questionIndex: number, answerIndex: number) {
    const newAnswers = [...testAnswers];
    newAnswers[questionIndex] = answerIndex;
    setTestAnswers(newAnswers);
  }

  async function submitTest() {
    if (!userId || !selectedSet) return;

    setShowResults(true);

    const correctAnswers = testAnswers.filter(
      (answer, index) => answer === currentTest[index].correctAnswer
    ).length;
    const totalQuestions = currentTest.length;

    try {
      await storeTestScore(
        selectedSet._id,
        userId,
        Math.round((correctAnswers / totalQuestions) * 100),
        totalQuestions,
        correctAnswers
      );
    } catch (error) {
      console.error('Error storing test score:', error);
    }
  }

  async function deleteFlashcardSetHandler(setId: string) {
    if (!userId) return;

    Alert.alert(
      'Delete Flashcard Set',
      'Are you sure you want to delete this flashcard set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingSetId(setId);
            try {
              await deleteFlashcardSet(setId, userId);
              setAllFlashcardSets(allFlashcardSets.filter((set) => set._id !== setId));
              if (selectedSet?._id === setId) {
                setSelectedSet(null);
                setFlashcards([]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete flashcard set');
              console.error('Delete error:', error);
            } finally {
              setDeletingSetId(null);
            }
          },
        },
      ]
    );
  }

  function exitTest() {
    setIsTestMode(false);
    setCurrentTest([]);
    setTestAnswers([]);
    setShowResults(false);
    setCurrentQuestion(0);
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={commonStyles.wideCard}>
            {/* Header with Icon */}
            <View style={commonStyles.iconContainer}>
              <LinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={commonStyles.sectionIcon}
              >
                <Svg width={30} height={30} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
                  <Path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </Svg>
              </LinearGradient>
            </View>

            <Text style={commonStyles.sectionTitle}>FLASHCARD GENERATOR</Text>

            {/* Tab Navigation with Gradient Border */}
            <View style={styles.tabOuterContainer}>
              <LinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabGradientBorder}
              >
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tab]}
                    onPress={() => switchTab('generate')}
                  >
                    {activeTab === 'generate' ? (
                      <LinearGradient
                        colors={Gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.activeTabGradient}
                      >
                        <Text style={styles.activeTabText}>Generate</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.tabText}>Generate</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab]}
                    onPress={() => switchTab('all')}
                  >
                    {activeTab === 'all' ? (
                      <LinearGradient
                        colors={Gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.activeTabGradient}
                      >
                        <Text style={styles.activeTabText}>All Sets</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.tabText}>All Sets</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* Generate Tab */}
            {activeTab === 'generate' && !isTestMode && (
              <>
                <Text style={commonStyles.instructionText}>
                  What would you like to learn about?{'\n'}
                  (e.g., Biology II, cell division and mitosis)
                </Text>

                <View style={commonStyles.inputGroup}>
                  <TextInput
                    style={commonStyles.textArea}
                    placeholder="Type here..."
                    placeholderTextColor={Colors.textMuted}
                    value={studyTopic}
                    onChangeText={setStudyTopic}
                    multiline
                    numberOfLines={4}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  onPress={generateFlashcardsHandler}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isLoading ? ['#a0c4e8', '#a0c4e8'] : Gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Svg width={20} height={20} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
                          <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </Svg>
                        <Text style={commonStyles.buttonText}>Generate Flashcards</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {message ? (
                  <View style={commonStyles.resultMessage}>
                    <Text style={commonStyles.resultMessageText}>{message}</Text>
                  </View>
                ) : null}

                {/* Display Generated Flashcards */}
                {flashcards.length > 0 && (
                  <View style={styles.flashcardsContainer}>
                    <Text style={styles.flashcardsTitle}>Generated Flashcards</Text>
                    {flashcards.map((flashcard, index) => (
                      <View key={index} style={styles.flashcardWrapper}>
                        <LinearGradient
                          colors={Gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.flashcardGradientBorder}
                        >
                          <View style={styles.flashcard}>
                            <LinearGradient
                              colors={Gradients.primary}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.flashcardHeader}
                            >
                              <Text style={styles.flashcardNumber}>Card {index + 1}</Text>
                            </LinearGradient>
                            <View style={styles.flashcardContent}>
                              <Text style={styles.flashcardQuestion}>
                                <Text style={styles.boldText}>Q: </Text>
                                {flashcard.question}
                              </Text>
                              <Text style={styles.flashcardAnswer}>
                                <Text style={styles.boldText}>A: </Text>
                                {flashcard.answer}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* All Sets Tab */}
            {activeTab === 'all' && !isTestMode && (
              <>
                {allFlashcardSets.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No flashcard sets yet. Generate some!</Text>
                  </View>
                ) : (
                  <View style={styles.setsContainer}>
                    {allFlashcardSets.map((set) => (
                      <View key={set._id} style={styles.setCardWrapper}>
                        <LinearGradient
                          colors={Gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.setCardGradientBorder}
                        >
                          <View style={styles.setCard}>
                            <TouchableOpacity
                              style={styles.setHeader}
                              onPress={() => selectFlashcardSet(set)}
                            >
                              <View style={styles.setInfo}>
                                <Text style={styles.setTopic}>{set.topic}</Text>
                                <Text style={styles.setMeta}>
                                  {set.flashcards.length} cards • {new Date(set.createdAt).toLocaleDateString()}
                                </Text>
                                {set.highestScore !== undefined && (
                                  <Text style={styles.setScore}>Best Score: {set.highestScore}%</Text>
                                )}
                              </View>
                            </TouchableOpacity>

                            <View style={styles.setActions}>
                              <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => generateTestHandler(set._id)}
                                disabled={isGeneratingTest}
                                activeOpacity={0.7}
                              >
                                {isGeneratingTest ? (
                                  <ActivityIndicator size="small" color={Colors.primary} />
                                ) : (
                                  <>
                                    <Svg width={20} height={20} viewBox="0 0 24 24" stroke={Colors.primary} strokeWidth={2} fill="none">
                                      <Path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </Svg>
                                    <Text style={styles.actionButtonText}>Test</Text>
                                  </>
                                )}
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => deleteFlashcardSetHandler(set._id)}
                                disabled={deletingSetId === set._id}
                                activeOpacity={0.7}
                              >
                                {deletingSetId === set._id ? (
                                  <ActivityIndicator size="small" color={Colors.error} />
                                ) : (
                                  <>
                                    <Svg width={20} height={20} viewBox="0 0 24 24" stroke={Colors.error} strokeWidth={2} fill="none">
                                      <Polyline points="3,6 5,6 21,6" />
                                      <Path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                                      <Line x1="10" y1="11" x2="10" y2="17" />
                                      <Line x1="14" y1="11" x2="14" y2="17" />
                                    </Svg>
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                  </>
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    ))}
                  </View>
                )}

                {/* Display Selected Set's Flashcards */}
                {flashcards.length > 0 && selectedSet && (
                  <View style={styles.flashcardsContainer}>
                    <Text style={styles.flashcardsTitle}>Flashcards for: {selectedSet.topic}</Text>
                    {flashcards.map((flashcard, index) => (
                      <View key={index} style={styles.flashcardWrapper}>
                        <LinearGradient
                          colors={Gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.flashcardGradientBorder}
                        >
                          <View style={styles.flashcard}>
                            <LinearGradient
                              colors={Gradients.primary}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.flashcardHeader}
                            >
                              <Text style={styles.flashcardNumber}>Card {index + 1}</Text>
                            </LinearGradient>
                            <View style={styles.flashcardContent}>
                              <Text style={styles.flashcardQuestion}>
                                <Text style={styles.boldText}>Q: </Text>
                                {flashcard.question}
                              </Text>
                              <Text style={styles.flashcardAnswer}>
                                <Text style={styles.boldText}>A: </Text>
                                {flashcard.answer}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* Test Mode */}
            {isTestMode && currentTest.length > 0 && (
              <View style={styles.testContainer}>
                <View style={styles.testHeader}>
                  <Text style={styles.testTitle}>Practice Test</Text>
                  <Text style={styles.testProgress}>
                    Question {currentQuestion + 1} of {currentTest.length}
                  </Text>
                  <TouchableOpacity onPress={exitTest} activeOpacity={0.8}>
                    <LinearGradient
                      colors={Gradients.error}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.exitButton}
                    >
                      <Svg width={16} height={16} viewBox="0 0 24 24" stroke="#fff" strokeWidth={2} fill="none">
                        <Line x1="18" y1="6" x2="6" y2="18" />
                        <Line x1="6" y1="6" x2="18" y2="18" />
                      </Svg>
                      <Text style={styles.exitButtonText}>Exit Test</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {!showResults ? (
                  <>
                    <View style={styles.testQuestions}>
                      <View style={styles.testQuestion}>
                        <Text style={styles.questionText}>{currentTest[currentQuestion].question}</Text>
                        <View style={styles.answerOptions}>
                          {currentTest[currentQuestion].options.map((option, oIndex) => (
                            <TouchableOpacity
                              key={oIndex}
                              style={styles.answerOptionWrapper}
                              onPress={() => selectAnswer(currentQuestion, oIndex)}
                              activeOpacity={0.7}
                            >
                              {testAnswers[currentQuestion] === oIndex ? (
                                <LinearGradient
                                  colors={Gradients.primary}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={styles.selectedOptionGradientBorder}
                                >
                                  <View style={styles.answerOption}>
                                    <Text style={styles.optionLetterSelected}>{String.fromCharCode(65 + oIndex)}</Text>
                                    <Text style={styles.optionText}>{option}</Text>
                                  </View>
                                </LinearGradient>
                              ) : (
                                <View style={[styles.answerOption, styles.unselectedOption]}>
                                  <Text style={styles.optionLetter}>{String.fromCharCode(65 + oIndex)}</Text>
                                  <Text style={styles.optionText}>{option}</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>

                    <View style={styles.testNavigation}>
                      <TouchableOpacity
                        onPress={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={currentQuestion === 0 ? ['#d1d5db', '#d1d5db'] : Gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.navButton}
                        >
                          <Text style={styles.navButtonText}>Previous</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {currentQuestion < currentTest.length - 1 ? (
                        <TouchableOpacity
                          onPress={() => setCurrentQuestion(currentQuestion + 1)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={Gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.navButton}
                          >
                            <Text style={styles.navButtonText}>Next</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={submitTest}
                          disabled={testAnswers.includes(-1)}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={testAnswers.includes(-1) ? ['#d1d5db', '#d1d5db'] : Gradients.success}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.submitButton}
                          >
                            <Text style={styles.submitButtonText}>Submit Test</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                ) : (
                  <ScrollView style={styles.testResults}>
                    <Text style={styles.resultsTitle}>Test Results</Text>
                    <View style={styles.scoreSummary}>
                      <LinearGradient
                        colors={Gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.scoreCircle}
                      >
                        <Text style={styles.scorePercentage}>
                          {Math.round(
                            (testAnswers.filter((answer, index) => answer === currentTest[index].correctAnswer)
                              .length /
                              currentTest.length) *
                              100
                          )}
                          %
                        </Text>
                      </LinearGradient>
                      <Text style={styles.scoreText}>
                        You got{' '}
                        {testAnswers.filter((answer, index) => answer === currentTest[index].correctAnswer).length}{' '}
                        out of {currentTest.length} questions correct!
                      </Text>
                    </View>

                    <View style={styles.detailedResults}>
                      {currentTest.map((question, qIndex) => {
                        const isCorrect = testAnswers[qIndex] === question.correctAnswer;
                        return (
                          <View key={qIndex} style={styles.resultItemWrapper}>
                            <LinearGradient
                              colors={isCorrect ? Gradients.success : Gradients.error}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.resultItemGradientBorder}
                            >
                              <View style={styles.resultItem}>
                                <View style={styles.resultHeader}>
                                  <Text style={styles.questionNumber}>Question {qIndex + 1}</Text>
                                  <LinearGradient
                                    colors={isCorrect ? Gradients.success : Gradients.error}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.resultBadge}
                                  >
                                    <Text style={styles.badgeText}>{isCorrect ? '✓' : '✗'}</Text>
                                  </LinearGradient>
                                </View>
                                <Text style={styles.resultQuestion}>{question.question}</Text>
                                <Text style={styles.resultAnswer}>
                                  <Text style={styles.boldText}>Your answer: </Text>
                                  {question.options[testAnswers[qIndex]]}
                                </Text>
                                {!isCorrect && (
                                  <Text style={styles.correctAnswer}>
                                    <Text style={styles.boldText}>Correct answer: </Text>
                                    {question.options[question.correctAnswer]}
                                  </Text>
                                )}
                                <Text style={styles.explanation}>
                                  <Text style={styles.boldText}>Explanation: </Text>
                                  {question.explanation}
                                </Text>
                              </View>
                            </LinearGradient>
                          </View>
                        );
                      })}
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setTestAnswers(new Array(currentTest.length).fill(-1));
                        setCurrentQuestion(0);
                        setShowResults(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={Gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.retakeButton}
                      >
                        <Text style={commonStyles.buttonText}>Retake Test</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            )}
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
    padding: Spacing.lg,
  },
  // Tab styles with gradient border
  tabOuterContainer: {
    marginBottom: Spacing.xl,
  },
  tabGradientBorder: {
    borderRadius: BorderRadius.medium + 2,
    padding: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
  },
  activeTabGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: Colors.textLight,
    paddingVertical: Spacing.md,
    textAlign: 'center',
  },
  activeTabText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    color: '#fff',
  },
  // Gradient button
  gradientButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  // Flashcard styles with gradient border
  flashcardsContainer: {
    marginTop: Spacing.xl,
  },
  flashcardsTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  flashcardWrapper: {
    marginBottom: Spacing.md,
  },
  flashcardGradientBorder: {
    borderRadius: BorderRadius.large,
    padding: 2,
  },
  flashcard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
  },
  flashcardHeader: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  flashcardNumber: {
    color: '#fff',
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },
  flashcardContent: {
    padding: Spacing.lg,
    backgroundColor: '#fff',
  },
  flashcardQuestion: {
    fontSize: FontSizes.medium,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  flashcardAnswer: {
    fontSize: FontSizes.medium,
    color: Colors.textLight,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
  },
  emptyState: {
    padding: Spacing.xxl * 2,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FontSizes.medium,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  // Set card styles with gradient border
  setsContainer: {
    marginTop: Spacing.lg,
  },
  setCardWrapper: {
    marginBottom: Spacing.md,
  },
  setCardGradientBorder: {
    borderRadius: BorderRadius.large,
    padding: 2,
  },
  setCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
  },
  setHeader: {
    padding: Spacing.lg,
  },
  setInfo: {
    flex: 1,
  },
  setTopic: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  setMeta: {
    fontSize: FontSizes.small,
    color: Colors.textLight,
    marginBottom: 4,
  },
  setScore: {
    fontSize: FontSizes.small,
    color: Colors.success,
    fontWeight: '600',
  },
  setActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  actionButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },
  // Test styles
  testContainer: {
    marginTop: Spacing.lg,
  },
  testHeader: {
    marginBottom: Spacing.xl,
  },
  testTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  testProgress: {
    fontSize: FontSizes.regular,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    gap: Spacing.sm,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: FontSizes.regular,
    fontWeight: '600',
  },
  testQuestions: {
    marginBottom: Spacing.xl,
  },
  testQuestion: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.lg,
    lineHeight: 26,
  },
  answerOptions: {
    gap: Spacing.md,
  },
  answerOptionWrapper: {
    marginBottom: 0,
  },
  selectedOptionGradientBorder: {
    borderRadius: BorderRadius.medium,
    padding: 2,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.medium,
  },
  unselectedOption: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionLetter: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginRight: Spacing.md,
    width: 24,
  },
  optionLetterSelected: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: Spacing.md,
    width: 24,
  },
  optionText: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.text,
    lineHeight: 22,
  },
  testNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  testResults: {
    marginTop: Spacing.lg,
  },
  resultsTitle: {
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  scoreSummary: {
    alignItems: 'center',
    marginBottom: Spacing.xxl * 2,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreText: {
    fontSize: FontSizes.medium,
    color: Colors.textLight,
    textAlign: 'center',
  },
  detailedResults: {
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  resultItemWrapper: {
    marginBottom: 0,
  },
  resultItemGradientBorder: {
    borderRadius: BorderRadius.large,
    padding: 2,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  questionNumber: {
    fontSize: FontSizes.regular,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  resultBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  resultQuestion: {
    fontSize: FontSizes.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  resultAnswer: {
    fontSize: FontSizes.regular,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  correctAnswer: {
    fontSize: FontSizes.regular,
    color: Colors.success,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  explanation: {
    fontSize: FontSizes.regular,
    color: Colors.textLight,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  retakeButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
});