'use client';

import { Database, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function SetupScreen() {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- Create the logs table
create table public.logs (
  id uuid default gen_random_uuid() primary key,
  level text not null,
  message text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.logs enable row level security;

-- Policies (Public access for demo purposes - adjust for production)
create policy "Allow public insert" on public.logs for insert with check (true);
create policy "Allow public select" on public.logs for select using (true);
create policy "Allow public delete" on public.logs for delete using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.logs;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Setup Required</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            The <code>logs</code> table was not found in your Supabase project.
            <br />
            Run this SQL in your Supabase SQL Editor to get started.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute right-4 top-4">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              title="Copy SQL"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <pre className="p-4 bg-gray-950 text-gray-300 rounded-xl overflow-x-auto text-sm font-mono border border-gray-800 max-h-[400px]">
            {sqlCode}
          </pre>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-4">After running the SQL, refresh this page.</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
                I've run the SQL, Refresh
            </button>
        </div>
      </div>
    </div>
  );
}
