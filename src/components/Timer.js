import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const Timer = ({ timeLimit, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-yellow-600';
    return 'text-primary-600';
  };

  const getProgressPercentage = () => {
    return ((timeLimit - timeLeft) / timeLimit) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Clock className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium text-secondary-700">الوقت المتبقي</span>
        </div>
        <span className={`text-2xl font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${getProgressPercentage()}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
      
      {timeLeft <= 30 && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center"
        >
          <span className="text-sm text-red-600 font-medium">
            ⚠️ الوقت ينفد!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Timer;
