import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import questionsData from '../data/questions.json';

const SentenceCompletion = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sentenceQuestions, setSentenceQuestions] = useState([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [answers, setAnswers] = useState({});

  // Initialize sentence completion questions
  useEffect(() => {
    const sentenceQuestions = [...questionsData.sentenceCompletion].sort((a, b) => a.id - b.id);
    setSentenceQuestions(sentenceQuestions);
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
      
      const currentQuestion = sentenceQuestions[currentQuestionIndex];
      const correctIndex = currentQuestion.choices?.indexOf(currentQuestion.answer);
      const isCorrect = answerIndex === correctIndex;
      
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answerIndex
      }));
      
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sentenceQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(answers[newIndex] || null);
      setShowResult(false);
    } else {
      // Sentence completion practice completed
      const results = {
        score: score,
        timeSpent: timeSpent,
        questions: sentenceQuestions,
        answers: answers,
        completedAt: new Date().toISOString(),
        type: 'sentence-completion'
      };
      localStorage.setItem('sentenceCompletionResults', JSON.stringify(results));
      navigate('/results?type=sentence-completion');
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (sentenceQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = sentenceQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === sentenceQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-100/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 transition-all p-2 rounded-xl hover:bg-gray-100 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="flex items-center space-x-2 md:space-x-3 space-x-reverse">
              <div className="text-xs md:text-sm text-secondary-600 font-medium">
                {formatTime(timeSpent)}
              </div>
              <div className="text-xs md:text-sm text-secondary-600 font-medium">
                {currentQuestionIndex + 1} من {sentenceQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <QuestionCard
          question={{
            ...currentQuestion,
            section: 'sentence-completion',
            question: currentQuestion.sentence
          }}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          isCorrect={selectedAnswer === (currentQuestion.choices?.indexOf(currentQuestion.answer))}
        />

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 mt-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              className={`flex items-center gap-2 px-4 md:px-5 py-3 md:py-3.5 rounded-xl font-semibold transition-all text-sm md:text-base shadow-md hover:shadow-lg min-h-[3rem] ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 active:scale-95 border-2 border-gray-200'
              }`}
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 md:px-5 py-3 md:py-3.5 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 transition-all text-sm md:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border-2 border-gray-200 min-h-[3rem]"
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
              className="btn-primary text-sm md:text-base px-5 md:px-7 py-3 md:py-3.5 flex items-center gap-2 min-h-[3rem]"
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

export default SentenceCompletion;
