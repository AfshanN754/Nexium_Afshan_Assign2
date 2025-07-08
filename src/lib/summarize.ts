export function summarizeText(text: string, wordLimit: number = 100): string {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const summary = words.slice(0, wordLimit).join(' ');
  return summary.length > 0 ? summary + '...' : 'No content available';
}