import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveSummary(url: string, summary: string, urduSummary: string) {
  const { error } = await supabase
    .from('summaries')
    .insert([{ url, summary, urdu_summary: urduSummary }]);
  if (error) throw new Error(`Supabase error: ${error.message}`);
}