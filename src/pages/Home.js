import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Zap, 
  BarChart3, 
  Settings, 
  Brain,
  Clock,
  Target
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'ابدأ امتحان تجريبي',
      description: 'امتحان كامل محاكي للاختبار الحقيقي',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/exam')
    },
    {
      title: 'تدريب سريع',
      description: 'تدريب على أسئلة محددة',
      icon: Zap,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/practice')
    },
    {
      title: 'مفردات إنجليزية',
      description: 'تدريب على 199 كلمة إنجليزية مهمة',
      icon: Brain,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/vocabulary')
    },
    {
      title: 'سجل التقدم',
      description: 'تتبع أداءك وإحصائياتك',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/progress')
    },
    {
      title: 'الإعدادات',
      description: 'تخصيص التطبيق حسب احتياجاتك',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      action: () => navigate('/settings')
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'أسئلة متنوعة',
      description: 'أسئلة في الرياضيات واللغة العربية والإنجليزية'
    },
    {
      icon: Clock,
      title: 'توقيت دقيق',
      description: 'نفس توقيت الاختبار الحقيقي'
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
            <p className="text-secondary-600 text-lg">
              استعد للاختبار النفسي بثقة مع أفضل التطبيقات التدريبية
            </p>
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

        {/* Menu Items */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="group bg-white rounded-lg md:rounded-xl p-4 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-right"
            >
              <div className="flex items-start space-x-3 md:space-x-4 space-x-reverse">
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${item.color} rounded-lg md:rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-secondary-800 mb-2 md:mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-secondary-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 md:mt-16 bg-white rounded-lg md:rounded-xl p-4 md:p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl md:text-2xl font-bold text-secondary-800 mb-4 md:mb-6 text-center">
            إحصائيات التطبيق
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1 md:mb-2">209+</div>
              <div className="text-sm md:text-base text-secondary-600">سؤال تدريبي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1 md:mb-2">1000+</div>
              <div className="text-sm md:text-base text-secondary-600">طالب مسجل</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-1 md:mb-2">95%</div>
              <div className="text-sm md:text-base text-secondary-600">معدل النجاح</div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
