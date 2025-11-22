import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLinkStats } from '../hooks/useLinks';
import { Button } from '../components/ui/Button';
import { formatDate, copyToClipboard } from '../utils/helpers';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { data: stats, isLoading, error } = useLinkStats(code!);

 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL);

  const handleCopy = async () => {
    if (stats) {
      await copyToClipboard(`${API_BASE_URL}/${stats.shortCode}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading stats: {error?.message || 'Link not found'}</p>
        <Link to="/" className="text-primary-600 hover:text-primary-800 mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="secondary" icon={ArrowLeft}>
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Link Statistics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Short Code</h3>
          <div className="flex items-center space-x-2">
            <code className="font-mono text-xl bg-gray-100 px-3 py-2 rounded">
              {stats.shortCode}
            </code>
            <Button variant="secondary" size="sm" onClick={handleCopy} icon={Copy}>
              Copy
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalClicks}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Created</h3>
          <p className="text-lg text-gray-600">{formatDate(stats.createdAt)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Clicked</h3>
          <p className="text-lg text-gray-600">{formatDate(stats.lastClicked)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Original URL</h3>
        <div className="flex items-center space-x-2">
          <p className="text-gray-600 flex-1 break-all">{stats.originalUrl}</p>
          <a
            href={stats.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Short URL</h3>
        <div className="flex items-center space-x-2">
          <code className="font-mono text-lg bg-gray-100 px-3 py-2 rounded flex-1">
            {API_BASE_URL}/{stats.shortCode}
          </code>
          <Button variant="secondary" onClick={handleCopy} icon={Copy}>
            Copy URL
          </Button>
        </div>
      </div>
    </div>
  );
};