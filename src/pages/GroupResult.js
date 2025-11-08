import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight, ArrowLeft, Home, Trophy, Target, Clock } from 'lucide-react';

const GroupResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    groupNumber,
    unitName,
    groupRange,
    score,
    totalQuestions,
    totalUnits,
    timeSpent
  } = location.state || {};

  // RTL/LTR detection for proper icon direction
  const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
  const nextIcon = isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />;
  const prevIcon = isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />;

  const getMotivationalMessage = (percentage) => {
    if (percentage >= 90) return "ممتاز! أداء رائع جداً! 🎉";
    if (percentage >= 80) return "ممتاز! أداء ممتاز! 👏";
    if (percentage >= 70) return "جيد جداً! أداء جيد! 👍";
    if (percentage >= 60) return "جيد! استمر في التقدم! 💪";
    if (percentage >= 50) return "مقبول! يمكنك التحسن أكثر! 📈";
    return "لا تستسلم! الممارسة تجعل الكمال! 🔄";
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetryGroup = () => {
    navigate(`/vocabulary?startUnit=${groupNumber}&startGroup=${groupNumber}&startQuestion=${groupRange.start}`);
  };

  const handlePreviousGroup = () => {
    const prevGroup = groupNumber - 1;
    const prevGroupStart = (prevGroup - 1) * 20 + 1;
    
    if (prevGroup >= 1) {
      navigate(`/vocabulary?startUnit=${prevGroup}&startGroup=${prevGroup}&startQuestion=${prevGroupStart}`);
    }
  };

  const handleNextGroup = () => {
    const nextGroup = groupNumber + 1;
    const nextGroupStart = (nextGroup - 1) * 20 + 1;
    
    if (nextGroup <= totalUnitsCount) {
      navigate(`/vocabulary?startUnit=${nextGroup}&startGroup=${nextGroup}&startQuestion=${nextGroupStart}`);
    } else {
      // Navigate to main results if no more groups
      navigate('/results?type=vocabulary');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!groupNumber || !score) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score.correct / totalQuestions) * 100);
  const totalUnitsCount = totalUnits || 10;
  const isLastGroup = groupNumber >= totalUnitsCount;
  const unitLabel = unitName || `Unit ${groupNumber}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-center items-center h-screen max-h-[100vh] p-3 sm:p-6 text-center space-y-4 sm:space-y-6 bg-white rounded-lg sm:rounded-2xl shadow-xl mx-2 sm:mx-4 md:mx-6 lg:mx-8"
      >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2"
            >
              <Trophy className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
            </motion.div>
            
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary-800 mb-1">
              نتائج الوحدة {groupNumber}
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-secondary-600">
              {unitLabel} • الأسئلة {groupRange.start} - {groupRange.end}
            </p>
          </div>

          {/* Score Display */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold ${getScoreColor(percentage)} mb-2`}
            >
              {percentage}%
            </motion.div>
            
            <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-secondary-700 mb-1">
              {score.correct} من {totalQuestions} إجابة صحيحة
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs sm:text-base md:text-lg text-secondary-600"
            >
              {getMotivationalMessage(percentage)}
            </motion.p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-1 sm:p-3 md:p-4 text-center">
              <Target className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-blue-600">{score.correct}</div>
              <div className="text-xs sm:text-sm text-blue-700">صحيحة</div>
            </div>
            
            <div className="bg-red-50 rounded-lg sm:rounded-xl p-1 sm:p-3 md:p-4 text-center">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-red-600">{totalQuestions - score.correct}</div>
              <div className="text-xs sm:text-sm text-red-700">خاطئة</div>
            </div>
            
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-1 sm:p-3 md:p-4 text-center">
              <Clock className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 mx-auto mb-1" />
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-green-600">{formatTime(timeSpent)}</div>
              <div className="text-xs sm:text-sm text-green-700">الوقت</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 md:gap-4 justify-center w-full">
            {/* Previous Group Button */}
            {groupNumber > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousGroup}
                className="flex items-center justify-center space-x-1 space-x-reverse bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-base"
              >
                {prevIcon}
                <span>السابقة</span>
              </motion.button>
            )}

            {/* Retry Group Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetryGroup}
              className="flex items-center justify-center space-x-1 space-x-reverse bg-primary-600 hover:bg-primary-700 text-white font-medium py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-base"
            >
              <RotateCcw className="w-3 h-3 sm:w-5 sm:h-5" />
              <span>إعادة</span>
            </motion.button>

            {/* Next Group Button */}
            {!isLastGroup && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextGroup}
                className="flex items-center justify-center space-x-1 space-x-reverse bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-base"
              >
                {nextIcon}
                <span>التالية</span>
              </motion.button>
            )}

            {/* Final Results Button */}
            {isLastGroup && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/results?type=vocabulary')}
                className="flex items-center justify-center space-x-1 space-x-reverse bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-base"
              >
                <Trophy className="w-3 h-3 sm:w-5 sm:h-5" />
                <span>النتائج</span>
              </motion.button>
            )}

            {/* Home Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="flex items-center justify-center space-x-1 space-x-reverse bg-gray-600 hover:bg-gray-700 text-white font-medium py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-base"
            >
              <Home className="w-3 h-3 sm:w-5 sm:h-5" />
              <span>الرئيسية</span>
            </motion.button>
          </div>
      </motion.div>
    </div>
  );
};

export default GroupResult;
