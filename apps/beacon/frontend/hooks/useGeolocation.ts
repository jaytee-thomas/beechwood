'use client';

import { useState, useCallback } from 'react';
import { Location, GeolocationState } from '@/types';

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permission: null,
  });

  const requestLocation = useCallback(async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        location,
        loading: false,
        permission: 'granted' as PermissionState,
      }));

      return location;
    } catch (error) {
      const errorMessage = error instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(error.code)
        : 'Failed to get location';

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        permission: 'denied' as PermissionState,
      }));

      return null;
    }
  }, []);

  return {
    ...state,
    requestLocation,
  };
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location access denied. Please enable location services.';
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case GeolocationPositionError.TIMEOUT:
      return 'Location request timed out.';
    default:
      return 'An unknown error occurred while retrieving location.';
  }
}

