'use client';

import { useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleRefreshSession = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
        const res = await fetch('/api/auth/refreshSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            credentials: 'include', // Ensure cookies are sent with the request
      });

      const data = await res.json();

      if (!res.ok) {
        setError(`Error: ${res.status} - ${data.message || 'Unknown error'}`);
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  return <></>;
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Test Page - Session Refresh</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={handleRefreshSession}
            disabled={loading}
            className="bg-brand-blue hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {loading ? 'Refreshing...' : 'Refresh Session'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-gray-900 font-semibold mb-2">Response</h2>
            <pre className="text-gray-700 text-sm overflow-auto bg-white p-3 rounded border border-gray-200">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
