import React, { useState } from 'react';
import { subscribeToNewsletter, type SubscriptionStatus } from '../lib/supabase';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          status === 'loading'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Subscribe'
        )}
      </button>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="absolute mt-2 flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Successfully subscribed!</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute mt-2 flex items-center text-red-600">
          <XCircle className="w-5 h-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
}