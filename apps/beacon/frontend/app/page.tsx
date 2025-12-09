'use client';

import { useState } from 'react';
import EmergencyButton from '@/components/EmergencyButton';
import ContactsList from '@/components/ContactsList';
import EmergencyCountdown from '@/components/EmergencyCountdown';
import { EmergencyContact } from '@/types';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useEmergencySession } from '@/hooks/useEmergencySession';

const mockContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Emergency Contact 1',
    phone: '+1234567890',
    relationship: 'Family',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Emergency Contact 2',
    phone: '+0987654321',
    relationship: 'Friend',
    isPrimary: false,
  },
];

export default function HomePage() {
  const [contacts] = useState<EmergencyContact[]>(mockContacts);
  const [showCountdown, setShowCountdown] = useState(false);
  
  const { location, requestLocation } = useGeolocation();
  const { createEmergencySession, isActive } = useEmergencySession();

  const handleEmergencyTrigger = async () => {
    await requestLocation();
    setShowCountdown(true);
  };

  const handleCountdownComplete = async () => {
    const session = await createEmergencySession(contacts, location);
    console.log('Emergency session created:', session);
    setShowCountdown(false);
  };

  const handleCountdownCancel = () => {
    setShowCountdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">BEACON</h1>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">
            Emergency Alert System
          </p>
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
            disabled={isActive}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Emergency Contacts
          </h2>
          <ContactsList contacts={contacts} />
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

      {showCountdown && (
        <EmergencyCountdown
          onComplete={handleCountdownComplete}
          onCancel={handleCountdownCancel}
          contacts={contacts}
        />
      )}
    </div>
  );
}
