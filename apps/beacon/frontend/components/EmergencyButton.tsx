'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface EmergencyButtonProps {
  onTrigger: () => void;
  disabled?: boolean;
}

export default function EmergencyButton({ onTrigger, disabled = false }: EmergencyButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!disabled) {
      onTrigger();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={disabled}
          className={`
            w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed
            text-white font-bold text-xl shadow-2xl
            transform transition-all duration-150 active:scale-95
            no-select
            ${!disabled ? 'emergency-pulse' : ''}
            ${isPressed ? 'scale-95' : ''}
          `}
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-lg font-extrabold">EMERGENCY</div>
            <div className="text-sm font-medium opacity-90">TAP TO ALERT</div>
          </div>
        </Button>
        
        {!disabled && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 opacity-20 animate-ping" />
        )}
      </div>
      
      <p className="text-center text-gray-600 text-sm mt-6 max-w-xs">
        {disabled 
          ? 'Emergency session is active' 
          : 'Tap the button to alert your emergency contacts with your location'
        }
      </p>
    </div>
  );
}

