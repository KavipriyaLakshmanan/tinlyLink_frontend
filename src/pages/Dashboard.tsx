import React, { useState } from 'react';
import { useLinks, useDeleteLink } from '../hooks/useLinks';
import { CreateLinkForm } from '../components/forms/CreateLinkForm';
import { Button } from '../components/ui/Button';
import type { Link } from '../types';
import { formatDate, truncateUrl, copyToClipboard } from '../utils/helpers';
import { Trash2, Copy, ExternalLink, BarChart3, QrCode, Link2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { data: links,refetch } = useLinks();
  const deleteLinkMutation = useDeleteLink();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const handleDelete = (code: string) => {
      deleteLinkMutation.mutate(code, {
        onSuccess: () => {
          toast.success('Link deleted successfully!');
        },
        onError: () => {
          toast.error('Failed to delete link');
        }
      });
        refetch();
  };

  const handleCopy = async (shortUrl: string, code: string) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
        toast.success('Link copied to clipboard!'); 
    }
    else {
        toast.error('Failed to copy link');
    }
    refetch();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exact Bit.ly Design */}
      <div className="bg-gradient-to-br from-[#0a2d6c] to-[#0d47a1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Build stronger digital connections
            </h1>
            <p className="text-xl mb-12 opacity-90 leading-relaxed">
              Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build, edit, and track everything inside the TinyLink Platform.
            </p>
            
            {/* Feature Tabs */}
            <div className="flex justify-center space-x-1 mb-12 bg-white/10 rounded-lg p-1 inline-flex">
              <button className="flex items-center space-x-2 bg-white text-[#0a2d6c] px-8 py-4 rounded-md font-semibold transition-all">
                <Link2 className="h-5 w-5" />
                <span>Short Link</span>
              </button>
              <button className="flex items-center space-x-2 text-white/80 px-8 py-4 rounded-md font-semibold transition-all hover:text-white">
                <QrCode className="h-5 w-5" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* URL Shortener Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreateLinkForm />
        </div>
      </div>

      {/* Links Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
          </div>

          {!links || links.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Link2 className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No links yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto text-lg">
                Create your first short link to get started with tracking and analytics.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links?.map((link: Link) => (
                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <a 
                            href={`${VITE_API_BASE_URL}/${link.shortCode}`}
                            className="font-mono text-lg font-bold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.shortCode}
                          </a>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopy(`${VITE_API_BASE_URL}/${link.shortCode}`, link.shortCode)}
                            icon={copiedCode === link.shortCode ? Copy : Copy}
                          >
                            {copiedCode === link.shortCode ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-base text-gray-900 max-w-md truncate">
                            {truncateUrl(link.originalUrl, 50)}
                          </span>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-semibold bg-green-100 text-green-800">
                          {link.totalClicks}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-base text-gray-600">
                        {formatDate(link.lastClicked)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-base font-medium space-x-4">
                        <RouterLink
                          to={`/code/${link.shortCode}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                        >
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Stats
                        </RouterLink>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(link.shortCode)}
                          loading={deleteLinkMutation.isPending}
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};