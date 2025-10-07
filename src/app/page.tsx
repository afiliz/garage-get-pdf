'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

export default function Home() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const uuidMatch = url.match(/([a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12})/i);
    const uuid = uuidMatch ? uuidMatch[0] : '';

    if (!uuid) {
      alert('Please enter a valid shopgarage.com listing url.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/get-pdf?uuid=${uuid}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('failed to fetch pdf');
      }
      
      // download the pdf buffer
      const disposition = res.headers.get('Content-Disposition');
      const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `${uuid}.pdf`;

      const blob = await res.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error(error);
      alert('Failed to generate pdf. Please check the url and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <div className="text-center">
          <img src="/garage-logo.svg" alt="Garage Logo" className="inline-block w-48 mb-8" />
      </div>
      <div className="w-full max-w-xl bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold text-left mb-6 text-gray-900">
          Get PDF invoice
        </h1>
        <h3 className="text-md text-left mb-6 text-gray-400">
          Fill out the information below to receive a personalized PDF invoice.
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-lg text-gray-400">Your email address (required)</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johnsmith@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition"
            required
          />
          <h2 className="text-lg text-gray-400">Name of invoice recipient (required)</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Smith City Volunteer Fire Department"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition"
            required
          />
          <h2 className="text-lg text-gray-400">shopgarage.com listing URL (required)</h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste shopgarage.com Listing URL"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white-500 border border-gray-300 text-black font-bold py-3 px-4 rounded-xl hover:bg-orange-400 disabled:bg-orange-200 transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate invoice'}
          </button>
        </form>
      </div>
    </main>
  );
}
