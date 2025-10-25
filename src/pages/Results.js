import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const type = searchParams.get('type');
    let storedResults;
    
    if (type === 'practice') {
      storedResults = localStorage.getItem('practiceResults');
    } else if (type === 'vocabulary') {
      storedResults = localStorage.getItem('vocabularyResults');
    } else if (type === 'sentence-completion') {
      storedResults = localStorage.getItem('sentenceCompletionResults');
    } else {
      storedResults = localStorage.getItem('examResults');
    }
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      navigate('/');
    }
  }, [navigate, searchParams]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  const isPractice = searchParams.get('type') === 'practice';
  const isVocabulary = searchParams.get('type') === 'vocabulary';
  const isSentenceCompletion = searchParams.get('type') === 'sentence-completion';
  const percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  const timeSpent = results.timeSpent || 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'ممتاز! أداء رائع';
    if (percentage >= 80) return 'جيد جداً! أداء ممتاز';
    if (percentage >= 70) return 'جيد! أداء مقبول';
    if (percentage >= 60) return 'مقبول، تحتاج للمزيد من التدريب';
    return 'تحتاج للمزيد من التدريب والمراجعة';
  };

  // Prepare chart data
  const sectionData = results.questions.reduce((acc, question) => {
    const section = question.section === 'quantitative' ? 'كمي' : 
                   question.section === 'verbal' ? 'لفظي' : 
                   question.section === 'english' ? 'إنجليزي' : 
                   question.section === 'vocabulary' ? 'مفردات إنجليزية' : 'مفردات إنجليزية';
    if (!acc[section]) {
      acc[section] = { correct: 0, total: 0 };
    }
    acc[section].total++;
    
    // Handle both old structure (correct index) and new vocabulary structure (answer text)
    const correctIndex = question.correct !== undefined ? question.correct : 
      (question.answer ? question.choices?.indexOf(question.answer) : -1);
    
    if (results.answers && results.answers[results.questions.indexOf(question)] === correctIndex) {
      acc[section].correct++;
    }
    return acc;
  }, {});

  const chartData = Object.entries(sectionData).map(([section, data]) => ({
    section,
    correct: data.correct,
    incorrect: data.total - data.correct,
    percentage: Math.round((data.correct / data.total) * 100)
  }));

  const pieData = [
    { name: 'صحيح', value: results.correctAnswers, color: '#10b981' },
    { name: 'خاطئ', value: results.totalQuestions - results.correctAnswers, color: '#ef4444' }
  ];

  const handleReviewQuestion = (index) => {
    setCurrentReviewIndex(index);
    setShowReview(true);
  };

  const handleNextReview = () => {
    if (currentReviewIndex < results.questions.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
    }
  };

  const handlePreviousReview = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    if (isPractice) {
      navigate('/practice');
    } else if (isVocabulary) {
      navigate('/vocabulary');
    } else if (isSentenceCompletion) {
      navigate('/sentence-completion');
    } else {
      navigate('/exam');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-secondary-600 hover:text-secondary-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-secondary-800">
              {isPractice ? 'نتائج التدريب' : isVocabulary ? 'نتائج المفردات' : isSentenceCompletion ? 'نتائج إكمال الجمل' : 'نتائج الامتحان'}
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8 text-center"
        >
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-secondary-800 mb-2">
              {percentage}%
            </h2>
            <p className={`text-xl font-semibold ${getScoreColor(percentage)}`}>
              {getScoreMessage(percentage)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-secondary-800">
                {results.correctAnswers}
              </div>
              <div className="text-sm text-secondary-600">إجابات صحيحة</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-secondary-800">
                {results.totalQuestions - results.correctAnswers}
              </div>
              <div className="text-sm text-secondary-600">إجابات خاطئة</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-secondary-800">
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm text-secondary-600">الوقت المستغرق</div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Section Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-primary-600 ml-2" />
              الأداء حسب القسم
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Correct vs Incorrect */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
              <Target className="w-5 h-5 text-primary-600 ml-2" />
              توزيع الإجابات
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">
            مراجعة الأسئلة
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {results.questions.map((question, index) => {
              const userAnswer = results.answers ? results.answers[index] : null;
              // Handle both old structure (correct index) and new vocabulary structure (answer text)
              const correctIndex = question.correct !== undefined ? question.correct : 
                (question.answer ? question.choices?.indexOf(question.answer) : -1);
              const isCorrect = userAnswer === correctIndex;
              const isAnswered = userAnswer !== null && userAnswer !== undefined;
              
              return (
                <button
                  key={index}
                  onClick={() => handleReviewQuestion(index)}
                  className={`w-12 h-12 rounded-lg font-medium transition-all ${
                    !isAnswered
                      ? 'bg-gray-200 text-gray-500'
                      : isCorrect
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleRestart}
            className="btn-primary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isPractice ? 'تدريب جديد' : isVocabulary ? 'مفردات جديدة' : isSentenceCompletion ? 'إكمال جمل جديد' : 'امتحان جديد'}</span>
          </button>
          
          <button
            onClick={() => navigate('/progress')}
            className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <BarChart3 className="w-5 h-5" />
            <span>سجل التقدم</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </button>
        </motion.div>
      </main>

      {/* Question Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary-800">
                مراجعة السؤال {currentReviewIndex + 1}
              </h3>
              <button
                onClick={() => setShowReview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="question-card">
                <h4 className="text-lg font-semibold text-secondary-800 mb-4">
                  {results.questions[currentReviewIndex].question}
                </h4>
                
                <div className="space-y-3">
                  {(results.questions[currentReviewIndex].options || results.questions[currentReviewIndex].choices || []).map((option, index) => {
                    // Handle both old structure (correct index) and new vocabulary structure (answer text)
                    const correctIndex = results.questions[currentReviewIndex].correct !== undefined ? 
                      results.questions[currentReviewIndex].correct : 
                      (results.questions[currentReviewIndex].answer ? 
                        results.questions[currentReviewIndex].choices?.indexOf(results.questions[currentReviewIndex].answer) : -1);
                    const isCorrect = index === correctIndex;
                    const isUserAnswer = results.answers && results.answers[currentReviewIndex] === index;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : isUserAnswer
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{option}</span>
                          {isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {isUserAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {results.questions[currentReviewIndex].explanation && (
                  <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">التفسير:</h5>
                    <p className="text-blue-700">{results.questions[currentReviewIndex].explanation}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePreviousReview}
                disabled={currentReviewIndex === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <button
                onClick={handleNextReview}
                disabled={currentReviewIndex === results.questions.length - 1}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Results;
