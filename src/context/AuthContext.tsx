import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CheckIn, Assessment, SupportResource } from '../types';
import { INITIAL_USER, SEED_CHECK_INS, VERIFIED_SUPPORT_RESOURCES } from '../services/mockData';
import { generateRuleBasedAssessment } from '../services/assessmentEngine';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  checkIns: CheckIn[];
  assessments: Assessment[];
  resources: SupportResource[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, displayName: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateConsent: (consented: boolean) => Promise<void>;
  addCheckIn: (data: Omit<CheckIn, 'id' | 'userId' | 'createdAt'>) => Promise<Assessment>;
  deleteCheckIn: (id: string) => Promise<void>;
  deleteJournal: (checkInId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  exportData: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mhm_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem('mhm_checkins');
    return saved ? JSON.parse(saved) : SEED_CHECK_INS;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('mhm_assessments');
    if (saved) return JSON.parse(saved);
    // Generate initial assessment from seed check-ins
    if (SEED_CHECK_INS.length > 0) {
      const initialAsmt = generateRuleBasedAssessment(SEED_CHECK_INS[0], SEED_CHECK_INS);
      return [initialAsmt];
    }
    return [];
  });

  const [resources] = useState<SupportResource[]>(VERIFIED_SUPPORT_RESOURCES);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('mhm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mhm_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mhm_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('mhm_assessments', JSON.stringify(assessments));
  }, [assessments]);

  // Handle Supabase Auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // User logged in via Supabase
        setUser(prev => ({
          id: session.user.id,
          email: session.user.email || 'user@example.com',
          displayName: session.user.user_metadata?.display_name || prev?.displayName || 'User',
          preferredLanguage: prev?.preferredLanguage || 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          notificationEnabled: prev?.notificationEnabled ?? true,
          consentGiven: prev?.consentGiven ?? false,
          createdAt: session.user.created_at || new Date().toISOString()
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(prev => ({
          id: session.user.id,
          email: session.user.email || 'user@example.com',
          displayName: session.user.user_metadata?.display_name || prev?.displayName || 'User',
          preferredLanguage: prev?.preferredLanguage || 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          notificationEnabled: prev?.notificationEnabled ?? true,
          consentGiven: prev?.consentGiven ?? false,
          createdAt: session.user.created_at || new Date().toISOString()
        }));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Local mode fallback
        const newUser: UserProfile = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          email,
          displayName: email.split('@')[0],
          ageRange: '25-34',
          preferredLanguage: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          notificationEnabled: true,
          consentGiven: true,
          consentDate: new Date().toISOString(),
          consentVersion: 'v1.0-2025',
          createdAt: new Date().toISOString()
        };
        setUser(newUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, displayName: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } }
        });
        if (error) throw error;
      }
      const newUser: UserProfile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: displayName || email.split('@')[0],
        ageRange: '25-34',
        preferredLanguage: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        notificationEnabled: true,
        consentGiven: false,
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const updateConsent = async (consented: boolean) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      consentGiven: consented,
      consentDate: consented ? new Date().toISOString() : undefined,
      consentVersion: consented ? 'v1.0-2025' : undefined
    };
    setUser(updated);
  };

  const addCheckIn = async (data: Omit<CheckIn, 'id' | 'userId' | 'createdAt'>): Promise<Assessment> => {
    if (!user) throw new Error('Authentication required');

    const newCheckIn: CheckIn = {
      id: 'chk-' + Date.now().toString(36),
      userId: user.id,
      ...data,
      createdAt: new Date().toISOString()
    };

    const updatedCheckIns = [newCheckIn, ...checkIns];
    setCheckIns(updatedCheckIns);

    // Compute longitudinal assessment
    const newAssessment = generateRuleBasedAssessment(newCheckIn, updatedCheckIns);
    setAssessments(prev => [newAssessment, ...prev]);

    return newAssessment;
  };

  const deleteCheckIn = async (id: string) => {
    setCheckIns(prev => prev.filter(c => c.id !== id));
    setAssessments(prev => prev.filter(a => a.checkInId !== id));
  };

  const deleteJournal = async (checkInId: string) => {
    setCheckIns(prev => prev.map(c => c.id === checkInId ? { ...c, journalText: undefined } : c));
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const exportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      userProfile: {
        id: user?.id,
        email: user?.email,
        displayName: user?.displayName,
        preferredLanguage: user?.preferredLanguage,
        timezone: user?.timezone,
        consentVersion: user?.consentVersion,
        consentDate: user?.consentDate
      },
      checkIns,
      assessments
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mental-health-monitor-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    localStorage.removeItem('mhm_user');
    localStorage.removeItem('mhm_checkins');
    localStorage.removeItem('mhm_assessments');
    setCheckIns([]);
    setAssessments([]);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkIns,
        assessments,
        resources,
        isLoading,
        login,
        register,
        logout,
        updateConsent,
        addCheckIn,
        deleteCheckIn,
        deleteJournal,
        updateProfile,
        exportData,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
