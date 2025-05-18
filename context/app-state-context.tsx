'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { setCookie, getCookie, removeCookie } from '@/lib/cookies';

interface AppState {
  isWalletConnected: boolean;
  isConsultationCompleted: boolean;
  consultationResult: any | null;
  setConsultationCompleted: (completed: boolean) => void;
  setConsultationResult: (result: any) => void;
  resetConsultation: () => void;
  isMockPortfolio: boolean;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey } = useWallet();
  const [isConsultationCompleted, setIsConsultationCompletedState] =
    useState(false);
  const [consultationResult, setConsultationResultState] = useState<any | null>(
    null
  );
  const [isMockPortfolio, setIsMockPortfolio] = useState(false);

  // Check cookies and localStorage for consultation status on initial load
  useEffect(() => {
    const mockStatus =
      typeof window !== 'undefined'
        ? localStorage.getItem('solport-mock-consultation-completed')
        : null;
    const mockResult =
      typeof window !== 'undefined'
        ? localStorage.getItem('solport-mock-portfolio')
        : null;
    const storedStatus = getCookie('isConsultationCompleted');
    const storedResult = getCookie('consultationResult');

    // First check for mock data (higher priority)
    if (mockStatus === 'true' && mockResult) {
      try {
        setIsConsultationCompletedState(true);
        setConsultationResultState(JSON.parse(mockResult));
        setIsMockPortfolio(true);
      } catch (e) {
        console.error('Failed to parse stored mock consultation result', e);
      }
    }
    // Then check for regular cookie data
    else if (storedStatus === 'true') {
      setIsConsultationCompletedState(true);

      if (storedResult) {
        try {
          setConsultationResultState(JSON.parse(storedResult));
          setIsMockPortfolio(false);
        } catch (e) {
          console.error('Failed to parse stored consultation result', e);
        }
      }
    }
  }, []);

  // Update wallet connection state
  useEffect(() => {
    if (connected) {
      setCookie('isWalletConnected', 'true');
      setCookie('walletAddress', publicKey?.toBase58() || '');
    } else {
      removeCookie('isWalletConnected');
      removeCookie('walletAddress');
    }
  }, [connected, publicKey]);

  // Update cookies when consultation status changes
  useEffect(() => {
    if (isConsultationCompleted) {
      setCookie('isConsultationCompleted', 'true');
    } else {
      removeCookie('isConsultationCompleted');
    }

    if (consultationResult) {
      setCookie('consultationResult', JSON.stringify(consultationResult));

      // If this is a mock portfolio, also store in localStorage
      if (isMockPortfolio && typeof window !== 'undefined') {
        localStorage.setItem('solport-mock-consultation-completed', 'true');
        localStorage.setItem(
          'solport-mock-portfolio',
          JSON.stringify(consultationResult)
        );
      }
    } else {
      removeCookie('consultationResult');
    }
  }, [isConsultationCompleted, consultationResult, isMockPortfolio]);

  // Reset consultation data when wallet is disconnected
  useEffect(() => {
    if (!connected && (isConsultationCompleted || consultationResult)) {
      // Don't reset mock portfolios when wallet disconnects
      if (!isMockPortfolio) {
        resetConsultation();
      }
    }
  }, [connected, isConsultationCompleted, consultationResult, isMockPortfolio]);

  const setConsultationCompleted = (completed: boolean) => {
    setIsConsultationCompletedState(completed);
  };

  const setConsultationResult = (result: any) => {
    // Check if this is a mock portfolio
    const isMock = result?.model_output?.portfolio_id === '42E...8d9B' || false;
    setIsMockPortfolio(isMock);
    setConsultationResultState(result);
  };

  const resetConsultation = () => {
    setIsConsultationCompletedState(false);
    setConsultationResultState(null);
    setIsMockPortfolio(false);
    removeCookie('isConsultationCompleted');
    removeCookie('consultationResult');

    // Clear localStorage items related to consultation
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('solport-consultation') ||
            key.startsWith('solport-portfolio') ||
            key.startsWith('solport-mock'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        isWalletConnected: connected,
        isConsultationCompleted,
        consultationResult,
        setConsultationCompleted,
        setConsultationResult,
        resetConsultation,
        isMockPortfolio,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
