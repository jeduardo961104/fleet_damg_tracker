import { GOOGLE_SHEETS_CONFIG } from '../config';
import { Van, DamageReport } from '../types';

/**
 * Note: Reading from Google Sheets with an API key requires the sheet to be public 
 * or shared with a service account.
 * Writing usually requires OAuth2 or a Google Apps Script web app as a proxy.
 */

export async function fetchVansFromSheet(): Promise<Van[]> {
  const { spreadsheetId, apiKey, sheetName } = GOOGLE_SHEETS_CONFIG;
  
  if (!spreadsheetId || spreadsheetId === 'REPLACE_WITH_YOUR_SPREADSHEET_ID') {
    return [];
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:H100?key=${apiKey}`
    );
    const data = await response.json();

    if (!data.values) return [];

    return data.values.map((row: any[]) => ({
      vanNumber: row[0] || '',
      vanType: row[1] || '',
      vin: row[2] || '',
      plate: row[3] || '',
      registrationExp: row[4] || '',
      assetStatus: row[5] || '',
      mileage: parseInt(row[6]) || 0,
      operationalStatus: row[7] || 'Active',
    }));
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

export async function saveDamageToSheet(damage: DamageReport) {
  // This is a placeholder for writing to the sheet.
  // Real implementation would typically use a Google Apps Script Web App
  // to avoid exposing secrets or requiring OAuth on every device.
  console.log('Saving to Google Sheets:', damage);
  
  // Example of what the payload would look like for a POST to a proxy
  // fetch(PROXY_URL, { method: 'POST', body: JSON.stringify(damage) });
  
  return true;
}
