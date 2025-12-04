// src/app/utils/ass.ts  (or any name you like)

import OpenAI from 'openai';
import config from '../config';

const openai = new OpenAI({
  apiKey: config.open_api_key
});

async function createAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: 'PDF Text Extractor',
      instructions: 'Extract ALL text from any PDF exactly as it appears. Preserve formatting, bullets, tables, and structure. Return ONLY the clean extracted text — no summaries, no explanations, no markdown unless it exists in the original.',
      model: 'gpt-4o-mini',
      tools: [{ type: 'file_search' }],
    });

    console.log('Assistant created successfully!');
    console.log('Assistant ID:', assistant.id);
    console.log('\nCopy this line into extractPdfText.ts:\n');
    console.log(`const ASSISTANT_ID = '${assistant.id}';`);
  } catch (error: any) {
    console.error('Failed to create assistant:', error.message || error);
  }
}

createAssistant();