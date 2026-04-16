import { useState, useEffect, useCallback } from 'react';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';

const CALL_STORAGE_KEY = 'pending_call_data';

export type CallResult = 'customer deny' | 'successful' | 'no response' | null;

interface PendingCallData<T = any> {
  phone: string;
  startedAt: number;
  pending: boolean;
  metadata?: T;
}

export const usePhoneCallFlow = <T = any>() => {
  const [currentPhone, setCurrentPhone] = useState<string | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [callResult, setCallResult] = useState<CallResult>(null);
  const [metadata, setMetadata] = useState<T | null>(null);

  // Load pending call on mount
  useEffect(() => {
    const checkPendingCall = async () => {
      const { value } = await Preferences.get({ key: CALL_STORAGE_KEY });
      if (value) {
        const data: PendingCallData<T> = JSON.parse(value);
        if (data.pending) {
          setCurrentPhone(data.phone);
          setMetadata(data.metadata || null);
          setShowResultSheet(true);
          // Clear immediately after loading into memory
          await Preferences.remove({ key: CALL_STORAGE_KEY });
        }
      }
    };
    checkPendingCall();
  }, []);

  // Listen for app state changes (resume)
  useEffect(() => {
    const handler = App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        const { value } = await Preferences.get({ key: CALL_STORAGE_KEY });
        if (value) {
          const data: PendingCallData<T> = JSON.parse(value);
          if (data.pending) {
            setCurrentPhone(data.phone);
            setMetadata(data.metadata || null);
            setShowResultSheet(true);
            // Clear immediately after loading into memory
            await Preferences.remove({ key: CALL_STORAGE_KEY });
          }
        }
      }
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, []);

  const startCall = useCallback(async (phone: string, extraMetadata?: T) => {
    const callData: PendingCallData<T> = {
      phone,
      startedAt: Date.now(),
      pending: true,
      metadata: extraMetadata
    };

    // Save state before leaving app
    await Preferences.set({
      key: CALL_STORAGE_KEY,
      value: JSON.stringify(callData),
    });

    setCurrentPhone(phone);
    setMetadata(extraMetadata || null);
    setCallResult(null);

    // Open native dialer
    window.open(`tel:${phone}`, '_system');
  }, []);

  const submitCallResult = useCallback(async (result: CallResult) => {
    setCallResult(result);
    setShowResultSheet(false);

    // Clear pending state
    await Preferences.remove({ key: CALL_STORAGE_KEY });

    console.log(`Call result for ${currentPhone}: ${result}`);
  }, [currentPhone]);

  return {
    startCall,
    currentPhone,
    showResultSheet,
    setShowResultSheet,
    submitCallResult,
    callResult,
    metadata,
    setMetadata
  };
};
