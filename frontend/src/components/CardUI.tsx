import React, { useState } from 'react';
function CardUI()
 {
   // Get user data for storing flashcards
   let _ud : any = localStorage.getItem('user_data');
   let ud = JSON.parse( _ud );
   let userId : number = ud.id;

   const [message,setMessage] = useState('');
   const [studyTopic,setStudyTopic] = React.useState('');
   const [flashcards,setFlashcards] = useState<any[]>([]);
   const [isLoading,setIsLoading] = useState(false);
   const [activeTab,setActiveTab] = useState('generate');
   const [allFlashcardSets,setAllFlashcardSets] = useState<any[]>([]);
   const [selectedSet,setSelectedSet] = useState<any>(null);
   
   // Test related state
   const [isTestMode,setIsTestMode] = useState(false);
   const [currentTest,setCurrentTest] = useState<any[]>([]);
   const [testAnswers,setTestAnswers] = useState<number[]>([]);
   const [currentQuestion,setCurrentQuestion] = useState(0);
   const [showResults,setShowResults] = useState(false);
   const [isGeneratingTest,setIsGeneratingTest] = useState(false);
   const [deletingSetId,setDeletingSetId] = useState<string | null>(null);
   
   function handleTopicChange( e: any ) : void
   {
      setStudyTopic( e.target.value );
   }

   async function generateFlashcards(e:any) : Promise<void>
   {
      e.preventDefault();
      
      if(!studyTopic.trim()) {
         setMessage('Please enter a topic to study.');
         return;
      }

      setIsLoading(true);
      setMessage('AI is generating flashcards... Please wait.');
      setFlashcards([]);

      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-flashcards`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ topic: studyTopic.trim(), userId: userId })
         });

         if (response.ok) {
            const generatedFlashcards = await response.json();
            setFlashcards(generatedFlashcards);
            setMessage(`Generated ${generatedFlashcards.length} flashcards for: ${studyTopic}`);
            setStudyTopic(''); // Clear the input after success
         } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.error}`);
            setFlashcards([]);
         }
      } catch (error) {
         setMessage('AI service temporarily unavailable. Please try again.');
         setFlashcards([]);
         console.error('Flashcard generation error:', error);
      } finally {
         setIsLoading(false);
      }
   }

   async function fetchAllFlashcardSets() : Promise<void>
   {
      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-flashcard-sets`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: userId })
         });

         if (response.ok) {
            const sets = await response.json();
            setAllFlashcardSets(sets);
         } else {
            console.error('Failed to fetch flashcard sets');
         }
      } catch (error) {
         console.error('Error fetching flashcard sets:', error);
      }
   }

   function selectFlashcardSet(set: any) {
      setSelectedSet(set);
      setFlashcards(set.flashcards);
   }

   function switchTab(tab: string) {
      setActiveTab(tab);
      if (tab === 'all') {
         fetchAllFlashcardSets();
         setFlashcards([]);
         setSelectedSet(null);
      } else {
         setSelectedSet(null);
      }
      // Exit test mode when switching tabs
      setIsTestMode(false);
      setCurrentTest([]);
      setShowResults(false);
   }

   async function generateTest(setId: string) {
      setIsGeneratingTest(true);
      
      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-test`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ setId: setId, userId: userId })
         });

         if (response.ok) {
            const testQuestions = await response.json();
            setCurrentTest(testQuestions);
            setTestAnswers(new Array(testQuestions.length).fill(-1));
            setCurrentQuestion(0);
            setIsTestMode(true);
            setShowResults(false);
         } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.error}`);
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
      setShowResults(true);
      
      // Calculate score and store it
      const correctAnswers = testAnswers.filter((answer, index) => answer === currentTest[index].correctAnswer).length;
      const totalQuestions = currentTest.length;
      
      try {
         // Store the test score in the database
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store-test-score`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
               setId: selectedSet?._id, 
               userId: userId, 
               score: Math.round((correctAnswers / totalQuestions) * 100),
               totalQuestions: totalQuestions,
               correctAnswers: correctAnswers
            })
         });

         if (response.ok) {
            // Refresh the flashcard sets to show updated progress
            fetchAllFlashcardSets();
         }
      } catch (error) {
         console.error('Error storing test score:', error);
      }
   }

   function exitTest() {
      setIsTestMode(false);
      setCurrentTest([]);
      setTestAnswers([]);
      setCurrentQuestion(0);
      setShowResults(false);
   }

   async function deleteFlashcardSet(setId: string) {
      if (!confirm('Are you sure you want to delete this flashcard set? This action cannot be undone.')) {
         return;
      }
      
      setDeletingSetId(setId);
      
      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-flashcard-set`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ setId: setId, userId: userId })
         });

         if (response.ok) {
            // Refresh the flashcard sets list
            fetchAllFlashcardSets();
            // Clear selected set if it was the deleted one
            if (selectedSet && selectedSet._id === setId) {
               setSelectedSet(null);
               setFlashcards([]);
            }
            setMessage('Flashcard set deleted successfully.');
         } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.error}`);
         }
      } catch (error) {
         setMessage('Failed to delete flashcard set. Please try again.');
         console.error('Delete error:', error);
      } finally {
         setDeletingSetId(null);
      }
   }

   

   return(
      <div className="cards-main-container">
         <div className="wider-card-layout">
            <div className="card-section main-generator-card">
               {/* Tab Navigation */}
               <div className="tab-navigation">
                  <button 
                     className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
                     onClick={() => switchTab('generate')}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                     </svg>
                     Generate Cards
                  </button>
                  <button 
                     className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                     onClick={() => switchTab('all')}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                     </svg>
                     All Cards
                  </button>
               </div>

               {/* Generate Tab Content */}
               {activeTab === 'generate' && (
                  <>
                     <div className="section-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                     </div>
                     <h2 className="section-title">FLASHCARD GENERATOR</h2>
               <p className="instruction-text">
                  What would you like to learn about?
                  <br />(e.g., Biology II, cell division and mitosis)
               </p>
               
               <form onSubmit={generateFlashcards}>
                  <div className="input-group">
                     <textarea 
                        className="study-topic-input"
                        placeholder="Type here..."
                        value={studyTopic}
                        onChange={handleTopicChange}
                        rows={3}
                     />
                  </div>
                  <button type="submit" className="action-button generate-button" disabled={isLoading}>
                     {isLoading ? (
                        <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                        </svg>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                     )}
                     {isLoading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
               </form>
               {message && <div className="result-message">{message}</div>}
               
                     {/* Display Generated Flashcards */}
                     {flashcards.length > 0 && (
                        <div className="flashcards-container">
                           <h3 className="flashcards-title">
                              {selectedSet ? `Flashcards for: ${selectedSet.topic}` : 'Your AI-Generated Flashcards'}
                           </h3>
                           {flashcards.map((flashcard, index) => (
                              <div key={index} className="flashcard">
                                 <div className="flashcard-header">
                                    <span className="flashcard-number">Card {index + 1}</span>
                                 </div>
                                 <div className="flashcard-question">
                                    <strong>Q:</strong> {flashcard.question}
                                 </div>
                                 <div className="flashcard-answer">
                                    <strong>A:</strong> {flashcard.answer}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </>
               )}

               {/* All Cards Tab Content */}
               {activeTab === 'all' && (
                  <>
                     <div className="section-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                           <polyline points="14,2 14,8 20,8"></polyline>
                           <line x1="16" y1="13" x2="8" y2="13"></line>
                           <line x1="16" y1="17" x2="8" y2="17"></line>
                           <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                     </div>
                     <h2 className="section-title">ALL FLASHCARD SETS</h2>
                     
                     {allFlashcardSets.length === 0 ? (
                        <div className="no-sets-message">
                           <p>No flashcard sets found. Generate some flashcards to get started!</p>
                        </div>
                     ) : (
                        <div className="sets-list">
                           {allFlashcardSets.map((set, index) => (
                              <div 
                                 key={index} 
                                 className={`set-item ${selectedSet && selectedSet._id === set._id ? 'selected' : ''}`}
                              >
                                 <div className="set-info-container">
                                    <div className="progress-ring-container">
                                       <div className="progress-ring">
                                          <svg className="progress-ring-svg" width="50" height="50" viewBox="0 0 50 50">
                                             <circle
                                                className="progress-ring-circle-bg"
                                                stroke="#e9ecef"
                                                strokeWidth="4"
                                                fill="transparent"
                                                r="21"
                                                cx="25"
                                                cy="25"
                                             />
                                             <circle
                                                className="progress-ring-circle"
                                                stroke="#28a745"
                                                strokeWidth="4"
                                                fill="transparent"
                                                r="21"
                                                cx="25"
                                                cy="25"
                                                strokeDasharray={`${2 * Math.PI * 21}`}
                                                strokeDashoffset={`${2 * Math.PI * 21 * (1 - (set.highestScore || 0) / 100)}`}
                                             />
                                          </svg>
                                          <div className="progress-ring-text">
                                             {set.highestScore || 0}%
                                          </div>
                                       </div>
                                    </div>
                                    <div 
                                       className="set-info" 
                                       onClick={() => selectFlashcardSet(set)}
                                       style={{ cursor: 'pointer', flex: 1 }}
                                    >
                                       <h4 className="set-topic">{set.topic}</h4>
                                       <p className="set-details">
                                          {set.cardCount} cards • {new Date(set.createdAt).toLocaleDateString()}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="set-actions">
                                    <button 
                                       className="test-me-button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          generateTest(set._id);
                                       }}
                                       disabled={isGeneratingTest}
                                    >
                                       {isGeneratingTest ? (
                                          <svg className="loading-spinner-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                                          </svg>
                                       ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.9 0 3.66.59 5.11 1.59"></path>
                                          </svg>
                                       )}
                                       {isGeneratingTest ? 'Generating...' : 'Test Me'}
                                    </button>
                                    <button 
                                       className="delete-set-button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          deleteFlashcardSet(set._id);
                                       }}
                                       disabled={deletingSetId === set._id}
                                       title="Delete flashcard set"
                                    >
                                       {deletingSetId === set._id ? (
                                          <svg className="loading-spinner-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                                          </svg>
                                       ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                             <polyline points="3,6 5,6 21,6"></polyline>
                                             <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                             <line x1="10" y1="11" x2="10" y2="17"></line>
                                             <line x1="14" y1="11" x2="14" y2="17"></line>
                                          </svg>
                                       )}
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Display Selected Set's Flashcards */}
                     {flashcards.length > 0 && selectedSet && !isTestMode && (
                        <div className="flashcards-container">
                           <h3 className="flashcards-title">Flashcards for: {selectedSet.topic}</h3>
                           {flashcards.map((flashcard, index) => (
                              <div key={index} className="flashcard">
                                 <div className="flashcard-header">
                                    <span className="flashcard-number">Card {index + 1}</span>
                                 </div>
                                 <div className="flashcard-question">
                                    <strong>Q:</strong> {flashcard.question}
                                 </div>
                                 <div className="flashcard-answer">
                                    <strong>A:</strong> {flashcard.answer}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Test Mode Interface */}
                     {isTestMode && currentTest.length > 0 && (
                        <div className="test-container">
                           <div className="test-header">
                              <h3 className="test-title">Practice Test</h3>
                              <div className="test-progress">
                                 Question {currentQuestion + 1} of {currentTest.length}
                              </div>
                              <button className="exit-test-button" onClick={exitTest}>
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                 </svg>
                                 Exit Test
                              </button>
                           </div>

                           {!showResults ? (
                              <div className="test-questions">
                                 {currentTest.map((question, qIndex) => (
                                    <div key={qIndex} className="test-question" style={{display: qIndex === currentQuestion ? 'block' : 'none'}}>
                                       <h4 className="question-text">{question.question}</h4>
                                       <div className="answer-options">
                                          {question.options.map((option: string, oIndex: number) => (
                                             <button
                                                key={oIndex}
                                                className={`answer-option ${testAnswers[qIndex] === oIndex ? 'selected' : ''}`}
                                                onClick={() => selectAnswer(qIndex, oIndex)}
                                             >
                                                <span className="option-letter">{String.fromCharCode(65 + oIndex)}</span>
                                                <span className="option-text">{option}</span>
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 ))}

                                 <div className="test-navigation">
                                    <button 
                                       className="nav-button prev-button"
                                       onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                       disabled={currentQuestion === 0}
                                    >
                                       Previous
                                    </button>
                                    
                                    {currentQuestion < currentTest.length - 1 ? (
                                       <button 
                                          className="nav-button next-button"
                                          onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                       >
                                          Next
                                       </button>
                                    ) : (
                                       <button 
                                          className="nav-button submit-button"
                                          onClick={submitTest}
                                          disabled={testAnswers.includes(-1)}
                                       >
                                          Submit Test
                                       </button>
                                    )}
                                 </div>
                              </div>
                           ) : (
                              <div className="test-results">
                                 <h4 className="results-title">Test Results</h4>
                                 <div className="score-summary">
                                    <div className="score-circle">
                                       {Math.round((testAnswers.filter((answer, index) => answer === currentTest[index].correctAnswer).length / currentTest.length) * 100)}%
                                    </div>
                                    <p className="score-text">
                                       You got {testAnswers.filter((answer, index) => answer === currentTest[index].correctAnswer).length} out of {currentTest.length} questions correct!
                                    </p>
                                 </div>

                                 <div className="detailed-results">
                                    {currentTest.map((question, qIndex) => {
                                       const isCorrect = testAnswers[qIndex] === question.correctAnswer;
                                       return (
                                          <div key={qIndex} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                             <div className="result-header">
                                                <span className="question-number">Question {qIndex + 1}</span>
                                                <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                                                   {isCorrect ? '✓' : '✗'}
                                                </span>
                                             </div>
                                             <p className="result-question">{question.question}</p>
                                             <p className="result-answer">
                                                <strong>Your answer:</strong> {question.options[testAnswers[qIndex]]}
                                             </p>
                                             {!isCorrect && (
                                                <p className="correct-answer">
                                                   <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                                                </p>
                                             )}
                                             <p className="explanation">
                                                <strong>Explanation:</strong> {question.explanation}
                                             </p>
                                          </div>
                                       );
                                    })}
                                 </div>

                                 <button className="retake-test-button" onClick={() => {
                                    setTestAnswers(new Array(currentTest.length).fill(-1));
                                    setCurrentQuestion(0);
                                    setShowResults(false);
                                 }}>
                                    Retake Test
                                 </button>
                              </div>
                           )}
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
   );
 }
 export default CardUI;