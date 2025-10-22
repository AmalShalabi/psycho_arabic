import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, label = "التقدم" }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700">{label}</span>
        <span className="text-sm text-secondary-600">
          {current} من {total}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      <div className="mt-1 text-center">
        <span className="text-xs text-secondary-500">
          {Math.round(percentage)}% مكتمل
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
