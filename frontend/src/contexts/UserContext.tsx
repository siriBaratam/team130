import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserStats {
  quizzesTaken: number;
  questionsAnswered: number;
  summariesGenerated: number;
  flashcardsCreated: number;
  totalStudyTime: number; // in minutes
}

export interface UserSettings {
  username: string;
  quizDifficulty: 'beginner' | 'intermediate' | 'advanced';
  aiTemperature: number;
  responseLength: 'small' | 'medium' | 'large';
  thinkingStyle: 'analytical' | 'creative' | 'balanced';
  defaultStudyMode: string;
  language: string;
  motivationLevel: 'intense' | 'gentle' | 'balanced';
  emailNotifications: boolean;
  notificationFrequency: 'daily' | 'weekly' | 'monthly';
  highContrast: boolean;
  largeText: boolean;
}

interface UserContextType {
  stats: UserStats;
  settings: UserSettings;
  updateStats: (newStats: Partial<UserStats>) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  clearData: () => void;
}

const defaultStats: UserStats = {
  quizzesTaken: 0,
  questionsAnswered: 0,
  summariesGenerated: 0,
  flashcardsCreated: 0,
  totalStudyTime: 0,
};

const defaultSettings: UserSettings = {
  username: 'StudyExplorer',
  quizDifficulty: 'intermediate',
  aiTemperature: 0.7,
  responseLength: 'medium',
  thinkingStyle: 'balanced',
  defaultStudyMode: 'Quiz',
  language: 'English',
  motivationLevel: 'balanced',
  emailNotifications: true,
  notificationFrequency: 'weekly',
  highContrast: false,
  largeText: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('study-kit-stats');
    const savedSettings = localStorage.getItem('study-kit-settings');

    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Failed to parse saved stats:', error);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prevStats => {
      const updated = { ...prevStats, ...newStats };
      localStorage.setItem('study-kit-stats', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };
      localStorage.setItem('study-kit-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const clearData = () => {
    setStats(defaultStats);
    setSettings(defaultSettings);
    localStorage.removeItem('study-kit-stats');
    localStorage.removeItem('study-kit-settings');
  };

  return (
    <UserContext.Provider value={{
      stats,
      settings,
      updateStats,
      updateSettings,
      clearData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};