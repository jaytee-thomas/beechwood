export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  address?: string;
}

export interface EmergencySession {
  id: string;
  userId?: string;
  status: 'active' | 'resolved' | 'cancelled';
  triggeredAt: Date;
  location?: Location;
  contactsAlerted: EmergencyContact[];
  alertsSent: EmergencyAlert[];
  resolvedAt?: Date;
  notes?: string;
}

export interface EmergencyAlert {
  id: string;
  sessionId: string;
  contactId: string;
  type: 'sms' | 'push' | 'call';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: Date;
  deliveredAt?: Date;
  message: string;
  errorMessage?: string;
}

export interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  permission: PermissionState | null;
}

