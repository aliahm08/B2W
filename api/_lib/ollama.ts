import { config } from './config';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function getEndpoint() {
  if (config.ollama.apiStyle === 'openai') {
    return `${config.ollama.baseUrl}/chat/completions`;
  }

  return `${config.ollama.baseUrl}/api/chat`;
}

function buildPayload(messages: ChatMessage[]) {
  if (config.ollama.apiStyle === 'openai') {
    return {
      model: config.ollama.model,
      messages,
      stream: false,
      temperature: 0.2,
    };
  }

  return {
    model: config.ollama.model,
    messages,
    stream: false,
    options: {
      temperature: 0.2,
    },
  };
}

function extractResponse(data: any): string {
  if (config.ollama.apiStyle === 'openai') {
    return data?.choices?.[0]?.message?.content ?? '';
  }

  return data?.message?.content ?? '';
}

export async function chatWithOllama(messages: ChatMessage[]): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.ollama.apiKey) {
    headers.Authorization = `Bearer ${config.ollama.apiKey}`;
  }

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers,
    body: JSON.stringify(buildPayload(messages)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = extractResponse(data).trim();

  if (!content) {
    throw new Error('Ollama returned an empty response.');
  }

  return content;
}
