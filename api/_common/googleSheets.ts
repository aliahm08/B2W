import { GoogleAuth } from 'google-auth-library';

type SheetIntent = 'lead' | 'clientCommunication' | 'proposalSignature';

function getEnv(name: string, fallback = ''): string {
  return String(process.env[name] ?? fallback).trim();
}

function getSheetConfig() {
  return {
    spreadsheetId: getEnv('GOOGLE_SHEETS_SPREADSHEET_ID'),
    tabs: {
      lead: getEnv('SHEET_TAB_LEADS', 'Lead Inquiries'),
      clientCommunication: getEnv('SHEET_TAB_CLIENT_COMMUNICATIONS', 'Client Communications'),
      proposalSignature: getEnv('SHEET_TAB_PROPOSAL_SIGNATURES', 'Proposal Signatures'),
    },
  };
}

function parseServiceAccountCredentials() {
  const serviceAccountJson = getEnv('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  const clientEmail = getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = getEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
}

async function getAccessToken() {
  const credentials = parseServiceAccountCredentials();
  if (!credentials) {
    throw new Error('Google Sheets credentials are not configured.');
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse.token ?? '';

  if (!token) {
    throw new Error('Unable to acquire Google Sheets access token.');
  }

  return token;
}

export async function appendSheetRow(intent: SheetIntent, row: Array<string | number | boolean>) {
  const config = getSheetConfig();
  if (!config.spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured.');
  }

  const token = await getAccessToken();
  const tabName = config.tabs[intent];
  const range = `${tabName}!A:Z`;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row.map((value) => String(value ?? ''))],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets append failed (${response.status}): ${errorText}`);
  }
}
