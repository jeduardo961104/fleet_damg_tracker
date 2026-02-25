import React from 'react';
import { DamageReport, Van } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DamageListProps {
  damages: DamageReport[];
  vans: Van[];
}

export const DamageList: React.FC<DamageListProps> = ({ damages, vans }) => {
  const { t } = useLanguage();

  const getVanInfo = (vanNumber: string) => {
    return vans.find(v => v.vanNumber === vanNumber);
  };

  const severityColors: Record<string, string> = {
    'Low': 'bg-green-100 text-green-800 border-green-200',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'High': 'bg-orange-100 text-orange-800 border-orange-200',
    'Critical': 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors: Record<string, string> = {
    'Reported': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Repaired': 'bg-green-100 text-green-800',
  };

  const severityLabels: Record<string, string> = {
    'Low': t('low'),
    'Medium': t('medium'),
    'High': t('high'),
    'Critical': t('critical'),
  };

  const statusLabels: Record<string, string> = {
    'Reported': t('reported'),
    'In Progress': t('inProgress'),
    'Repaired': t('repaired'),
  };

  if (damages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-4 text-gray-600">{t('noDamages')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {damages.map(damage => {
        const van = getVanInfo(damage.vanNumber);
        return (
          <div key={damage.id} className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${severityColors[damage.severity] || 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{van?.vanNumber || damage.vanNumber}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[damage.status] || 'bg-gray-100'}`}>
                    {statusLabels[damage.status] || damage.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{van?.vanType} - {van?.plate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{damage.dateReported}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${severityColors[damage.severity] || 'bg-gray-100'}`}>
                  {severityLabels[damage.severity] || damage.severity}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-gray-700">{t('damageLocation')}:</p>
                <p className="text-gray-900">{damage.location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{t('damageDescription')}:</p>
                <p className="text-gray-900">{damage.description}</p>
              </div>
              {(damage.driverName || damage.driverAtFault !== undefined) && (
                <div className="bg-gray-50 p-3 rounded">
                  {damage.driverName && (
                    <>
                      <p className="text-sm font-semibold text-gray-700">{t('driverName')}:</p>
                      <p className="text-gray-900 font-medium">{damage.driverName}</p>
                    </>
                  )}
                  {damage.driverAtFault !== undefined && (
                    <p className="text-sm mt-1">
                      <span className="font-semibold text-gray-700">{t('driverAtFault')}: </span>
                      <span className={`font-medium ${damage.driverAtFault ? 'text-red-600' : 'text-green-600'}`}>
                        {damage.driverAtFault ? t('yes') : t('no')}
                      </span>
                    </p>
                  )}
                </div>
              )}
              {damage.notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">{t('additionalNotes')}:</p>
                  <p className="text-gray-600 text-sm">{damage.notes}</p>
                </div>
              )}
              {damage.photos.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {damage.photos.length} {t('photos')}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {damage.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Damage ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
