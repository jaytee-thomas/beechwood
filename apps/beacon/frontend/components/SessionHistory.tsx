'use client';

import { EmergencySession } from '@/types';

interface SessionHistoryProps {
  sessions: EmergencySession[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionHistory({ sessions, isOpen, onClose }: SessionHistoryProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Emergency History</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-gray-600">No emergency sessions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {session.triggeredAt.toLocaleString()}
                      </span>
                    </div>

                    {session.location && (
                      <div className="mt-2 text-sm text-gray-600">
                        📍 Location: {session.location.latitude.toFixed(4)}, {session.location.longitude.toFixed(4)}
                      </div>
                    )}

                    {session.resolvedAt && (
                      <div className="mt-2 text-sm text-gray-600">
                        ✅ Resolved: {session.resolvedAt.toLocaleString()}
                      </div>
                    )}

                    {session.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        📝 {session.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

