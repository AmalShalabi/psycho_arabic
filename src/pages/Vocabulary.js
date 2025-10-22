import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import questionsData from '../data/questions.json';

const Vocabulary = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [vocabularyQuestions, setVocabularyQuestions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [answers, setAnswers] = useState({});

  // Initialize vocabulary questions in sequential order
  useEffect(() => {
    // Get vocabulary questions and sort by ID to ensure sequential order
    const vocabQuestions = [...questionsData.vocabulary].sort((a, b) => a.id - b.id);
    setVocabularyQuestions(vocabQuestions);
    setStartTime(Date.now());
  }, []);

  // Timer effect
  useEffect(() => {
    if (startTime && !showResult) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, showResult]);

  const handleAnswerSelect = (answerIndex) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
      
      // Immediately show result and disable further selections
      const currentQuestion = vocabularyQuestions[currentQuestionIndex];
      const correctIndex = currentQuestion.answer ? 
        currentQuestion.choices?.indexOf(currentQuestion.answer) : -1;
      const isCorrect = answerIndex === correctIndex;
      
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      // Store answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answerIndex
      }));
      
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < vocabularyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || null);
      setShowResult(false);
    } else {
      // Vocabulary practice completed
      const results = {
        score: score,
        timeSpent: timeSpent,
        questions: vocabularyQuestions,
        answers: answers,
        completedAt: new Date().toISOString(),
        type: 'vocabulary'
      };
      localStorage.setItem('vocabularyResults', JSON.stringify(results));
      navigate('/results?type=vocabulary');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setTimeSpent(0);
    setAnswers({});
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (vocabularyQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = vocabularyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === vocabularyQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
              <div className="text-xs md:text-sm text-secondary-600">
                {formatTime(timeSpent)}
              </div>
              <div className="text-xs md:text-sm text-secondary-600">
                {currentQuestionIndex + 1} من {vocabularyQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          isCorrect={selectedAnswer === (currentQuestion.answer ? 
            currentQuestion.choices?.indexOf(currentQuestion.answer) : -1)}
        />

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 gap-3 md:gap-0">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center space-x-2 space-x-reverse px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-secondary-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 space-x-reverse px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              <span>إعادة تشغيل</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse text-xs md:text-sm text-secondary-600">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatTime(timeSpent)}</span>
            <span className="text-secondary-500">•</span>
            <span>النتيجة: {score.correct} من {score.total}</span>
          </div>

          {showResult && (
            <button
              onClick={handleNextQuestion}
              className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3 flex items-center space-x-2 space-x-reverse"
            >
              <span>{isLastQuestion ? 'إنهاء التدريب' : 'التالي'}</span>
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Vocabulary;
