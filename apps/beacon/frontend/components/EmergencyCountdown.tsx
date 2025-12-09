'use client';

import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { EmergencyContact } from '@/types';

interface EmergencyCountdownProps {
  onComplete: () => void;
  onCancel: () => void;
  contacts: EmergencyContact[];
  countdownSeconds?: number;
}

export default function EmergencyCountdown({ 
  onComplete, 
  onCancel, 
  contacts,
  countdownSeconds = 3 
}: EmergencyCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      onComplete();
    }
  }, [timeLeft, isCompleted, onComplete]);

  const handleCancel = () => {
    setTimeLeft(0);
    setIsCompleted(true);
    onCancel();
  };

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <div className="text-center">
        <div className="mb-6">
          <div className={`
            w-24 h-24 mx-auto mb-4 rounded-full border-4 border-red-500 
            flex items-center justify-center countdown-animation
            ${timeLeft <= 1 ? 'bg-red-500' : 'bg-white'}
          `}>
            <span className={`
              text-3xl font-bold 
              ${timeLeft <= 1 ? 'text-white' : 'text-red-500'}
            `}>
              {timeLeft}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Emergency Alert Sending
          </h2>
          <p className="text-gray-600">
            {timeLeft > 0 
              ? `Alerting contacts in ${timeLeft} second${timeLeft !== 1 ? 's' : ''}...`
              : 'Sending emergency alerts...'
            }
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Alerting these contacts:
          </h3>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-900">{contact.name}</span>
                <span className="text-xs text-gray-500">{contact.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {timeLeft > 0 && (
          <div className="space-y-3">
            <Button
              onClick={handleCancel}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 font-semibold"
            >
              CANCEL ALERT
            </Button>
            <p className="text-xs text-gray-500">
              Tap to cancel the emergency alert
            </p>
          </div>
        )}

        {timeLeft === 0 && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600">Sending alerts...</span>
          </div>
        )}
      </div>
    </Modal>
  );
}

