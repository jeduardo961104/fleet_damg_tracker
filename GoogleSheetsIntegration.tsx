import React, { useState } from 'react';
import { Van, DamageReport, DamageSeverity, DamageStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DamageFormProps {
  vans: Van[];
  onSubmit: (damage: Omit<DamageReport, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export const DamageForm: React.FC<DamageFormProps> = ({ vans, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Omit<DamageReport, 'id'>>({
    vanNumber: '',
    description: '',
    location: '',
    severity: 'Medium',
    status: 'Reported',
    notes: '',
    driverName: '',
    driverAtFault: false,
    photos: [],
    dateReported: new Date().toISOString().split('T')[0],
    daysGrounded: 0,
    paveDueBy: '',
    lastPave: '',
    pendingMaintenance: '',
    dateSentForRepair: '',
    locationOfVan: '',
    estimateDateForRepair: '',
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const severityOptions = [
    { value: 'Low', label: t('low') },
    { value: 'Medium', label: t('medium') },
    { value: 'High', label: t('high') },
    { value: 'Critical', label: t('critical') },
  ];

  const statusOptions = [
    { value: 'Reported', label: t('reported') },
    { value: 'In Progress', label: t('inProgress') },
    { value: 'Repaired', label: t('repaired') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectVan')} *
        </label>
        <select
          required
          value={formData.vanNumber}
          onChange={(e) => setFormData({ ...formData, vanNumber: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
        >
          <option value="">{t('selectVanPlaceholder')}</option>
          {vans.map(van => (
            <option key={van.vanNumber} value={van.vanNumber}>
              {van.vanNumber} - {van.plate}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('damageLocation')} *
          </label>
          <input
            required
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            placeholder={t('locationPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('dateReported')}
          </label>
          <input
            type="date"
            value={formData.dateReported}
            onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('damageDescription')} *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          placeholder={t('descriptionPlaceholder')}
        />
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm">{t('driverName')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('driverName')}</label>
            <input
              type="text"
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent bg-white"
              placeholder={t('driverNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('driverAtFault')}</label>
            <div className="flex gap-4 py-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="driverAtFault"
                  checked={formData.driverAtFault === true}
                  onChange={() => setFormData({ ...formData, driverAtFault: true })}
                  className="mr-2 w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]"
                />
                <span className="text-sm text-gray-700">{t('yes')}</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="driverAtFault"
                  checked={formData.driverAtFault === false}
                  onChange={() => setFormData({ ...formData, driverAtFault: false })}
                  className="mr-2 w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]"
                />
                <span className="text-sm text-gray-700">{t('no')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('severity')} *
          </label>
          <select
            required
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as DamageSeverity })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          >
            {severityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('status')} *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as DamageStatus })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('uploadPhotos')}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FF9900] transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">{t('dragAndDrop')}</p>
          </label>
        </div>
        {formData.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('additionalNotes')}
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
          placeholder={t('notesPlaceholder')}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#ec8b00] transition-colors font-medium"
        >
          {t('submitReport')}
        </button>
      </div>
    </form>
  );
};
