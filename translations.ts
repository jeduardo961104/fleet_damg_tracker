export type OperationalStatus = 'Active' | 'Maintenance' | 'Out of Service';
export type DamageSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type DamageStatus = 'Reported' | 'In Progress' | 'Repaired';

export interface Van {
  vanNumber: string;
  vanType: string;
  vin: string;
  plate: string;
  registrationExp: string;
  assetStatus: string;
  mileage: number;
  operationalStatus: OperationalStatus;
}

export interface DamageReport {
  id: string;
  vanNumber: string;
  description: string;
  location: string;
  severity: DamageSeverity;
  status: DamageStatus;
  notes: string;
  driverName: string;
  driverAtFault: boolean;
  photos: string[];
  dateReported: string;
  daysGrounded: number;
  paveDueBy: string;
  lastPave: string;
  pendingMaintenance: string;
  dateSentForRepair: string;
  locationOfVan: string;
  estimateDateForRepair: string;
}

export type Language = 'es' | 'en';

export interface GoogleSheetConfig {
  spreadsheetId: string;
  isConnected: boolean;
}

export interface Translation {
  appTitle: string;
  fleet: string;
  damages: string;
  totalVans: string;
  activeDamages: string;
  addVan: string;
  reportDamage: string;
  vanNumber: string;
  vanType: string;
  vin: string;
  plate: string;
  registrationExp: string;
  assetStatus: string;
  mileage: string;
  operationalStatus: string;
  active: string;
  maintenance: string;
  outOfService: string;
  add: string;
  cancel: string;
  description: string;
  locationOfDamage: string;
  severity: string;
  status: string;
  notes: string;
  driverName: string;
  driverNamePlaceholder: string;
  driverAtFault: string;
  yes: string;
  no: string;
  photos: string;
  dropPhotos: string;
  clickToSelect: string;
  submit: string;
  reported: string;
  inProgress: string;
  repaired: string;
  low: string;
  medium: string;
  high: string;
  critical: string;
  noVans: string;
  noDamages: string;
  viewDamages: string;
  removeVan: string;
  selectVan: string;
  selectVanPlaceholder: string;
  damageDescription: string;
  descriptionPlaceholder: string;
  damageLocation: string;
  locationPlaceholder: string;
  selectSeverity: string;
  selectStatus: string;
  uploadPhotos: string;
  dragAndDrop: string;
  additionalNotes: string;
  notesPlaceholder: string;
  submitReport: string;
  damageHistory: string;
  plateNumber: string;
  model: string;
  year: string;
  addNewVan: string;
  plateNumberInput: string;
  plateNumberPlaceholder: string;
  modelInput: string;
  modelPlaceholder: string;
  yearInput: string;
  mileageInput: string;
  vanStatus: string;
  addVanButton: string;
  connectGoogleSheets: string;
  spreadsheetId: string;
  spreadsheetIdPlaceholder: string;
  connect: string;
  disconnect: string;
  connected: string;
  notConnected: string;
  saveToSheet: string;
  syncData: string;
  daysGrounded: string;
  paveDueBy: string;
  lastPave: string;
  pendingMaintenance: string;
  dateSentForRepair: string;
  locationOfVan: string;
  estimateDateForRepair: string;
  issues: string;
  dateReported: string;
  close: string;
  searchPlaceholder: string;
  gridView: string;
  listView: string;
}
