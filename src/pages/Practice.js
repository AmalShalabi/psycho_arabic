import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import questionsData from '../data/questions.json';

const Practice = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Filter questions based on selection
  useEffect(() => {
    let filtered = [];
    
    if (selectedSection === 'all') {
      filtered = [
        ...questionsData.quantitative,
        ...questionsData.verbal,
        ...questionsData.english,
        ...questionsData.vocabulary,
        ...questionsData.sentenceCompletion
      ];
    } else {
      filtered = questionsData[selectedSection] || [];
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    // Shuffle questions
    filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    setPracticeQuestions(filtered);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setTimeSpent(0);
  }, [selectedSection, selectedDifficulty]);

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
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    // Handle both old structure (correct index) and new vocabulary structure (answer text)
    const correctIndex = currentQuestion.correct !== undefined ? currentQuestion.correct : 
      (currentQuestion.answer ? currentQuestion.choices?.indexOf(currentQuestion.answer) : -1);
    const isCorrect = selectedAnswer === correctIndex;
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setStartTime(Date.now());
    } else {
      // Practice completed
      const results = {
        score: score,
        timeSpent: timeSpent,
        questions: practiceQuestions,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('practiceResults', JSON.stringify(results));
      navigate('/results?type=practice');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setTimeSpent(0);
    setStartTime(Date.now());
  };

  const startPractice = () => {
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (practiceQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-secondary-800">تدريب سريع</h1>
              <div></div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-secondary-600">لا توجد أسئلة متاحة للاختيارات المحددة</p>
            <button
              onClick={() => {
                setSelectedSection('all');
                setSelectedDifficulty('all');
              }}
              className="btn-primary mt-4"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!startTime && practiceQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-secondary-800">تدريب سريع</h1>
              <div></div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-secondary-800 mb-6 text-center">
              إعدادات التدريب
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  اختر القسم:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {[
                    { value: 'all', label: 'الكل' },
                    { value: 'quantitative', label: 'كمي' },
                    { value: 'verbal', label: 'لفظي' },
                    { value: 'english', label: 'إنجليزي' },
                    { value: 'vocabulary', label: 'مفردات إنجليزية' },
                    { value: 'sentenceCompletion', label: 'إكمال الجمل' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedSection(option.value)}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all text-sm md:text-base ${
                        selectedSection === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  اختر مستوى الصعوبة:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {[
                    { value: 'all', label: 'الكل' },
                    { value: 'easy', label: 'سهل' },
                    { value: 'medium', label: 'متوسط' },
                    { value: 'hard', label: 'صعب' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedDifficulty(option.value)}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all text-sm md:text-base ${
                        selectedDifficulty === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                <h3 className="font-semibold text-secondary-800 mb-2 text-sm md:text-base">ملخص التدريب:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-secondary-600">عدد الأسئلة:</span>
                    <span className="font-medium text-secondary-800 mr-2">{practiceQuestions.length}</span>
                  </div>
                  <div>
                    <span className="text-secondary-600">القسم:</span>
                    <span className="font-medium text-secondary-800 mr-2">
                      {selectedSection === 'all' ? 'الكل' : 
                       selectedSection === 'quantitative' ? 'كمي' :
                       selectedSection === 'verbal' ? 'لفظي' : 
                       selectedSection === 'english' ? 'إنجليزي' : 'مفردات إنجليزية'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600">الصعوبة:</span>
                    <span className="font-medium text-secondary-800 mr-2">
                      {selectedDifficulty === 'all' ? 'الكل' :
                       selectedDifficulty === 'easy' ? 'سهل' :
                       selectedDifficulty === 'medium' ? 'متوسط' : 'صعب'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600">الوقت المقدر:</span>
                    <span className="font-medium text-secondary-800 mr-2">
                      {Math.ceil(practiceQuestions.length * 1.5)} دقيقة
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary flex-1 text-sm md:text-base"
                >
                  العودة
                </button>
                <button
                  onClick={startPractice}
                  className="btn-primary flex-1 text-sm md:text-base"
                >
                  ابدأ التدريب
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const currentQuestion = practiceQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === practiceQuestions.length - 1;

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
                {currentQuestionIndex + 1} من {practiceQuestions.length}
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
          isCorrect={selectedAnswer === (currentQuestion.correct !== undefined ? currentQuestion.correct : 
            (currentQuestion.answer ? currentQuestion.choices?.indexOf(currentQuestion.answer) : -1))}
        />

        {/* Score Display */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-center space-x-2 md:space-x-4 space-x-reverse mb-3 md:mb-4">
              {(() => {
                const correctIndex = currentQuestion.correct !== undefined ? currentQuestion.correct : 
                  (currentQuestion.answer ? currentQuestion.choices?.indexOf(currentQuestion.answer) : -1);
                const isCorrect = selectedAnswer === correctIndex;
                return (
                  <>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                    )}
                    <span className={`text-lg md:text-xl font-bold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                    </span>
                  </>
                );
              })()}
            </div>
            
            <div className="text-center text-secondary-600 mb-3 md:mb-4 text-sm md:text-base">
              النتيجة الحالية: {score.correct} من {score.total}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 gap-3 md:gap-0">
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 space-x-reverse px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            <span>إعادة تشغيل</span>
          </button>

          <div className="flex items-center space-x-2 space-x-reverse text-xs md:text-sm text-secondary-600">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>

          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base ${
                selectedAnswer === null
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              تحقق من الإجابة
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
            >
              {isLastQuestion ? 'إنهاء التدريب' : 'السؤال التالي'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Practice;
