import { useState, useEffect } from 'react';
import { Van, DamageReport, GoogleSheetConfig } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { VanCard } from './components/VanCard';
import { VanList } from './components/VanList';
import { DamageList } from './components/DamageList';
import { DamageForm } from './components/DamageForm';
import { AddVanForm } from './components/AddVanForm';
import { Modal } from './components/Modal';
import { GoogleSheetsIntegration } from './components/GoogleSheetsIntegration';
import { Onboarding } from './components/Onboarding';
import { fetchVansFromSheet, saveDamageToSheet } from './utils/googleSheets';
import { GOOGLE_SHEETS_CONFIG } from './config';

const initialVans: Van[] = [
  {
    vanNumber: 'AMZ-001',
    vanType: 'Mercedes Sprinter',
    vin: '1FTBW2CM5HKA12345',
    plate: 'AMZ-1234',
    registrationExp: '2025-12-31',
    assetStatus: 'Active',
    mileage: 45000,
    operationalStatus: 'Active',
  },
  {
    vanNumber: 'AMZ-002',
    vanType: 'Ford Transit',
    vin: '1FTBW2CM5HKA67890',
    plate: 'AMZ-5678',
    registrationExp: '2025-11-30',
    assetStatus: 'Active',
    mileage: 12000,
    operationalStatus: 'Active',
  },
];

const initialDamages: DamageReport[] = [
  {
    id: '1',
    vanNumber: 'AMZ-001',
    description: 'Abolladura en la puerta lateral derecha',
    location: 'Puerta lateral derecha',
    severity: 'Medium',
    status: 'In Progress',
    notes: 'Ocurrió durante la entrega en área residencial',
    driverName: 'Juan Pérez',
    driverAtFault: true,
    photos: [],
    dateReported: '2024-01-15',
    daysGrounded: 2,
    paveDueBy: '2024-02-15',
    lastPave: '2023-06-01',
    pendingMaintenance: 'Oil Change',
    dateSentForRepair: '2024-01-16',
    locationOfVan: 'Warehouse A',
    estimateDateForRepair: '2024-01-20',
  },
];

