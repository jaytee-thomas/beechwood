'use client';

import { useState, useEffect } from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import ContactsList from '@/components/ContactsList';
import EmergencyCountdown from '@/components/EmergencyCountdown';
import AuthForm from '@/components/AuthForm';
import AddContactModal from '@/components/AddContactModal';
import EditContactModal from '@/components/EditContactModal';
import Toast from '@/components/Toast';
import SessionHistory from '@/components/SessionHistory';
import { EmergencyContact, EmergencySession } from '@/types';
import { getEmergencySessions } from '@/lib/sessions';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useEmergencySession } from '@/hooks/useEmergencySession';
import { getContacts } from '@/lib/contacts';
import { getCurrentUser, signOut } from '@/lib/auth';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<EmergencySession[]>([]);
  
  const { location, requestLocation } = useGeolocation();
  const { createEmergencySession, isActive } = useEmergencySession();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadContacts();
    }
  }, [isAuthenticated]);

  async function checkAuth() {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadContacts() {
    try {
      const contactsData = await getContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  }

  async function handleSignOut() {
    await signOut();
    setIsAuthenticated(false);
    setContacts([]);
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleEmergencyTrigger = async () => {
    if (contacts.length === 0) {
      showToast('Please add emergency contacts first!', 'error');
      return;
    }
    await requestLocation();
    setShowCountdown(true);
  };

  const handleCountdownComplete = async () => {
    try {
      const session = await createEmergencySession(contacts, location);
      console.log('Emergency session created:', session);
      showToast('Emergency alerts sent to your contacts!', 'success');
      setShowCountdown(false);
    } catch (error) {
      console.error('Failed to create emergency session:', error);
      showToast('Failed to send emergency alerts. Please try again.', 'error');
      setShowCountdown(false);
    }
  };

  const handleCountdownCancel = () => {
    setShowCountdown(false);
  };

  const handleContactAdded = () => {
    loadContacts();
    showToast('Contact added successfully!', 'success');
  };

  const handleEditClick = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setShowEditContact(true);
  };

  const handleContactUpdated = () => {
    loadContacts();
    showToast('Contact updated successfully!', 'success');
  };

  const handleContactDeleted = () => {
    loadContacts();
    showToast('Contact deleted successfully!', 'success');
  };

  const loadSessions = async () => {
    try {
      const sessionsData = await getEmergencySessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleViewHistory = async () => {
    await loadSessions();
    setShowHistory(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BEACON</h1>
                <p className="text-xs text-gray-600">Emergency Alert System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleViewHistory}
                className="text-sm text-gray-600 hover:text-gray-900"
                title="View emergency history"
              >
                📋 History
              </button>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <div className={`flex items-center justify-center p-3 rounded-lg ${
            isActive ? 'bg-red-100 border border-red-200' : 'bg-green-100 border border-green-200'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-3 ${
              isActive ? 'bg-red-500' : 'bg-green-500'
            }`} />
            <span className={`text-sm font-medium ${
              isActive ? 'text-red-700' : 'text-green-700'
            }`}>
              {isActive ? 'Emergency Active' : 'Ready for Emergency'}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <EmergencyButton 
            onTrigger={handleEmergencyTrigger}
            disabled={isActive || contacts.length === 0}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Emergency Contacts ({contacts.length}/3)
          </h2>
          <ContactsList 
            contacts={contacts}
            onAddClick={() => setShowAddContact(true)}
            onEditClick={handleEditClick}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            How BEACON works:
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Tap the emergency button</li>
            <li>• 3-second countdown to cancel if needed</li>
            <li>• Alerts sent to your emergency contacts</li>
            <li>• Location shared automatically</li>
          </ul>
        </div>
      </main>

      <footer className="mt-auto max-w-md mx-auto h-5 flex items-center justify-center">
        <p className="text-xs text-gray-400">BEACON v1.0</p>
      </footer>

      {showCountdown && (
        <EmergencyCountdown
          onComplete={handleCountdownComplete}
          onCancel={handleCountdownCancel}
          contacts={contacts}
        />
      )}

      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onContactAdded={handleContactAdded}
      />

      <EditContactModal
        isOpen={showEditContact}
        onClose={() => {
          setShowEditContact(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onContactUpdated={handleContactUpdated}
        onContactDeleted={handleContactDeleted}
      />

      <SessionHistory
        sessions={sessions}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
