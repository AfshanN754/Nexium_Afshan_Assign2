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
  const [copiedStates, setCopiedStates] = useState({
    english: false,
    urdu: false
  });

  const handleSummarize = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Server error response:', text.substring(0, 200));
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setSummary(data.summary || '');
      setUrduSummary(data.urduSummary || '');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'english' | 'urdu') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Header Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Summarizer
            </CardTitle>
            <p className="text-gray-600 mt-2">Enter a blog URL to get instant summaries in English and Urdu</p>
          </CardHeader>
        </Card>

        {/* Input Card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Enter blog URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                />
              </div>
              <Button
                onClick={handleSummarize}
                disabled={loading || !url.trim()}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Summarize'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Card */}
        {error && (
          <Card className="shadow-lg border-0 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error:</span> {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Summary Card */}
          {summary && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">EN</span>
                    </div>
                    English Summary
                  </CardTitle>
                  <Button
                    onClick={() => copyToClipboard(summary, 'english')}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  >
                    {copiedStates.english ? (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy
                      </div>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {summary}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Urdu Summary Card */}
          {urduSummary && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">اردو</span>
                    </div>
                    Urdu Translation
                  </CardTitle>
                  <Button
                    onClick={() => copyToClipboard(urduSummary, 'urdu')}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 transition-colors"
                  >
                    {copiedStates.urdu ? (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy
                      </div>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-right" dir="rtl">
                  {urduSummary}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Loading State Card */}
        {loading && !summary && !urduSummary && (
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h3 className="text-lg font-semibold text-gray-800">Processing your request...</h3>
                <p className="text-gray-600">Fetching and summarizing the blog content</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}