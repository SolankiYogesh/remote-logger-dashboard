'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/lib/supabase'; // Import static supabase
import { LogEntry } from '@/types';
import { LogTable } from '@/components/LogTable';
import { LoginScreen } from '@/components/LoginScreen';
// import { SetupScreen } from '@/components/SetupScreen'; // Not needed if we assume central DB setup
import { Activity, RefreshCw, LogOut, Share2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Home() {
  const { currentPackage, login, logout, isLoading } = useSupabase(); // useSupabase signature changed
  const { supabase } =  require('@/lib/supabase'); // Directly import static client or use hook if I updated it to export static
  // Actually, SupabaseContext should just export currentPackage and let us use static supabase client for queries
  // But wait, the previous context exposed `supabase` client.
  // My context refactor removed `supabase` from context. So I should import it from lib/supabase or re-add to context.
  // Let's import from lib/supabase for now since it's static.
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!currentPackage) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('package_name', currentPackage)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data as LogEntry[]);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!currentPackage) return;
    if (!confirm('Are you sure you want to clear logs for this session?')) return;
    
    // Deleting logs for this package only
    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('package_name', currentPackage);

    if (error) {
      console.error('Error clearing logs:', error);
      alert('Failed to clear logs');
    } else {
      setLogs([]);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentPackage) return;
    if (!confirm(`Are you sure you want to delete the account for "${currentPackage}"? This will wipe all logs and cannot be undone.`)) return;

    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('package_name', currentPackage);

    if (error) {
       alert('Error deleting account: ' + error.message);
    } else {
       alert('Account and logs deleted successfully.');
       logout();
    }
  };

  const handleShare = () => {
     const url = new URL(window.location.href);
     url.searchParams.set('package', currentPackage || '');
     navigator.clipboard.writeText(url.toString());
     alert('Link copied to clipboard!');
  };

  useEffect(() => {
    // Auto-login via URL param is disabled for security (requires password)
    // We could support a token in URL if we wanted magic links, but for now removing.
  }, []);

  useEffect(() => {
    if (currentPackage) {
      fetchLogs();

      const channel = supabase
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'logs',
            filter: `package_name=eq.${currentPackage}`,
          },
          (payload: any) => {
            const newLog = payload.new as LogEntry;
            setLogs((current) => [newLog, ...current]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentPackage]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black"><div className="animate-pulse">Loading...</div></div>;
  }

  if (!currentPackage) {
    return <LoginScreen />;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {currentPackage}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Live monitoring dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 text-xs font-medium text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Connected
             </div>
             <button 
                onClick={handleShare}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Share Link"
             >
                <Share2 className="w-5 h-5" />
             </button>
             <button 
                onClick={fetchLogs}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Refresh"
             >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
             </button>
             <button 
                onClick={handleDeleteAccount}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Account"
             >
                <Trash2 className="w-5 h-5" />
             </button>
             <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Logout"
             >
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>

        <LogTable logs={logs} onClear={handleClear} isLoading={loading && logs.length === 0} />
      </div>
    </main>
  );
}
