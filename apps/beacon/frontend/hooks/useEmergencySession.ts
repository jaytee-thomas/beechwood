'use client';

import { useState, useCallback } from 'react';
import { EmergencySession, EmergencyContact, Location } from '@/types';
import { sendEmergencyAlerts } from '@/utils/emergency';

export function useEmergencySession() {
  const [activeSession, setActiveSession] = useState<EmergencySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createEmergencySession = useCallback(async (
    contacts: EmergencyContact[],
    location: Location | null
  ): Promise<EmergencySession> => {
    setIsLoading(true);

    try {
      const session: EmergencySession = {
        id: `session_${Date.now()}`,
        status: 'active',
        triggeredAt: new Date(),
        location: location || undefined,
        contactsAlerted: contacts,
        alertsSent: [],
      };

      const alerts = await sendEmergencyAlerts(session, contacts, location);
      session.alertsSent = alerts;

      setActiveSession(session);
      setIsLoading(false);

      return session;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const resolveSession = useCallback(async (sessionId: string, notes?: string) => {
    if (activeSession && activeSession.id === sessionId) {
      const updatedSession: EmergencySession = {
        ...activeSession,
        status: 'resolved',
        resolvedAt: new Date(),
        notes,
      };
      
      setActiveSession(updatedSession);
      console.log('Session resolved:', updatedSession);
    }
  }, [activeSession]);

  const cancelSession = useCallback(async (sessionId: string) => {
    if (activeSession && activeSession.id === sessionId) {
      const updatedSession: EmergencySession = {
        ...activeSession,
        status: 'cancelled',
        resolvedAt: new Date(),
      };
      
      setActiveSession(updatedSession);
      console.log('Session cancelled:', updatedSession);
    }
  }, [activeSession]);

  return {
    activeSession,
    isActive: activeSession?.status === 'active',
    isLoading,
    createEmergencySession,
    resolveSession,
    cancelSession,
  };
}

