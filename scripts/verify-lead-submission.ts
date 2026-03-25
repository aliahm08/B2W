import { Readable } from 'stream';
import dotenv from 'dotenv';
import path from 'path';

// Load locally configured env vars to test integration logic
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import handler from '../api/contact-lead.js';

async function runTest() {
  console.log('--- Starting Workflow Verification Test ---\n');

  // We need to provide a body to the handler.
  // Since 'readJsonBody' expects a Readable, we set up mockReq as one.
  const validBody = {
    name: 'Test Verifier',
    email: 'test@b2w-ai.com',
    company: 'Verification Labs',
    message: 'I am verifying the workflow routing.',
    projectAreas: ['Marketing'],
    inquiryType: 'Marketing',
    sourcePath: '/verification-test'
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
        if (data) {
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
      console.log('\n✅ Workflow verification logic PASSED.');
    } else if (statusCode === 202) {
      console.log('\n⚠️ Workflow logic partial success (likely missing or incorrect env vars).');
      console.log('This confirms the high-level routing and validation is working.');
    } else {
      console.log('\n❌ Workflow verification logic FAILED.');
      if (responseData?.error) console.log(`   Error: ${responseData.error}`);
    }
  } catch (err) {
    console.error('\n💥 Unexpected crash during verification:', err);
  }
}

runTest();
