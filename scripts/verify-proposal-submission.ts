import { Readable } from 'stream';
import dotenv from 'dotenv';
import path from 'path';

// Load locally configured env vars to test integration logic
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import handler from '../api/proposal-signature.js';

async function runTest() {
  console.log('--- Starting Proposal Submission Verification Test ---\n');

  // We need to provide a body to the handler.
  const validBody = {
    signerName: 'Test Signer',
    signerEmail: 'test-signer@b2w-ai.com',
    company: 'Test Client Corp',
    proposalName: 'Website Redesign Proposal',
    proposalId: 'prop_12345',
    proposalUrl: 'https://b2w-ai.com/proposal/12345',
    actionTaken: 'accepted',
    notes: 'Looking forward to working with you!',
    selectedOptionId: 'opt_1',
    selectedOptionTitle: 'Standard Package',
    selectedOptionPrice: '$5,000',
    acceptedTerms: true,
    signatureName: 'Test Signer',
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // tiny 1x1 transparent png
    sourcePage: 'Proposal Page',
    sourcePath: '/proposal/12345'
  };

  const mockReq = Readable.from([JSON.stringify(validBody)]);
  (mockReq as any).method = 'POST';
  (mockReq as any).headers = {
    'content-type': 'application/json',
    'x-real-ip': '127.0.0.1'
  };

  // Mock Response Object
  let statusCode: number = 200;
  let responseData: any = null;
  const mockRes: any = {
    setHeader: () => {},
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (data: any) => {
      responseData = data;
      return mockRes;
    },
    send: (data: any) => {
        responseData = typeof data === 'string' ? JSON.parse(data) : data;
        return mockRes;
    },
    end: (data: any) => {
        if (data && !responseData) {
            responseData = typeof data === 'string' ? JSON.parse(data) : data;
        }
    },
    get statusCode() { return statusCode; },
    set statusCode(val) { statusCode = val; }
  };
  
  console.log('Note: Running handler logic with mock objects using environment variables from .env.local.');

  try {
    await handler(mockReq, mockRes);
    
    console.log(`\nResponse Status: ${statusCode}`);
    console.log(`Response Data: ${JSON.stringify(responseData, null, 2)}`);

    if (statusCode === 200 && responseData?.ok) {
      console.log('\n✅ Proposal verification logic PASSED.');
      console.log('Check your info@b2w-ai.com inbox to see the internal notification.');
    } else if (statusCode === 202) {
      console.log('\n⚠️ Proposal logic partial success.');
    } else {
      console.log('\n❌ Proposal verification logic FAILED.');
      if (responseData?.error) console.log(`   Error: ${responseData.error}`);
    }
  } catch (err) {
    console.error('\n💥 Unexpected crash during verification:', err);
  }
}

runTest();
