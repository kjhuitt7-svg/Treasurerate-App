import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type BusinessProfile = {
  name: string;
  owner: string;
  services: string;
  location: string;
  contact: string;
  tone: string;
  avoid: string;
};

export type Run = {
  id: string;
  agentId: string;
  agentName: string;
  minutesSaved: number;
  preview: string;
  output: string;
  at: string;
};

const EMPTY: BusinessProfile = { name: '', owner: '', services: '', location: '', contact: '', tone: '', avoid: '' };
const K_PROFILE = 'tr.profile.v1';
const K_RUNS = 'tr.runs.v1';
const MAX_RUNS = 100;

type Ctx = {
  ready: boolean;
  profile: BusinessProfile;
  saveProfile: (p: BusinessProfile) => Promise<void>;
  runs: Run[];
  addRun: (r: Omit<Run, 'id' | 'at'>) => Promise<void>;
  clearAll: () => Promise<void>;
};

const StoreCtx = createContext<Ctx | null>(null);

// Everything stays on the device in v1: no account, no server-side storage.
export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>(EMPTY);
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [p, r] = await Promise.all([AsyncStorage.getItem(K_PROFILE), AsyncStorage.getItem(K_RUNS)]);
        if (p) setProfile({ ...EMPTY, ...JSON.parse(p) });
        if (r) setRuns(JSON.parse(r));
      } catch {
        // Corrupt or unavailable storage: start fresh.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const saveProfile = async (p: BusinessProfile) => {
    setProfile(p);
    await AsyncStorage.setItem(K_PROFILE, JSON.stringify(p));
  };

  const addRun = async (r: Omit<Run, 'id' | 'at'>) => {
    const run: Run = { ...r, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString() };
    const next = [run, ...runs].slice(0, MAX_RUNS);
    setRuns(next);
    await AsyncStorage.setItem(K_RUNS, JSON.stringify(next));
  };

  const clearAll = async () => {
    setProfile(EMPTY);
    setRuns([]);
    await AsyncStorage.multiRemove([K_PROFILE, K_RUNS]);
  };

  return (
    <StoreCtx.Provider value={{ ready, profile, saveProfile, runs, addRun, clearAll }}>{children}</StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function profileFilled(p: BusinessProfile) {
  return Boolean(p.name.trim() && p.services.trim());
}
