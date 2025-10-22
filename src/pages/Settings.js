import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Target,
  Palette,
  User,
  Bell,
  Globe
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEnabled: true,
    notifications: true,
    language: 'ar',
    examTime: 60,
    practiceQuestions: 10,
    theme: 'blue',
    fontSize: 'medium'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify({
      ...settings,
      [key]: value
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      darkMode: false,
      soundEnabled: true,
      notifications: true,
      language: 'ar',
      examTime: 60,
      practiceQuestions: 10,
      theme: 'blue',
      fontSize: 'medium'
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
  };

  const settingSections = [
    {
      title: 'المظهر',
      icon: Palette,
      settings: [
        {
          key: 'darkMode',
          label: 'الوضع المظلم',
          type: 'toggle',
          description: 'تفعيل الوضع المظلم للتطبيق'
        },
        {
          key: 'theme',
          label: 'لون التطبيق',
          type: 'select',
          options: [
            { value: 'blue', label: 'أزرق' },
            { value: 'green', label: 'أخضر' },
            { value: 'purple', label: 'بنفسجي' },
            { value: 'red', label: 'أحمر' }
          ],
          description: 'اختر لون التطبيق المفضل لديك'
        },
        {
          key: 'fontSize',
          label: 'حجم الخط',
          type: 'select',
          options: [
            { value: 'small', label: 'صغير' },
            { value: 'medium', label: 'متوسط' },
            { value: 'large', label: 'كبير' }
          ],
          description: 'اختر حجم الخط المناسب لك'
        }
      ]
    },
    {
      title: 'الصوت والإشعارات',
      icon: Bell,
      settings: [
        {
          key: 'soundEnabled',
          label: 'تفعيل الأصوات',
          type: 'toggle',
          description: 'تشغيل أصوات التنبيهات'
        },
        {
          key: 'notifications',
          label: 'الإشعارات',
          type: 'toggle',
          description: 'تلقي تذكيرات للتدريب'
        }
      ]
    },
    {
      title: 'التدريب',
      icon: Target,
      settings: [
        {
          key: 'examTime',
          label: 'مدة الامتحان (دقيقة)',
          type: 'range',
          min: 30,
          max: 120,
          step: 15,
          description: 'اختر مدة الامتحان التجريبي'
        },
        {
          key: 'practiceQuestions',
          label: 'عدد أسئلة التدريب',
          type: 'select',
          options: [
            { value: 5, label: '5 أسئلة' },
            { value: 10, label: '10 أسئلة' },
            { value: 15, label: '15 سؤال' },
            { value: 20, label: '20 سؤال' }
          ],
          description: 'عدد الأسئلة في جلسة التدريب'
        }
      ]
    },
    {
      title: 'اللغة',
      icon: Globe,
      settings: [
        {
          key: 'language',
          label: 'لغة التطبيق',
          type: 'select',
          options: [
            { value: 'ar', label: 'العربية' },
            { value: 'en', label: 'English' }
          ],
          description: 'اختر لغة واجهة التطبيق'
        }
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-secondary-800">{setting.label}</div>
              <div className="text-sm text-secondary-600">{setting.description}</div>
            </div>
            <button
              onClick={() => handleSettingChange(setting.key, !settings[setting.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[setting.key] ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div>
            <div className="font-medium text-secondary-800 mb-2">{setting.label}</div>
            <div className="text-sm text-secondary-600 mb-3">{setting.description}</div>
            <select
              value={settings[setting.key]}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {setting.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        return (
          <div>
            <div className="font-medium text-secondary-800 mb-2">{setting.label}</div>
            <div className="text-sm text-secondary-600 mb-3">{setting.description}</div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <input
                type="range"
                min={setting.min}
                max={setting.max}
                step={setting.step}
                value={settings[setting.key]}
                onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold text-primary-600 min-w-[3rem] text-center">
                {settings[setting.key]}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            <h1 className="text-xl font-bold text-secondary-800">الإعدادات</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-800">الملف الشخصي</h2>
              <p className="text-secondary-600">إدارة إعداداتك الشخصية</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg mb-6"
          >
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-800">{section.title}</h3>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  {renderSetting(setting)}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-secondary-800 mb-6">الإجراءات</h3>
          
          <div className="space-y-4">
            <button
              onClick={resetSettings}
              className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
              <span>إعادة تعيين الإعدادات</span>
            </button>

            <button
              onClick={() => navigate('/progress')}
              className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Target className="w-5 h-5" />
              <span>عرض سجل التقدم</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full btn-primary"
            >
              حفظ والعودة للرئيسية
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-secondary-500 text-sm mt-8"
        >
          <p>تدريب بسيخومتري بالعربية - الإصدار 1.0.0</p>
          <p className="mt-1">© 2024 جميع الحقوق محفوظة</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
