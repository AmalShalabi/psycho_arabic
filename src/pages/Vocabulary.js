import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Clock, ArrowRight } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import questionsData from '../data/questions.json';

const UNIT_SIZE = 20;

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
    const rawVocabulary = Array.isArray(questionsData.vocabulary)
      ? questionsData.vocabulary
      : [];

    const flattenedVocabulary = rawVocabulary.flatMap((levelEntry) => {
      // Handle new structure: { level: "1", units: [{ unit: "Unit 1", questions: [...] }] }
      if (levelEntry && Array.isArray(levelEntry.units)) {
        return levelEntry.units.flatMap((unitEntry) => {
          if (unitEntry && Array.isArray(unitEntry.questions)) {
            return unitEntry.questions.map((question) => ({
              ...question,
              question: question.word || question.question, // Support both 'word' and 'question' fields
              unit: unitEntry.unit,
              section: 'vocabulary'
            }));
          }
          return [];
        });
      }
      
      // Handle old structure: { unit: "Unit 1", words: [...] }
      if (levelEntry && Array.isArray(levelEntry.words) && levelEntry.unit) {
        return levelEntry.words.map((word) => ({
          ...word,
          question: word.word || word.question,
          unit: levelEntry.unit,
          section: word.section || 'vocabulary'
        }));
      }

      // Handle flat structure: direct question objects
      return levelEntry ? [{ 
        ...levelEntry, 
        question: levelEntry.word || levelEntry.question,
        unit: levelEntry.unit || 'Unit 1', 
        section: levelEntry.section || 'vocabulary' 
      }] : [];
    });

    const sortedVocabulary = flattenedVocabulary
      .filter(Boolean)
      .sort((a, b) => ((a.id ?? 0) - (b.id ?? 0)))
      .map((item, index) => ({
        ...item,
        id: item.id ?? index + 1,
        unit: item.unit || `Unit ${Math.floor(index / UNIT_SIZE) + 1}`,
        section: item.section || 'vocabulary'
      }));

    setVocabularyQuestions(sortedVocabulary);
    setStartTime(Date.now());

    // Handle navigation from GroupResult page
    const location = window.location;
    const urlParams = new URLSearchParams(location.search);
    const startGroup = urlParams.get('startUnit') || urlParams.get('startGroup');
    const startQuestion = urlParams.get('startQuestion');

    if (startGroup && startQuestion) {
      const questionIndex = parseInt(startQuestion, 10) - 1; // Convert to 0-based index
      if (!Number.isNaN(questionIndex)) {
        setCurrentQuestionIndex(Math.max(0, Math.min(questionIndex, sortedVocabulary.length - 1)));
        setSelectedAnswer(null);
        setShowResult(false);
        setScore({ correct: 0, total: 0 });
        setTimeSpent(0);
        setAnswers({});
        setStartTime(Date.now());
      }
    }
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

  const totalUnits = Math.max(1, Math.ceil(vocabularyQuestions.length / UNIT_SIZE));

  const getGroupInfo = (groupNumber) => {
    const startIndex = (groupNumber - 1) * UNIT_SIZE;
    const endIndex = Math.min(startIndex + UNIT_SIZE - 1, vocabularyQuestions.length - 1);
    return {
      startIndex,
      endIndex,
      startQuestion: startIndex + 1,
      endQuestion: endIndex + 1,
      totalQuestions: endIndex >= startIndex ? (endIndex - startIndex + 1) : 0
    };
  };

  const getCurrentGroup = () => {
    return Math.floor(currentQuestionIndex / UNIT_SIZE) + 1;
  };

  const handleNextQuestion = () => {
    const currentGroup = getCurrentGroup();
    const groupInfo = getGroupInfo(currentGroup);
    const isEndOfGroup = currentQuestionIndex === groupInfo.endIndex;

    if (isEndOfGroup) {
      // Calculate score for current group only
      const groupAnswers = {};
      for (let i = groupInfo.startIndex; i <= groupInfo.endIndex; i++) {
        if (answers[i] !== undefined) {
          groupAnswers[i] = answers[i];
        }
      }
      
      const groupScore = {
        correct: Object.entries(groupAnswers).filter(([index, answer]) => {
          const question = vocabularyQuestions[parseInt(index, 10)];
          const correctIndex = question.answer ? 
            question.choices?.indexOf(question.answer) : -1;
          return answer === correctIndex;
        }).length,
        total: groupInfo.totalQuestions
      };
      
      const unitName = vocabularyQuestions[groupInfo.startIndex]?.unit || `Unit ${currentGroup}`;

      // Navigate to group result page
      const groupResults = {
        groupNumber: currentGroup,
        unitName,
        groupRange: {
          start: groupInfo.startQuestion,
          end: groupInfo.endQuestion
        },
        score: groupScore,
        totalQuestions: groupInfo.totalQuestions,
        totalUnits,
        timeSpent: timeSpent,
        answers: groupAnswers,
        questions: vocabularyQuestions.slice(groupInfo.startIndex, groupInfo.endIndex + 1)
      };
      
      navigate('/group-result', { state: groupResults });
    } else if (currentQuestionIndex < vocabularyQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setSelectedAnswer(answers[newIndex] || null);
      setShowResult(false);
    } else {
      // Vocabulary practice completed (all questions)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل الأسئلة...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = vocabularyQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === vocabularyQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const currentUnitLabel = currentQuestion?.unit || `Unit ${getCurrentGroup()}`;

  return (
    <div className="single-screen-layout">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-100/50 sticky top-0 z-10 compact-header">
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
                {currentQuestionIndex + 1} من {vocabularyQuestions.length}
                <span className="text-secondary-500 mr-1">•</span>
                <span>{currentUnitLabel}</span>
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

        {/* Unit Navigation */}
        <div className="compact-groups">
          <h3 className="text-sm md:text-base font-semibold text-secondary-700 mb-2 text-center">
            اختر وحدة المفردات
          </h3>
          <div className="flex flex-wrap justify-center gap-1 md:gap-2 overflow-x-auto pb-1">
            {Array.from({ length: totalUnits }, (_, i) => {
              const groupNumber = i + 1;
              const groupInfo = getGroupInfo(groupNumber);
              const isActive = isInCurrentGroup(groupNumber);
              const unitLabel = vocabularyQuestions[groupInfo.startIndex]?.unit || `Unit ${groupNumber}`;
              
              return (
                <button
                  key={groupNumber}
                  onClick={() => handleGroupSelect(groupNumber)}
                  className={`px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md min-h-[2.5rem] ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md transform scale-105 border-2 border-pink-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-xs md:text-sm">{unitLabel}</div>
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

export default Vocabulary;
