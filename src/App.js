import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Practice from './pages/Practice';
import Vocabulary from './pages/Vocabulary';
import Results from './pages/Results';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50" dir="rtl">
      <Router>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/results" element={<Results />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </Router>
    </div>
  );
}

export default App;
