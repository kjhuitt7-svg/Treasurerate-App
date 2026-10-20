import { fetch } from 'expo/fetch';

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'https://www.treasurerate.com/api';

export class RunError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

/**
 * Some agents wrap their whole answer in a ``` code fence, which would show raw ** marks
 * instead of formatting. Strip one wrapping fence (also while the answer is still streaming).
 */
export function unfence(text: string) {
  const open = /^\s*```[a-zA-Z]*[ \t]*\n/;
  if (!open.test(text)) return text;
  return text.replace(open, '').replace(/\n```\s*$/, '');
}

/**
 * Runs an agent on the TreasureRate backend and streams its text output.
 * onChunk receives the full text so far.
 */
export async function runAgent(
  num: number,
  input: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  let res: Response;
  try {
    res = (await fetch(`${API_BASE}/agents/${num}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/plain' },
      body: JSON.stringify({ input }),
      signal,
    })) as unknown as Response;
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e;
    throw new RunError('Could not reach TreasureRate. Check your connection and try again.');
  }

  if (!res.ok) {
    if (res.status === 429) throw new RunError('You are going a little fast. Wait a minute and try again.', 429);
    throw new RunError(`The agent could not finish (error ${res.status}). Please try again.`, res.status);
  }

  let text = '';
  const reader = res.body?.getReader();
  if (!reader) {
    text = unfence(await res.text());
    onChunk(text);
    return text;
  }
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onChunk(unfence(text));
  }
  text = unfence(text + decoder.decode());
  onChunk(text);
  if (!text.trim()) throw new RunError('The agent returned an empty result. Please try again.');
  return text;
}
