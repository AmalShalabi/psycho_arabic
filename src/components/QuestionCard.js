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

  const handleOptionClick = (optionIndex) => {
    if (!showResult) {
      onAnswerSelect(optionIndex);
    }
  };

  const handleAudioPlay = () => {
    if (question.audio) {
      const audio = new Audio(question.audio);
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
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
      className="card max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span className="text-xs md:text-sm font-medium text-secondary-600 bg-secondary-100 px-2 md:px-3 py-1 rounded-full">
            {question.section === 'quantitative' ? 'كمي' : 
             question.section === 'verbal' ? 'لفظي' : 
             question.section === 'english' ? 'إنجليزي' : 
             question.section === 'vocabulary' ? 'مفردات إنجليزية' : 'مفردات إنجليزية'}
          </span>
          <span className="text-xs md:text-sm text-secondary-500">
            السؤال {question.id}
          </span>
        </div>
        
        <div className="flex items-start justify-between gap-2 md:gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-secondary-800 leading-relaxed flex-1">
            {question.question}
          </h2>
          {question.audio && (
            <button
              onClick={handleAudioPlay}
              disabled={isPlaying}
              className="flex-shrink-0 p-2 bg-primary-100 hover:bg-primary-200 rounded-lg transition-colors disabled:opacity-50"
              title="استمع للنطق"
            >
              {isPlaying ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
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
              <span className="text-sm md:text-lg font-medium text-right flex-1">{option}</span>
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
    </motion.div>
  );
};

export default QuestionCard;
