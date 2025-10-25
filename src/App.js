import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import SentenceCompletion from './pages/SentenceCompletion';
import GroupResult from './pages/GroupResult';
import Results from './pages/Results';
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
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/sentence-completion" element={<SentenceCompletion />} />
            <Route path="/group-result" element={<GroupResult />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </motion.div>
      </Router>
    </div>
  );
}

export default App;
