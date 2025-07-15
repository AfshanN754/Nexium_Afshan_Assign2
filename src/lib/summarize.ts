// utils/summarize.ts
// A light-weight extractive summarizer (no external API calls)

const DEFAULT_STOPWORDS = new Set([
  'the', 'is', 'in', 'and', 'to', 'of', 'a', 'for', 'on', 'with', 'that', 'as', 'at', 'by',
  'from', 'an', 'be', 'this', 'it', 'are', 'was', 'or', 'we', 'his', 'her', 'their', 'our',
  'but', 'not', 'have', 'has', 'had', 'been', 'will', 'can', 'could', 'should', 'would'
]);

export function summarizeText(
  text: string,
  minSentences: number = 10, // Target 8-10 lines, default to 10
  customStopWords: Set<string> = DEFAULT_STOPWORDS
): string {
  if (!text?.trim()) return 'No content available';

  // 1️⃣  ‑‑‑ Normalize & split into sentences
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.?!]+[.?!]+(?:\s|$)/g) ?? [clean]; // Fallback to single sentence

  // 2️⃣  ‑‑‑ Build frequency map (case-insensitive) and track unique topics
  const freq: Record<string, number> = {};
  const uniqueTopics: Set<string> = new Set();
  clean
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2 && !customStopWords.has(w))
    .forEach(w => {
      freq[w] = (freq[w] ?? 0) + 1;
      if (freq[w] === 1) uniqueTopics.add(w); // Track first occurrence for diversity
    });

  // 3️⃣  ‑‑‑ Score each sentence with diversity bonus
  const scored = sentences.map((s, idx) => {
    const words = s.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !customStopWords.has(w));
    const baseScore = words.reduce((acc, w) => acc + (freq[w] ?? 0), 0);
    const diversityBonus = Array.from(uniqueTopics).filter(w => words.includes(w)).length * 10; // Boost sentences with unique topics
    return { s: s.trim(), score: baseScore + diversityBonus, idx };
  });

  // 4️⃣  ‑‑‑ Select at least minSentences, prioritizing high scores
  scored.sort((a, b) => b.score - a.score); // Highest score first
  const chosen: { s: string; idx: number }[] = [];
  const minToSelect = Math.min(minSentences, sentences.length); // Don’t exceed available sentences

  for (const cand of scored) {
    if (chosen.length >= minToSelect) break;
    if (!chosen.some(c => c.idx === cand.idx)) chosen.push(cand); // Avoid duplicates
  }

  // If fewer than minSentences selected, fill with remaining high-scored sentences
  if (chosen.length < minToSelect) {
    const remaining = scored.filter(c => !chosen.some(ch => ch.idx === c.idx));
    chosen.push(...remaining.slice(0, minToSelect - chosen.length));
  }

  // Preserve original article order
  chosen.sort((a, b) => a.idx - b.idx);

  const summary = chosen.map(c => c.s).join(' ');
  return summary || sentences.slice(0, minSentences).join(' '); // Fallback to first sentences if no high scores
}