import { Readable } from 'stream';
import dotenv from 'dotenv';
import path from 'path';

// Load locally configured env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import handler from '../api/contact-lead.js';

async function runTest() {
  console.log('--- Final Live Verification Test ---\n');

  // We need to provide a body to the handler.
  const validBody = {
    name: 'Antigravity Verification Agent',
    email: 'test@b2w-ai.com', // This should be a real address for full confirmation, but we'll use this as the Lead.
    company: 'B2W - AI Solutions',
    message: 'Test message: Verifying that lead submission successfully routes to info@b2w-ai.com and Supabase.',
    projectAreas: ['Marketing', 'Financials'],
    inquiryType: 'Verification Test',
    sourcePath: '/live-test-flight'
  };

  const mockReq = Readable.from([JSON.stringify(validBody)]);
  (mockReq as any).method = 'POST';
  (mockReq as any).headers = {
    'content-type': 'application/json',
    'x-real-ip': '127.0.0.1'
  };

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
  
  console.log('Dispatching test submission to handler...');

  try {
    await handler(mockReq, mockRes);
    
    if (statusCode === 200 && responseData?.ok) {
        console.log('\n🚀 TEST SUCCESSFUL!');
        console.log('Check your info@b2w-ai.com inbox for an email from "B2W <info@b2w-ai.com>" with the subject "[New Lead] Test Verifier (Verification Test)".');
        console.log('\n(Note: The confirmation email was sent to test@b2w-ai.com.)');
    } else {
        console.log('\n❌ TEST FAILED.');
        console.log('Details:', responseData);
    }
  } catch (err) {
    console.error('\n💥 Unexpected crash during test:', err);
  }
}

runTest();
