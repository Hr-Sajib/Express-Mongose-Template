// utils/extractPdfText.ts
import OpenAI from 'openai';
import { file as createTempFile } from 'tmp-promise';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Replace with your assistant ID (create once)
const ASSISTANT_ID = 'asst_CzBPh0MBkAy1H98of17dhc9E'; // ← Paste your ID here

export async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  // Step 1: Create temp file (auto-cleaned)
  const { path: tempFilePath, cleanup } = await createTempFile({
    postfix: '.pdf',
  });

  try {
    // Write buffer to temp file
    await fs.promises.writeFile(tempFilePath, pdfBuffer);

    // Step 2: Upload via ReadStream
    const uploadedFile = await openai.files.create({
      file: fs.createReadStream(tempFilePath),
      purpose: 'assistants',
    });

    // Step 3: Create thread with attachment
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: 'Extract all text from this PDF exactly as it appears. Preserve formatting, bullets, and tables. Return only the clean text.',
          attachments: [
            {
              file_id: uploadedFile.id,
              tools: [{ type: 'file_search' }],
            },
          ],
        },
      ],
    });

    // Step 4: Run assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Step 5: Get response
    const messages = await openai.beta.threads.messages.list(thread.id, { limit: 1 });
    const assistantMessage = messages.data[0];

    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      throw new Error('No response from assistant');
    }

    let extractedText = '';
    for (const block of assistantMessage.content) {
      if (block.type === 'text') {
        extractedText = block.text.value;
        break;
      }
    }

    if (!extractedText.trim()) throw new Error('No text extracted');

    // Cleanup OpenAI file
    await openai.files.delete(uploadedFile.id);

    return extractedText.trim();
  } finally {
    // Always clean up temp file
    await cleanup();
  }
}