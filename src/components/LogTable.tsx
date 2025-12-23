'use client';

import { LogEntry } from '@/types';
import { BadgeAlert, BadgeInfo, BadgeCheck, Bug, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogTableProps {
  logs: LogEntry[];
  onClear: () => void;
  isLoading?: boolean;
}

export function LogTable({ logs, onClear, isLoading }: LogTableProps) {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getIcon = (level: string) => {
    switch (level) {
      case 'error': return <BadgeAlert className="w-4 h-4 text-red-500" />;
      case 'warn': return <BadgeAlert className="w-4 h-4 text-yellow-500" />;
      case 'debug': return <Bug className="w-4 h-4 text-blue-500" />;
      default: return <BadgeInfo className="w-4 h-4 text-green-500" />;
    }
  };

  const getRowColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50/50 hover:bg-red-100/50 dark:bg-red-900/10 dark:hover:bg-red-900/20';
      case 'warn': return 'bg-yellow-50/50 hover:bg-yellow-100/50 dark:bg-yellow-900/10 dark:hover:bg-yellow-900/20';
      default: return 'hover:bg-gray-50 dark:hover:bg-gray-800/50';
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4">
      <div className={cn("flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all", selectedLog ? "w-2/3" : "w-full")}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-indigo-500" />
            Logs
            <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">{logs.length}</span>
          </h2>
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <BadgeInfo className="w-6 h-6" />
              </div>
              <p>No logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={cn(
                    "p-3 cursor-pointer transition-colors text-sm group",
                    getRowColor(log.level),
                    selectedLog?.id === log.id && "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 pl-2"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{getIcon(log.level)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn(
                          "text-xs font-medium uppercase px-1.5 py-0.5 rounded",
                          log.level === 'error' ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                          log.level === 'warn' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        )}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.created_at), 'HH:mm:ss.SSS')}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-200 truncate font-mono text-xs">{log.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="w-1/3 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 flex justify-between items-center backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Log Details</h3>
            <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div className="p-4 overflow-auto flex-1 text-sm">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Message</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 font-mono text-gray-800 dark:text-gray-200 break-words">
                  {selectedLog.message}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Level</label>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase",
                    selectedLog.level === 'error' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                  )}>{selectedLog.level}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Time</label>
                  <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                    {format(new Date(selectedLog.created_at), 'PP pp')}
                  </span>
                </div>
              </div>

              {selectedLog.meta && (
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Metadata</label>
                  <pre className="p-3 bg-gray-900 text-gray-50 rounded-lg overflow-auto text-xs font-mono max-h-[300px]">
                    {JSON.stringify(selectedLog.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
