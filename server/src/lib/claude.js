import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

const client = new Anthropic();

const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-8';

const AnswerResultSchema = z.object({
  answers: z.array(
    z.object({
      question_number: z.number(),
      type: z.enum(['closed', 'open']),
      recognized_answer: z.string().nullable(),
      is_correct: z.boolean().nullable(),
      recognized_text: z.string().nullable(),
      suggested_score: z.number().nullable(),
      reasoning: z.string().nullable(),
    })
  ),
});

function buildAnswerKeyText(questions) {
  const key = questions.map((q) => ({
    question_number: q.question_number,
    type: q.type,
    correct_answer: q.type === 'closed' ? q.correct_answer : undefined,
    model_answer: q.type === 'open' ? q.model_answer : undefined,
    max_points: q.max_points,
    grading_criteria: q.grading_criteria || undefined,
  }));
  return JSON.stringify(key, null, 2);
}

const SYSTEM_PROMPT = `Jesteś asystentem nauczyciela sprawdzającym pracę egzaminacyjną. Otrzymujesz zdjęcie
kartki odpowiedzi ucznia oraz klucz odpowiedzi. Dla pytań zamkniętych rozpoznaj zaznaczoną literę
i porównaj z kluczem. Dla pytań otwartych odczytaj pismo odręczne i zasugeruj liczbę punktów na
podstawie wzorcowej odpowiedzi i kryteriów oceniania, dodając krótkie uzasadnienie.

Jeśli pismo jest nieczytelne, zwróć recognized_text: "NIECZYTELNE" i suggested_score: null,
żeby nauczyciel sprawdził ręcznie. Nigdy nie zgaduj — jeśli nie widzisz odpowiedzi na pytanie,
zwróć recognized_answer/recognized_text jako null.`;

export async function gradeSubmissionImage({ imageBase64, mediaType, questions }) {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 8192,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: zodOutputFormat(AnswerResultSchema, 'exam_answers'),
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 },
          },
          {
            type: 'text',
            text: `Klucz odpowiedzi:\n${buildAnswerKeyText(questions)}`,
          },
        ],
      },
    ],
  });

  if (!response.parsed_output) {
    throw new Error('Claude nie zwrócił poprawnie ustrukturyzowanej odpowiedzi');
  }

  return response.parsed_output.answers;
}
