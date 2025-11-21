import React, { useState } from 'react';
import { useCreateLink } from '../../hooks/useLinks';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Copy, Check, Link2, Shield, Zap, ArrowRight, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { copyToClipboard, isValidUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const CreateLinkForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [existingLink, setExistingLink] = useState<{ shortUrl: string; shortCode: string } | null>(null);

  const createLinkMutation = useCreateLink();

  const validateCustomCode = (code: string): string | null => {
    if (code.length === 0) return null;
    
    if (!/^[A-Za-z0-9_-]*$/.test(code)) {
      return 'Custom code can only contain letters, numbers, hyphens, and underscores';
    }
    
    if (code.length > 10) {
      return 'Custom code must be 10 characters or less';
    }
    
    return null;
  };

  const handleCustomCodeChange = (value: string) => {
    setCustomCode(value);
    const error = validateCustomCode(value);
    setValidationError(error);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isValidUrl(url)) {
    setValidationError('Please enter a valid URL');
      toast.error('Please enter a valid URL');
    return;
  }

  if (customCode && validateCustomCode(customCode)) {
    const error = validateCustomCode(customCode);
    setValidationError(error);
      toast.error(error || 'Invalid custom code');
    return;
  }

  setValidationError(null);
  setExistingLink(null);

  createLinkMutation.mutate(
    { 
      originalUrl: url, 
      customCode: customCode || undefined 
    },
    {
      onSuccess: (data) => {
        setCreatedLink(data.shortUrl);
        setUrl('');
        setCustomCode('');
        setShowCustomCode(false);
        setValidationError(null);
          toast.success('Link created successfully!');
      },
      onError: (error: Error) => {
        // Check if it's a duplicate URL error with existing link info
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.existingLink) {
            setExistingLink(errorData.existingLink);
            setValidationError(errorData.error);
            toast('This URL has already been shortened', {
                icon: '⚠️',
                duration: 5000,
              });            
              return;
          }
        } catch {
          // Not a JSON error, handle normally
          setValidationError(error.message);
            toast.error(error.message);
        }
      },
    }
  );
};

  const handleCopy = async () => {
    if (createdLink) {
      const success = await copyToClipboard(createdLink);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard!');
      }
    }
  };

  const generateExample = () => {
    return `${window.location.origin}/${customCode || 'docs'}`;
  };

  const handleUseExistingLink = () => {
    if (existingLink) {
      setCreatedLink(existingLink.shortUrl);
      setUrl('');
      setCustomCode('');
      setExistingLink(null);
      setValidationError(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shorten a long link</h2>
        <div className="flex items-center justify-center space-x-3 text-green-600 mb-6">
          <Shield className="h-6 w-6" />
          <span className="text-xl font-semibold">No credit card required</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* URL Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
              Paste your long link here
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setValidationError(null);
                  setExistingLink(null);
                }}
                required
                disabled={createLinkMutation.isPending}
                className="text-xl py-6 px-6 border-2 border-gray-300 focus:border-blue-500 transition-colors rounded-xl text-center placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Custom Code Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Custom short code (optional)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomCode(!showCustomCode)}
                className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
              >
                {showCustomCode ? 'Hide' : 'Add custom code'}
              </button>
            </div>

            {showCustomCode && (
              <div className="space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom code
                    </label>
                    <Input
                      placeholder="docs"
                      value={customCode}
                      onChange={(e) => handleCustomCodeChange(e.target.value)}
                      disabled={createLinkMutation.isPending}
                      className="border-2 border-gray-300 focus:border-blue-500 transition-colors font-mono"
                      maxLength={10}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {customCode.length}/10 characters
                      </span>
                      {validationError && customCode && (
                        <span className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Invalid format
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your short link will be
                    </label>
                    <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm text-gray-600">
                      {generateExample()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Example: {window.location.origin}/docs → https://example.com/docs
                    </p>
                  </div>
                </div>

                {/* Validation Rules */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Custom code rules:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${customCode.length <= 10 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Maximum 10 characters
                    </li>
                    <li className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${/^[A-Za-z0-9_-]*$/.test(customCode) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Letters, numbers, hyphens, and underscores only
                    </li>
                    <li className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 bg-gray-300" />
                      Must be globally unique
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              loading={createLinkMutation.isPending}
              disabled={!url || !!validationError}
              className="w-full max-w-md py-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              icon={Zap}
            >
              Get your link for free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </form>

        {/* Existing Link Message */}
        {existingLink && (
          <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3 text-yellow-800 mb-4">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-lg">This URL has already been shortened!</p>
                <p className="text-sm mt-1">You can use the existing short link below.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={existingLink.shortUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border border-yellow-300 rounded-lg bg-white text-yellow-900 font-mono text-lg font-bold"
                />
                <Button
                  onClick={() => {
                    copyToClipboard(existingLink.shortUrl);
                    toast.success('Link copied to clipboard!');
                  }}
                  variant="secondary"
                  size="lg"
                  icon={Copy}
                  className="whitespace-nowrap px-6 py-3 text-lg"
                >
                  Copy
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleUseExistingLink}
                  variant="primary"
                  size="md"
                  icon={Link2}
                >
                  Use This Link
                </Button>
                <a
                  href={existingLink.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Redirect
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {createdLink && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-3 text-green-600 mb-4">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg">Link created successfully!</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={createdLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-green-300 rounded-lg bg-white text-green-900 font-mono text-lg font-bold"
                />
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  size="lg"
                  icon={copied ? Check : Copy}
                  className="whitespace-nowrap px-6 py-3 text-lg"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="flex space-x-3 justify-center">
                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Redirect
                </a>
                <p className="text-sm text-gray-600 text-center">
                  Share this link: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{createdLink}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {validationError && !existingLink && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3 text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Unable to create link</p>
                <p className="text-sm mt-1">{validationError}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Free Plan Features */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Sign up for free. Your free plan includes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">Short links</div>
            <p className="text-gray-600">Create unlimited short links</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">Custom codes</div>
            <p className="text-gray-600">Personalized short URLs</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">Link tracking</div>
            <p className="text-gray-600">Monitor click analytics</p>
          </div>
        </div>
      </div>

      {/* Trusted Brands */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-lg mb-8">Trusted by leading brands</p>
        <div className="flex justify-center items-center space-x-12 opacity-60">
          <div className="text-2xl font-bold text-gray-700">Curology</div>
          <div className="text-2xl font-bold text-gray-700">NOVASIA</div>
          <div className="text-2xl font-bold text-gray-700">BONYST</div>
          <div className="text-2xl font-bold text-gray-700">BitView</div>
          <div className="text-2xl font-bold text-gray-700">SMALLS</div>
        </div>
      </div>
    </div>
  );
};