function AppContent() {
  const { t } = useLanguage();
  const [vans, setVans] = useState<Van[]>(initialVans);
  const [damages, setDamages] = useState<DamageReport[]>(initialDamages);
  const [activeView, setActiveView] = useState<'fleet' | 'damages'>('fleet');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVanNumber, setSelectedVanNumber] = useState<string | null>(null);
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [showAddVanForm, setShowAddVanForm] = useState(false);
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>({
    spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId !== 'REPLACE_WITH_YOUR_SPREADSHEET_ID' 
      ? GOOGLE_SHEETS_CONFIG.spreadsheetId 
      : '',
    isConnected: GOOGLE_SHEETS_CONFIG.spreadsheetId !== 'REPLACE_WITH_YOUR_SPREADSHEET_ID',
  });

  useEffect(() => {
    const loadData = async () => {
      if (sheetConfig.isConnected) {
        setIsLoading(true);
        const fetchedVans = await fetchVansFromSheet();
        if (fetchedVans.length > 0) {
          setVans(fetchedVans);
        }
        setIsLoading(false);
      }
    };
    loadData();
  }, [sheetConfig.isConnected]);

  const handleAddVan = (vanData: Van) => {
    setVans([...vans, vanData]);
    setShowAddVanForm(false);
  };

  const handleRemoveVan = (vanNumber: string) => {
    setVans(vans.filter(v => v.vanNumber !== vanNumber));
    setDamages(damages.filter(d => d.vanNumber !== vanNumber));
  };

  const handleReportDamage = async (damageData: Omit<DamageReport, 'id'>) => {
    const newDamage: DamageReport = {
      ...damageData,
      id: Date.now().toString(),
    };
    setDamages([newDamage, ...damages]);
    setShowDamageForm(false);
    
    if (sheetConfig.isConnected) {
      await saveDamageToSheet(newDamage);
    }
  };

  const activeDamagesCount = damages.filter(d => d.status !== 'Repaired').length;

  const filteredVans = vans.filter(van => {
    const term = searchTerm.toLowerCase();
    return (
      van.vanNumber.toLowerCase().includes(term) ||
      van.plate.toLowerCase().includes(term) ||
      van.vin.toLowerCase().includes(term)
    );
  });

  const filteredDamages = selectedVanNumber
    ? damages.filter(d => d.vanNumber === selectedVanNumber)
    : damages;

  const handleConnectGoogleSheets = (spreadsheetId: string) => {
    setSheetConfig({
      spreadsheetId,
      isConnected: true,
    });
  };

  const handleDisconnectGoogleSheets = () => {
    setSheetConfig({
      spreadsheetId: '',
      isConnected: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenGoogleSheets={() => setShowGoogleSheetsModal(true)} />
      <Onboarding />

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div data-tour="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FF9900]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t('totalVans')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{vans.length}</p>
              </div>
              <div className="bg-[#FF9900] bg-opacity-10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-[#FF9900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t('activeDamages')}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{activeDamagesCount}</p>
              </div>
              <div className="bg-red-500 bg-opacity-10 p-3 rounded-lg">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#232F3E] to-[#131921] rounded-lg shadow-md p-6 text-white">
            <div className="space-y-3">
              <button
                data-tour="add-van"
                onClick={() => setShowAddVanForm(true)}
                className="w-full bg-[#FF9900] text-white px-4 py-2 rounded-lg hover:bg-[#ec8b00] transition-colors font-medium"
              >
                + {t('addVan')}
              </button>
              <button
                data-tour="report-damage"
                onClick={() => setShowDamageForm(true)}
                className="w-full bg-white text-[#232F3E] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                + {t('reportDamage')}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <div data-tour="tabs" className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveView('fleet');
                setSelectedVanNumber(null);
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeView === 'fleet'
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('fleet')}
            </button>
            <button
              onClick={() => {
                setActiveView('damages');
                setSelectedVanNumber(null);
              }}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeView === 'damages'
                  ? 'border-[#FF9900] text-[#FF9900]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('damages')}
            </button>
          </div>

          {activeView === 'fleet' && (
            <div className="flex gap-4 mb-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-100 text-[#FF9900]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  title={t('gridView')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <div className="w-px bg-gray-300"></div>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-100 text-[#FF9900]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                  title={t('listView')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9900]"></div>
            <p className="mt-4 text-gray-600 font-medium">{t('syncData')}...</p>
          </div>
        ) : activeView === 'fleet' ? (
          filteredVans.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVans.map(van => (
                  <VanCard
                    key={van.vanNumber}
                    van={van}
                    damages={damages.filter(d => d.vanNumber === van.vanNumber)}
                    onRemove={handleRemoveVan}
                    onViewDamages={() => {
                      setSelectedVanNumber(van.vanNumber);
                      setActiveView('damages');
                    }}
                  />
                ))}
              </div>
            ) : (
              <VanList
                vans={filteredVans}
                damages={damages}
                onRemove={handleRemoveVan}
                onViewDamages={(vanNumber) => {
                  setSelectedVanNumber(vanNumber);
                  setActiveView('damages');
                }}
              />
            )
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">{t('noVans')}</p>
            </div>
          )
        ) : (
          <div className="max-w-4xl mx-auto">
            {selectedVanNumber && (
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedVanNumber(null)}
                  className="text-[#FF9900] hover:text-[#ec8b00] font-medium"
                >
                  ← {t('damageHistory')}
                </button>
                <span className="text-gray-600">
                  / {vans.find(v => v.vanNumber === selectedVanNumber)?.plate}
                </span>
              </div>
            )}
            <DamageList damages={filteredDamages} vans={vans} />
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showDamageForm}
        onClose={() => setShowDamageForm(false)}
        title={t('reportDamage')}
      >
        <DamageForm
          vans={vans}
          onSubmit={handleReportDamage}
          onCancel={() => setShowDamageForm(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddVanForm}
        onClose={() => setShowAddVanForm(false)}
        title={t('addNewVan')}
      >
        <AddVanForm
          onSubmit={handleAddVan}
          onCancel={() => setShowAddVanForm(false)}
        />
      </Modal>

      <Modal
        isOpen={showGoogleSheetsModal}
        onClose={() => setShowGoogleSheetsModal(false)}
        title={t('connectGoogleSheets')}
      >
        <GoogleSheetsIntegration
          config={sheetConfig}
          onConnect={handleConnectGoogleSheets}
          onDisconnect={handleDisconnectGoogleSheets}
          onClose={() => setShowGoogleSheetsModal(false)}
        />
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
