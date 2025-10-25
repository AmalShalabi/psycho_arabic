import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain,
  FileText,
  Star,
  Target
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'مفردات إنجليزية',
      description: 'تدريب على 199 كلمة إنجليزية مهمة للاختبار النفسي',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/vocabulary')
    },
    {
      title: 'إكمال الجمل',
      description: 'تدريب على 50 سؤال إكمال الجمل بالإنجليزية',
      icon: FileText,
      color: 'from-teal-500 to-teal-600',
      action: () => navigate('/sentence-completion')
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'مفردات إنجليزية',
      description: '199 كلمة إنجليزية مهمة للاختبار النفسي'
    },
    {
      icon: FileText,
      title: 'إكمال الجمل',
      description: '50 سؤال إكمال الجمل بالإنجليزية'
    },
    {
      icon: Target,
      title: 'نتائج فورية',
      description: 'احصل على النتائج والتفسيرات فوراً'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">
              تدريب بسيخومتري بالعربية
            </h1>
            <p className="text-secondary-600 text-lg mb-4">
              استعد للاختبار النفسي بثقة مع أفضل التطبيقات التدريبية
            </p>
            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-4 md:p-6 border border-primary-200"
            >
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                <Star className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg md:text-xl font-bold text-primary-800">
                  رسالة تحفيزية
                </h2>
                <Star className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-primary-700 text-base md:text-lg leading-relaxed">
                "النجاح ليس حظاً، بل هو نتيجة الجهد والمثابرة. كل سؤال تحله يقربك من هدفك. 
                <br className="hidden md:block" />
                استمر في التدريب وثق بقدراتك - أنت أقوى مما تتصور! 💪"
              </p>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-lg mb-3 md:mb-4">
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Chapters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-800 mb-4">
              الفصول الرئيسية
            </h2>
            <p className="text-secondary-600 text-lg">
              اختر الفصل الذي تريد التدريب عليه
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.action}
                className="group bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className="flex flex-col items-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${item.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <item.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg text-secondary-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 md:mt-16 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <h2 className="text-xl md:text-2xl font-bold text-secondary-800 mb-6 md:mb-8 text-center">
            إحصائيات التطبيق
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">199</div>
              <div className="text-sm md:text-base text-orange-700 font-medium">كلمة إنجليزية</div>
            </div>
            <div className="text-center bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">50</div>
              <div className="text-sm md:text-base text-teal-700 font-medium">سؤال إكمال الجمل</div>
            </div>
            <div className="text-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-2">249</div>
              <div className="text-sm md:text-base text-primary-700 font-medium">إجمالي الأسئلة</div>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm md:text-base text-green-700 font-medium">مجاني تماماً</div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
