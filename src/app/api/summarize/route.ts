import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { saveSummaryAndFullText } from "@/lib/supabase";
import { translateToUrdu } from "@/lib/translate";

// Function to scrape blog text with retry logic
async function scrapeBlog(url: string, maxRetries: number = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data } = await axios.get(url, {
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        timeout: 10000, // 10 second timeout
      });
      
      const $ = cheerio.load(data);
      
      // Remove script and style elements
      $('script, style, nav, footer, header, aside').remove();
      
      // Extract text from common content areas
      let text = '';
      
      const selectors = [
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '.blog-content',
        'main',
        '.main-content',
        'p'
      ];
      
      for (const selector of selectors) {
        const content = $(selector).text();
        if (content && content.length > 100) {
          text = content;
          break;
        }
      }
      
      if (!text) {
        text = $('p').map((i, el) => $(el).text()).get().join(' ');
      }
      
      text = text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 5000); // Limit to 5000 characters
      
      return text || "No content extracted";
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Scraping error after retries:', error);
        throw new Error(`Scraping failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
      const errorMessage = error instanceof Error ? error.message : 'Unknown error type';
      console.log(`Retry ${attempt}/${maxRetries} after ${delay}ms due to:`, errorMessage);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return "No content extracted"; // Unreachable but included for type safety
}

// [Rest of the file remains unchanged]

// Function to simulate AI summary
function summarizeText(fullText: string): string {
  const DEFAULT_STOPWORDS = new Set([
    'the', 'is', 'in', 'and', 'to', 'of', 'a', 'for', 'on', 'with', 'that', 'as', 'at', 'by',
    'from', 'an', 'be', 'this', 'it', 'are', 'was', 'or', 'we', 'his', 'her', 'their', 'our',
    'but', 'not', 'have', 'has', 'had', 'been', 'will', 'can', 'could', 'should', 'would'
  ]);

  if (!fullText?.trim()) return 'No content available';

  const clean = fullText.replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.?!]+[.?!]+(?:\s|$)/g) ?? [clean];

  const freq: Record<string, number> = {};
  const uniqueTopics: Set<string> = new Set();
  clean
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 2 && !DEFAULT_STOPWORDS.has(w))
    .forEach(w => {
      freq[w] = (freq[w] ?? 0) + 1;
      if (freq[w] === 1) uniqueTopics.add(w);
    });

  const scored = sentences.map((s, idx) => {
    const words = s.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !DEFAULT_STOPWORDS.has(w));
    const baseScore = words.reduce((acc, w) => acc + (freq[w] ?? 0), 0);
    const diversityBonus = Array.from(uniqueTopics).filter(w => words.includes(w)).length * 10;
    return { s: s.trim(), score: baseScore + diversityBonus, idx };
  });

  scored.sort((a, b) => b.score - a.score);
  const chosen: { s: string; idx: number }[] = [];
  const minToSelect = Math.min(10, sentences.length);

  for (const cand of scored) {
    if (chosen.length >= minToSelect) break;
    if (!chosen.some(c => c.idx === cand.idx)) chosen.push(cand);
  }

  if (chosen.length < minToSelect) {
    const remaining = scored.filter(c => !chosen.some(ch => ch.idx === c.idx));
    chosen.push(...remaining.slice(0, minToSelect - chosen.length));
  }

  chosen.sort((a, b) => a.idx - b.idx);

  const summary = chosen.map(c => c.s).join(' ');
  return summary || sentences.slice(0, 10).join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    if (!url.trim()) {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    console.log("Processing URL:", url);

    const fullText = await scrapeBlog(url);
    console.log("Scraped text length:", fullText.length);

    if (!fullText || fullText === "No content extracted") {
      return NextResponse.json(
        { error: "No text could be extracted from the URL" },
        { status: 400 }
      );
    }

    const summaryText = summarizeText(fullText);
    console.log("Generated summary:", summaryText);

    let urduText: string;
    try {
      urduText = await translateToUrdu(summaryText);
      console.log("Generated Urdu translation");
    } catch (translateError) {
      console.warn("Translation error (using fallback):", translateError);
      urduText = await translateToUrdu(summaryText); // Retry once with fallback
      console.log("Retried Urdu translation");
    }

    try {
      await saveSummaryAndFullText(url, summaryText, urduText, fullText);
      console.log("Successfully saved to databases");
    } catch (saveError) {
      console.error("Database save error:", saveError);
    }

    return NextResponse.json(
      { summary: summaryText, urduSummary: urduText, success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in summarize route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}