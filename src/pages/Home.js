import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-center items-center h-screen max-h-[100vh] p-4 sm:p-6 md:p-8 text-center space-y-6"
      dir="rtl"
    >
      {/* App Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2"
      >
        تدريب بسيخومتري بالعربية
      </motion.h1>

      {/* Motivational Message */}
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-700 mb-4"
      >
        ابدأ تدريبك بثقة، كل خطوة تقرّبك من النجاح 🌟
      </motion.p>

      {/* Main Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/vocabulary')}
          className="w-full sm:w-64 md:w-72 py-4 md:py-5 px-6 md:px-8 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 text-white text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-h-[3.5rem] md:min-h-[4rem]"
        >
          <span className="text-2xl md:text-3xl">📘</span>
          <span>مفردات إنجليزية</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/sentence-completion')}
          className="w-full sm:w-64 md:w-72 py-4 md:py-5 px-6 md:px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 min-h-[3.5rem] md:min-h-[4rem]"
        >
          <span className="text-2xl md:text-3xl">✏️</span>
          <span>إكمال الجمل</span>
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex flex-wrap justify-center gap-4 text-sm sm:text-base text-gray-600"
      >
        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">
          199 كلمة إنجليزية
        </span>
        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
          50 سؤال إكمال الجمل
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
          100% مجاني
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Home;
