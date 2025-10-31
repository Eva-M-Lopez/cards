import React, { useState } from 'react';
function CardUI()
 {
   // User data will be needed when connecting to AI API
   // let _ud : any = localStorage.getItem('user_data');
   // let ud = JSON.parse( _ud );
   // let userId : number = ud.id;

   const [message,setMessage] = useState('');
   const [studyTopic,setStudyTopic] = React.useState('');
   
   function handleTopicChange( e: any ) : void
   {
      setStudyTopic( e.target.value );
   }

   function generateFlashcards(e:any) : void
   {
      e.preventDefault();
      
      if(!studyTopic.trim()) {
         setMessage('Please enter a topic to study.');
         return;
      }

      // Placeholder function - not connected to any AI yet
      setMessage(`Ready to generate flashcards for: ${studyTopic}`);
      console.log('Generate flashcards clicked for topic:', studyTopic);
   }

   

   return(
      <div className="cards-main-container">
         <div className="wider-card-layout">
            <div className="card-section main-generator-card">
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
                  <button type="submit" className="action-button generate-button">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                     </svg>
                     Generate Flashcards
                  </button>
               </form>
               {message && <div className="result-message">{message}</div>}
            </div>
         </div>
      </div>
   );
 }
 export default CardUI;