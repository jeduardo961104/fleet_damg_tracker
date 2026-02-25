import React from 'react';
import { Van, DamageReport } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VanCardProps {
  van: Van;
  damages: DamageReport[];
  onRemove: (id: string) => void;
  onViewDamages: () => void;
}

export const VanCard: React.FC<VanCardProps> = ({ van, damages, onRemove, onViewDamages }) => {
  const { t } = useLanguage();
  
  const activeDamages = damages.filter(d => d.status !== 'Repaired').length;

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Maintenance': 'bg-yellow-100 text-yellow-800',
    'Out of Service': 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    'Active': t('active'),
    'Maintenance': t('maintenance'),
    'Out of Service': t('outOfService'),
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#FF9900] p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{van.vanNumber}</h3>
            <p className="text-sm text-gray-500">{van.plate}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[van.operationalStatus] || 'bg-gray-100'}`}>
          {statusLabels[van.operationalStatus] || van.operationalStatus}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">{t('vanType')}</p>
          <p className="font-semibold text-gray-900 truncate" title={van.vanType}>{van.vanType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t('mileage')}</p>
          <p className="font-semibold text-gray-900">{van.mileage.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500">{t('vin')}</p>
        <p className="text-xs font-mono text-gray-700 bg-gray-50 p-1 rounded border border-gray-100">{van.vin}</p>
      </div>

      {activeDamages > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">
            {activeDamages} {t('activeDamages').toLowerCase()}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onViewDamages}
          className="flex-1 bg-[#232F3E] text-white px-4 py-2 rounded-lg hover:bg-[#131921] transition-colors text-sm font-medium"
        >
          {t('viewDamages')}
        </button>
        <button
          onClick={() => onRemove(van.vanNumber)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {t('removeVan')}
        </button>
      </div>
    </div>
  );
};
