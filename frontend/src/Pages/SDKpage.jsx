import React, { useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';
import ThemeToggle from '../assets/ThemeToggle';

const IntegrationGuide = () => {
  const [copied, setCopied] = useState(false);

  const sdkSnippet = `<script src="https://viewcount-backend.onrender.com/analytics.js" defer></script>
<script defer>
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Analytics) {
      window.Analytics.init('<YOUR-UNIQUE-API-KEY>');
    } else {
      console.error('Analytics SDK not loaded.');
    }
  });
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sdkSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hide-scrollbar overflow-y-auto h-screen w-full bg-white dark:bg-[#090e1a] px-8 py-12 pl-64 transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <div className="fixed right-4 bottom-4 z-50">
        <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-xl">
          <ThemeToggle />
        </div>
      </div>

      {/* Page Container */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Integrate Analytics in Minutes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A quick, elegant integration to start tracking user interactions on your website.
          </p>
        </header>

        {/* Step Cards */}
        <section className="space-y-8">
          {/* Step 1 */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Step 1: Create a Project</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Go to your <strong>Dashboard</strong> and click on <strong>“New Project”</strong>. 
              Provide a meaningful name and optionally add your domain to enable accurate traffic filtering.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Step 2: Get Your API Key</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Once your project is created, you’ll find your unique API key at the top right of the dashboard 
              or inside the project settings. This key identifies your project for event tracking.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 3: Embed the Script</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Paste the following snippet before the closing{' '}
              <code className="bg-gray-200 dark:bg-slate-600 px-1 rounded">&lt;/body&gt;</code> tag on your site.
              Replace <code className="bg-gray-200 dark:bg-slate-600 px-1 rounded">&lt;YOUR-UNIQUE-API-KEY&gt;</code> with your actual key.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-300 dark:border-slate-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">HTML Snippet</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition"
                >
                  {copied ? <><Check size={16} /> Copied!</> : <><ClipboardCopy size={16} /> Copy code</>}
                </button>
              </div>
              <pre className="text-sm p-4 font-mono text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{sdkSnippet}</pre>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What You’ll See in Your Dashboard</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 pl-2">
            <li><strong>Live Events:</strong> View real-time user actions and page visits.</li>
            <li><strong>Top Pages:</strong> Identify high-performing pages.</li>
            <li><strong>Traffic Sources:</strong> See where your traffic is coming from (Google, Twitter, etc.).</li>
            <li><strong>Devices & Browsers:</strong> Understand what users are using to access your site.</li>
            <li><strong>Custom Events:</strong> Track clicks, signups, scrolls, or anything custom with our SDK.</li>
          </ul>
        </section>

        {/* Help Section */}
        <footer className="text-center text-gray-700 dark:text-gray-300 pt-4">
          <p>
            Need help? Visit our{' '}
            <a href="#" className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-700 dark:hover:text-emerald-300 transition">
              documentation
            </a>{' '}
            or contact support from your dashboard.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default IntegrationGuide;
