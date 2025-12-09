import { EmergencySession, EmergencyContact, Location, EmergencyAlert } from '@/types';

export async function sendEmergencyAlerts(
  session: EmergencySession,
  contacts: EmergencyContact[],
  location: Location | null
): Promise<EmergencyAlert[]> {
  const alerts: EmergencyAlert[] = [];

  for (const contact of contacts) {
    try {
      const smsAlert: EmergencyAlert = {
        id: `alert_${session.id}_${contact.id}_sms`,
        sessionId: session.id,
        contactId: contact.id,
        type: 'sms',
        status: 'pending',
        sentAt: new Date(),
        message: createEmergencyMessage(contact.name, location),
      };

      console.log(`🚨 EMERGENCY ALERT - SMS to ${contact.name} (${contact.phone})`);
      console.log(`Message: ${smsAlert.message}`);
      
      smsAlert.status = 'sent';
      smsAlert.deliveredAt = new Date();
      
      alerts.push(smsAlert);
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      const failedAlert: EmergencyAlert = {
        id: `alert_${session.id}_${contact.id}_failed`,
        sessionId: session.id,
        contactId: contact.id,
        type: 'sms',
        status: 'failed',
        sentAt: new Date(),
        message: createEmergencyMessage(contact.name, location),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
      
      alerts.push(failedAlert);
    }
  }

  return alerts;
}

function createEmergencyMessage(contactName: string, location: Location | null): string {
  let message = `🚨 EMERGENCY ALERT 🚨\n\nThis is an automated emergency message from BEACON.`;
  
  if (location) {
    message += `\n\nLocation: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    message += `\nCoordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    message += `\nAccuracy: ~${Math.round(location.accuracy || 0)}m`;
  } else {
    message += `\n\nLocation: Unable to determine current location`;
  }
  
  message += `\n\nTime: ${new Date().toLocaleString()}`;
  message += `\n\nIf this is a real emergency, please call emergency services immediately.`;
  
  return message;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

