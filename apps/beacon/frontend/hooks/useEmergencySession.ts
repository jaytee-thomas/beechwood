'use client';

import { useState, useCallback } from 'react';
import { EmergencySession, EmergencyContact, Location } from '@/types';
import { createEmergencySession as createSession, resolveSession as resolveSessionDb, cancelSession as cancelSessionDb } from '@/lib/emergency';

export function useEmergencySession() {
  const [activeSession, setActiveSession] = useState<EmergencySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createEmergencySession = useCallback(async (
    contacts: EmergencyContact[],
    location: Location | null
  ): Promise<EmergencySession> => {
    setIsLoading(true);

    try {
      const session = await createSession(contacts, location);
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
      await resolveSessionDb(sessionId, notes);
      
      const updatedSession: EmergencySession = {
        ...activeSession,
        status: 'resolved',
        resolvedAt: new Date(),
        notes,
      };
      
      setActiveSession(updatedSession);
    }
  }, [activeSession]);

  const cancelSession = useCallback(async (sessionId: string) => {
    if (activeSession && activeSession.id === sessionId) {
      await cancelSessionDb(sessionId);
      
      const updatedSession: EmergencySession = {
        ...activeSession,
        status: 'cancelled',
        resolvedAt: new Date(),
      };
      
      setActiveSession(updatedSession);
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
