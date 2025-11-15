import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false, 
  isCorrect = null 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const handleOptionClick = (optionIndex) => {
    if (!showResult) {
      onAnswerSelect(optionIndex);
    }
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for better pronunciation
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    } else {
      setSpeechSupported(false);
      // Show toast message
      setTimeout(() => setSpeechSupported(true), 3000);
    }
  };

  const handleAudioPlay = () => {
    const wordToSpeak = question.word || question.question;
    if (wordToSpeak) {
      speakWord(wordToSpeak);
    }
  };

  const getOptionClass = (optionIndex) => {
    let baseClass = "question-option";
    
    if (showResult) {
      // Handle both old structure (correct index) and new vocabulary structure (answer text)
      const correctIndex = question.correct !== undefined ? question.correct : 
        (question.answer ? question.choices?.indexOf(question.answer) : -1);
      
      if (optionIndex === correctIndex) {
        baseClass += " correct";
      } else if (optionIndex === selectedAnswer && optionIndex !== correctIndex) {
        baseClass += " incorrect";
      }
    } else if (selectedAnswer === optionIndex) {
      baseClass += " selected";
    }
    
    return baseClass;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card max-w-4xl mx-auto compact-question"
    >
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <span className="text-xs md:text-sm font-semibold text-gray-600 bg-pink-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm">
            {question.section === 'quantitative' ? 'كمي' : 
             question.section === 'verbal' ? 'لفظي' : 
             question.section === 'english' ? 'إنجليزي' : 
             question.section === 'vocabulary' ? 'مفردات إنجليزية' : 
             question.section === 'sentence-completion' ? 'إكمال الجمل' : 'مفردات إنجليزية'}
          </span>
          <span className="text-xs md:text-sm text-gray-500 font-medium">
            السؤال {question.id}
          </span>
        </div>
        
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <h2 
            className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-relaxed flex-1 cursor-pointer hover:text-pink-600 transition-colors"
            onClick={handleAudioPlay}
            title="اضغط للاستماع للنطق"
          >
            {question.word || question.question}
          </h2>
          {(question.section === 'vocabulary' || question.audio) && (
            <button
              onClick={handleAudioPlay}
              disabled={isPlaying}
              className="flex-shrink-0 p-2.5 md:p-3 bg-pink-100 hover:bg-pink-200 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              title="استمع للنطق"
            >
              {isPlaying ? (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
              ) : (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="compact-options">
        {(question.options || question.choices || []).map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            onClick={() => handleOptionClick(index)}
            className={getOptionClass(index)}
            disabled={showResult}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm md:text-base font-medium text-right flex-1">{option}</span>
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                {selectedAnswer === index && (
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary-600"></div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {showResult && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border-r-4 border-blue-400 rounded-lg"
        >
          <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">التفسير:</h4>
          <p className="text-blue-700 leading-relaxed text-sm md:text-base">{question.explanation}</p>
        </motion.div>
      )}

      {/* Toast message for unsupported speech synthesis */}
      {!speechSupported && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <p className="text-sm font-medium">Voice not supported on this device.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
