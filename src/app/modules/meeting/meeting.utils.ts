// utils/meetingEvaluator.ts
import OpenAI from 'openai';
import config from '../../config';
import { IMeeting } from './meeting.interface';


const openai = new OpenAI({
  apiKey: config.open_api_key,
});

export async function evaluateMeetingTranscript(
  transcript: { person: string; speech: string; timestamp: string }[]
): Promise<Partial<IMeeting>> {
  if (!transcript?.length) {
    throw new Error('Transcript is required and cannot be empty');
  }

  const compactTranscript = transcript
    .map(entry => `${entry.person}: ${entry.speech.trim()}`)
    .join('\n');

  const systemPrompt = `You are an expert B2B sales coach. Analyze the discovery call and return ONLY valid JSON with no extra text.`;

  const userPrompt = `Return JSON with this exact structure:

{
  "engagementScore": number (0-100),
  "overallScore": number (0-100),
  "sentimentScore": number (0-10, where 10 = extremely positive, 0 = extremely negative),
  "talktimeDistribution": [{ "person": string, "percentage": number }],
  "activeListenningScore": "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F",
  "topicsDiscussed": string[],
  "opportunities": [{ "title": string, "description": string }],
  "risksIdentified": [{ "title": string, "description": string }],
  "keyPoints": [{ "title": string, "description": string }],
  "actionItems": [{ "action": string, "assignedTo": string }],
  "nextSteps": { "step": string, "timestamp": string }
}

Transcript:
${compactTranscript}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error('Empty response from OpenAI');

    const data = JSON.parse(raw);

    return {
      engagementScore: Math.max(0, Math.min(100, Math.round(Number(data.engagementScore) || 70))),
      overallScore: Math.max(0, Math.min(100, Math.round(Number(data.overallScore) || 75))),
      sentimentScore: Math.max(0, Math.min(10, Math.round(Number(data.sentimentScore) || 5))),

      talktimeDistribution: Array.isArray(data.talktimeDistribution)
        ? data.talktimeDistribution.map((t: any) => ({
            person: String(t.person || 'Unknown').trim(),
            percentage: Math.max(0, Math.min(100, Math.round(Number(t.percentage) || 0))),
          }))
        : [],

      activeListenningScore: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].includes(data.activeListenningScore)
        ? data.activeListenningScore
        : 'B',

      topicsDiscussed: Array.isArray(data.topicsDiscussed)
        ? data.topicsDiscussed.map(String).filter(Boolean)
        : [],

      opportunities: Array.isArray(data.opportunities)
        ? data.opportunities.map((o: any) => ({
            title: String(o.title || '').trim(),
            description: String(o.description || '').trim(),
          }))
        : [],

      risksIdentified: Array.isArray(data.risksIdentified)
        ? data.risksIdentified.map((r: any) => ({
            title: String(r.title || '').trim(),
            description: String(r.description || '').trim(),
          }))
        : [],

      keyPoints: Array.isArray(data.keyPoints)
        ? data.keyPoints.map((k: any) => ({
            title: String(k.title || '').trim(),
            description: String(k.description || '').trim(),
          }))
        : [],

      actionItems: Array.isArray(data.actionItems)
        ? data.actionItems.map((a: any) => ({
            action: String(a.action || '').trim(),
            assignedTo: String(a.assignedTo || 'You').trim(),
          }))
        : [],

      nextSteps: data.nextSteps?.step
        ? {
            step: String(data.nextSteps.step).trim(),
            timestamp: String(data.nextSteps.timestamp || 'TBD').trim(),
          }
        : { step: 'Send follow-up', timestamp: 'Within 3 days' },
    };
  } catch (error: any) {
    console.error('AI evaluation failed:', error.message);
    throw new Error(`Transcript analysis failed: ${error.message}`);
  }
}

