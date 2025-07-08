import { NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/scrape';
import { summarizeText } from '@/lib/summarize';
import { translateToUrdu } from '@/lib/translate';
import { saveSummary } from '@/lib/supabase';
import { saveFullText } from '@/lib/mongodb';

export async function POST(request: Request) {
  const { url } = await request.json();
  try {
    const fullText = await scrapeBlog(url);
    const summaryText = summarizeText(fullText);
    const urduText = translateToUrdu(summaryText);
    await saveSummary(url, summaryText, urduText);
    await saveFullText(url, fullText);
    return NextResponse.json({ summary: summaryText, urduSummary: urduText });
  }  catch (error) {
  console.error('Error in summarize route:', error);
  return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
