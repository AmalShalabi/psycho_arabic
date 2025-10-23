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
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(answers[newIndex] || null);
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
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(answers[newIndex] || null);
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

  // Group navigation functions
  const getGroupInfo = (groupNumber) => {
    const startIndex = (groupNumber - 1) * 20;
    const endIndex = Math.min(startIndex + 19, vocabularyQuestions.length - 1);
    return {
      startIndex,
      endIndex,
      startQuestion: startIndex + 1,
      endQuestion: endIndex + 1,
      totalQuestions: endIndex - startIndex + 1
    };
  };

  const getCurrentGroup = () => {
    return Math.floor(currentQuestionIndex / 20) + 1;
  };

  const handleGroupSelect = (groupNumber) => {
    const groupInfo = getGroupInfo(groupNumber);
    setCurrentQuestionIndex(groupInfo.startIndex);
    setSelectedAnswer(answers[groupInfo.startIndex] || null);
    setShowResult(false);
    setStartTime(Date.now());
  };

  const isInCurrentGroup = (groupNumber) => {
    const groupInfo = getGroupInfo(groupNumber);
    return currentQuestionIndex >= groupInfo.startIndex && currentQuestionIndex <= groupInfo.endIndex;
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
    <div className="single-screen-layout bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-10 compact-header">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-secondary-600 hover:text-secondary-800 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
              <div className="text-xs md:text-sm text-secondary-600 font-medium">
                {formatTime(timeSpent)}
              </div>
            <div className="text-xs md:text-sm text-secondary-600 font-medium">
              {currentQuestionIndex + 1} من {vocabularyQuestions.length}
              <span className="text-secondary-500 mr-1">•</span>
              <span>المجموعة {getCurrentGroup()}</span>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 compact-main">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          isCorrect={selectedAnswer === (currentQuestion.answer ? 
            currentQuestion.choices?.indexOf(currentQuestion.answer) : -1)}
        />

        {/* Group Navigation */}
        <div className="compact-groups">
          <h3 className="text-sm md:text-base font-semibold text-secondary-700 mb-2 text-center">
            اختر مجموعة المفردات
          </h3>
          <div className="flex flex-wrap justify-center gap-1 md:gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 10 }, (_, i) => {
              const groupNumber = i + 1;
              const groupInfo = getGroupInfo(groupNumber);
              const isActive = isInCurrentGroup(groupNumber);
              
              return (
                <button
                  key={groupNumber}
                  onClick={() => handleGroupSelect(groupNumber)}
                  className={`px-2 md:px-3 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md transform scale-105 border border-primary-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md border border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-xs md:text-sm">{groupNumber}</div>
                    <div className="text-xs opacity-75">
                      {groupInfo.startQuestion}-{groupInfo.endQuestion}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="compact-navigation flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center space-x-1 space-x-reverse px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base shadow-sm hover:shadow-md ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-secondary-700 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center space-x-1 space-x-reverse px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-sm md:text-base shadow-sm hover:shadow-md hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              <span>إعادة تشغيل</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse text-xs md:text-sm text-secondary-600 font-medium">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatTime(timeSpent)}</span>
            <span className="text-secondary-500">•</span>
            <span>النتيجة: {score.correct} من {score.total}</span>
          </div>

          {showResult && (
            <button
              onClick={handleNextQuestion}
              className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3 flex items-center space-x-1 space-x-reverse"
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
