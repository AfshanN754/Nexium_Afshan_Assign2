'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogSummarizer() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to summarize');
      setSummary(data.summary);
      setUrduSummary(data.urduSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Blog Summarizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleSummarize} disabled={loading}>
            {loading ? 'Processing...' : 'Summarize'}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {summary && (
            <div>
              <h3 className="font-bold">English Summary</h3>
              <p>{summary}</p>
            </div>
          )}
          {urduSummary && (
            <div>
              <h3 className="font-bold">Urdu Summary</h3>
              <p>{urduSummary}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}