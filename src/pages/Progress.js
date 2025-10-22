import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  Award,
  BookOpen
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Progress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalPractice: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    streak: 0
  });

  const loadProgressData = useCallback(() => {
    // Load exam results
    const examResults = JSON.parse(localStorage.getItem('examResults') || 'null');
    const practiceResults = JSON.parse(localStorage.getItem('practiceResults') || 'null');
    
    const allResults = [];
    let totalExams = 0;
    let totalPractice = 0;
    let totalScore = 0;
    let totalScores = 0;
    let bestScore = 0;
    let totalTimeSpent = 0;

    if (examResults) {
      const score = Math.round((examResults.correctAnswers / examResults.totalQuestions) * 100);
      allResults.push({
        date: new Date(examResults.completedAt || Date.now()).toISOString().split('T')[0],
        score: score,
        type: 'امتحان',
        timeSpent: examResults.timeSpent || 0,
        correct: examResults.correctAnswers,
        total: examResults.totalQuestions
      });
      totalExams++;
      totalScore += score;
      totalScores++;
      bestScore = Math.max(bestScore, score);
      totalTimeSpent += examResults.timeSpent || 0;
    }

    if (practiceResults) {
      const score = Math.round((practiceResults.score.correct / practiceResults.score.total) * 100);
      allResults.push({
        date: new Date(practiceResults.completedAt || Date.now()).toISOString().split('T')[0],
        score: score,
        type: 'تدريب',
        timeSpent: practiceResults.timeSpent || 0,
        correct: practiceResults.score.correct,
        total: practiceResults.score.total
      });
      totalPractice++;
      totalScore += score;
      totalScores++;
      bestScore = Math.max(bestScore, score);
      totalTimeSpent += practiceResults.timeSpent || 0;
    }

    // Sort by date
    allResults.sort((a, b) => new Date(a.date) - new Date(b.date));

    setProgressData(allResults);
    setStats({
      totalExams,
      totalPractice,
      averageScore: totalScores > 0 ? Math.round(totalScore / totalScores) : 0,
      bestScore,
      totalTimeSpent,
      streak: calculateStreak(allResults)
    });
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const calculateStreak = (results) => {
    if (results.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    for (let i = results.length - 1; i >= 0; i--) {
      const resultDate = new Date(results[i].date);
      if (resultDate.toDateString() === today.toDateString() || 
          resultDate.toDateString() === yesterday.toDateString()) {
        streak++;
        yesterday.setDate(yesterday.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes} دقيقة`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMotivationalMessage = () => {
    if (stats.streak >= 7) return '🔥 سلسلة رائعة! استمر في التقدم';
    if (stats.streak >= 3) return '💪 أداء ممتاز! أنت في الطريق الصحيح';
    if (stats.averageScore >= 80) return '⭐ أداء متميز! احتفظ بهذا المستوى';
    if (stats.averageScore >= 60) return '📈 تقدم جيد! استمر في التدريب';
    return '🎯 ابدأ رحلتك نحو التميز';
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
            <h1 className="text-xl font-bold text-secondary-800">سجل التقدم</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">أهلاً بك في سجل التقدم!</h2>
          <p className="text-primary-100">{getMotivationalMessage()}</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">
              {stats.totalExams + stats.totalPractice}
            </div>
            <div className="text-sm text-secondary-600">إجمالي الاختبارات</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore}%
            </div>
            <div className="text-sm text-secondary-600">متوسط النتائج</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(stats.bestScore)}`}>
              {stats.bestScore}%
            </div>
            <div className="text-sm text-secondary-600">أفضل نتيجة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">
              {stats.streak}
            </div>
            <div className="text-sm text-secondary-600">أيام متتالية</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-primary-600 ml-2" />
              تطور النتائج
            </h3>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'النتيجة']}
                    labelFormatter={(label) => `التاريخ: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-secondary-500 py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد بيانات متاحة بعد</p>
                <p className="text-sm">ابدأ بالتدريب لرؤية تقدمك</p>
              </div>
            )}
          </motion.div>

          {/* Activity Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 text-primary-600 ml-2" />
              توزيع النشاط
            </h3>
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="type" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'النتيجة']}
                  />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-secondary-500 py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد بيانات متاحة بعد</p>
                <p className="text-sm">ابدأ بالتدريب لرؤية نشاطك</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-secondary-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 text-primary-600 ml-2" />
            النشاط الأخير
          </h3>
          {progressData.length > 0 ? (
            <div className="space-y-4">
              {progressData.slice(-5).reverse().map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-3 h-3 rounded-full ${
                      result.type === 'امتحان' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-secondary-800">
                        {result.type} - {result.date}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {result.correct} من {result.total} صحيح
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                    <div className="text-sm text-secondary-600">
                      {formatTime(result.timeSpent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary-500 py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا يوجد نشاط بعد</p>
              <p className="text-sm">ابدأ بالتدريب لرؤية نشاطك هنا</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/exam')}
            className="btn-primary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <BookOpen className="w-5 h-5" />
            <span>امتحان تجريبي</span>
          </button>
          
          <button
            onClick={() => navigate('/practice')}
            className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Target className="w-5 h-5" />
            <span>تدريب سريع</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Progress;
