import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import questionsData from '../data/questions.json';

const Exam = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [examQuestions, setExamQuestions] = useState([]);

  const handleExamComplete = useCallback(() => {
    const results = {
      totalQuestions: examQuestions.length,
      answeredQuestions: Object.keys(answers).length,
      correctAnswers: 0,
      timeSpent: 3600 - timeLeft,
      answers: answers,
      questions: examQuestions
    };

    // Calculate correct answers
    examQuestions.forEach((question, index) => {
      // Handle both old structure (correct index) and new vocabulary structure (answer text)
      const correctIndex = question.correct !== undefined ? question.correct : 
        (question.answer ? question.choices?.indexOf(question.answer) : -1);
      if (answers[index] === correctIndex) {
        results.correctAnswers++;
      }
    });

    // Store results in localStorage
    localStorage.setItem('examResults', JSON.stringify(results));
    navigate('/results');
  }, [examQuestions, answers, timeLeft, navigate]);

  // Initialize exam with mixed questions
  useEffect(() => {
    const allQuestions = [
      ...questionsData.quantitative.slice(0, 8),
      ...questionsData.verbal.slice(0, 8),
      ...questionsData.english.slice(0, 7),
      ...questionsData.vocabulary.slice(0, 7)
    ];
    
    // Shuffle questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    setExamQuestions(shuffled);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isExamStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleExamComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, timeLeft, handleExamComplete]);

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const startExam = () => {
    setIsExamStarted(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl w-full text-center"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">
              امتحان تجريبي
            </h1>
            <p className="text-secondary-600 text-lg leading-relaxed">
              امتحان كامل محاكي للاختبار النفسي الحقيقي
            </p>
          </div>

          <div className="space-y-4 mb-8 text-right">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-secondary-600">عدد الأسئلة:</span>
              <span className="font-semibold text-secondary-800">30 سؤال</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-secondary-600">مدة الامتحان:</span>
              <span className="font-semibold text-secondary-800">60 دقيقة</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-secondary-600">الأقسام:</span>
              <span className="font-semibold text-secondary-800">كمي، لفظي، إنجليزي، مفردات إنجليزية</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              العودة للرئيسية
            </button>
            <button
              onClick={startExam}
              className="btn-primary flex-1"
            >
              ابدأ الامتحان
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
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
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-sm text-secondary-600">
                {formatTime(timeLeft)}
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-4">
            <ProgressBar 
              current={currentQuestionIndex + 1} 
              total={examQuestions.length}
              label="تقدم الامتحان"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-lg font-medium transition-all ${
              isFirstQuestion
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-secondary-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <div className="flex items-center space-x-2 space-x-reverse text-sm text-secondary-600">
            <CheckCircle className="w-4 h-4" />
            <span>{Object.keys(answers).length} من {examQuestions.length} تم الإجابة عليها</span>
          </div>

          <button
            onClick={handleNext}
            className="btn-primary flex items-center space-x-2 space-x-reverse"
          >
            <span>{isLastQuestion ? 'إنهاء الامتحان' : 'التالي'}</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-secondary-800 mb-4">
              تأكيد إنهاء الامتحان
            </h3>
            <p className="text-secondary-600 mb-6">
              هل أنت متأكد من إنهاء الامتحان؟ لن تتمكن من العودة بعد ذلك.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn-secondary flex-1"
              >
                إلغاء
              </button>
              <button
                onClick={handleExamComplete}
                className="btn-primary flex-1"
              >
                إنهاء الامتحان
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Exam;
