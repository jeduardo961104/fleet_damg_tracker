import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onOpenGoogleSheets: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGoogleSheets }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-[#232F3E] to-[#131921] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#FF9900] p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('appTitle')}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              data-tour="sheets"
              onClick={onOpenGoogleSheets}
              className="px-3 py-1.5 rounded-lg font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all mr-2"
            >
              📊 Sheets
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                language === 'es' 
                  ? 'bg-[#FF9900] text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                language === 'en' 
                  ? 'bg-[#FF9900] text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
