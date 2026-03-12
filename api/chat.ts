import { buildKnowledgeContext } from './_lib/corpus';
import { allowMethods, readJsonBody, sendJson } from './_lib/http';
import { chatWithOllama } from './_lib/ollama';

type IncomingMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody<{ messages?: IncomingMessage[] }>(req);
    const messages = (body.messages ?? [])
      .filter((message) => message?.content?.trim())
      .slice(-10);

    if (!messages.length) {
      sendJson(res, 400, { error: 'At least one message is required.' });
      return;
    }

    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user');

    if (!latestUserMessage) {
      sendJson(res, 400, { error: 'A user message is required.' });
      return;
    }

    const knowledgeContext = await buildKnowledgeContext(latestUserMessage.content);
    const systemPrompt = [
      'You are the B2W website assistant.',
      'Your job is to help visitors understand B2W services, case studies, industries, and team capabilities using the provided knowledge context.',
      'You can also help visitors request time and book a consultation. If a visitor wants to book, tell them to use the booking form in the site assistant and mention that availability is shown there when enabled.',
      'Be concise, accurate, and commercially useful. Do not invent services, pricing, case studies, integrations, or guarantees that are not supported by the knowledge context.',
      'If the knowledge context is incomplete for a question, say so plainly and offer the closest supported answer.',
      'Knowledge context follows.',
      knowledgeContext || 'No knowledge documents were available.',
    ].join('\n\n');

    const reply = await chatWithOllama([
      { role: 'system', content: systemPrompt },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ]);

    sendJson(res, 200, { reply });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected chat failure.',
    });
  }
}
