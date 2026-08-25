import { Marked, type MarkedOptions } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const marked = new Marked();

/**
 * Compiles markdown to HTML and sanitizes the result with DOMPurify.
 *
 * @remarks
 * Uses a shared `Marked` instance by default. Pass `options` to override
 * parsing behavior (e.g. `{ gfm: false }`); a dedicated `Marked` instance is
 * created per call in that case so the shared instance is never mutated.
 * Sanitization runs in both server and browser environments via
 * `isomorphic-dompurify`.
 *
 * @param markdown - The markdown source to convert.
 * @param options - Optional `MarkedOptions` overrides for the parser.
 * @returns A promise resolving to the sanitized HTML string.
 * @example
 * const html = await markdownToHtml('# Hello, world!');
 */
export async function markdownToHtml(markdown: string, options?: MarkedOptions): Promise<string> {
  const parser = options ? new Marked().setOptions(options) : marked;
  const html = parser.parse(markdown);
  return DOMPurify.sanitize(await html);
}
