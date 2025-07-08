import axios from 'axios';
import { load } from 'cheerio'; // Named import for cheerio's load function

export async function scrapeBlog(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    let text = '';
    $('p').each((index: number, element: cheerio.Element) => {
      text += $(element).text().trim() + ' ';
    });
    return text.trim();
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape blog');
  }
}