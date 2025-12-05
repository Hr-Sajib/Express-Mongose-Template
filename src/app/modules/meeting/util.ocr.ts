// // utils/extractFilesText.ts
import OpenAI from 'openai';
import { file as createTempFile } from 'tmp-promise';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = 'asst_CzBPh0MBkAy1H98of17dhc9E'; // Your assistant

const getFileType = (mimetype: string) => {
  if (mimetype.includes('pdf')) return 'PDF';
  if (mimetype.includes('powerpoint')) return 'PowerPoint';
  if (mimetype.includes('word')) return 'Word Document';
  return 'Document';
};

export async function extractFilesText(files: Express.Multer.File[]): Promise<string> {
  if (!files || files.length === 0) return '';

  const extractedTexts: string[] = [];

  for (const file of files) {
    const { path: tempPath, cleanup } = await createTempFile({
      postfix: path.extname(file.originalname) || '.bin',
    });

    try {
      await fs.promises.writeFile(tempPath, file.buffer);

      const uploadedFile = await openai.files.create({
        file: fs.createReadStream(tempPath),
        purpose: 'assistants',
      });

      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: `Extract all text from this ${getFileType(file.mimetype)} exactly as it appears. Preserve formatting, bullets, tables, and structure. Return only clean text.`,
            attachments: [{ file_id: uploadedFile.id, tools: [{ type: 'file_search' }] }],
          },
        ],
      });

      const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: ASSISTANT_ID,
      });

      const messages = await openai.beta.threads.messages.list(thread.id, { limit: 1 });
      const message = messages.data[0];
      let text = '';

      for (const block of message.content) {
        if (block.type === 'text') {
          text = block.text.value;
          break;
        }
      }

      if (text.trim()) {
        extractedTexts.push(text.trim());
      }

      await openai.files.delete(uploadedFile.id);
    } catch (err: any) {
      console.error(`Failed to extract from ${file.originalname}:`, err.message);
    } finally {
      await cleanup();
    }
  }

  if (extractedTexts.length === 0) return '[No text extracted from files]';

  return extractedTexts
    .map((text, i) => `--- Source ${i + 1}: ${files[i].originalname} ---\n${text}`)
    .join('\n\nAnother information source:\n\n');
}


