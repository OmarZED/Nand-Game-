import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const db = getFirestore();

  // Load user progress from Firestore
  const loadUserProgress = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProgress(userDoc.data().progress || {});
      } else {
        // Initialize progress for new users
        const initialProgress = {
          currentLevel: 'level1',
          completedLevels: [],
          lastPlayed: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userId), { progress: initialProgress });
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      // Don't set error state for Firestore errors, just log them
      // This prevents the app from showing error state for non-critical issues
      setUserProgress({
        currentLevel: 'level1',
        completedLevels: [],
        lastPlayed: new Date().toISOString()
      });
    }
  };

  // Update user progress
  const updateProgress = async (newProgress) => {
    if (!user) return;
    
    try {
      const updatedProgress = {
        ...userProgress,
        ...newProgress,
        lastPlayed: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', user.uid), { progress: updatedProgress });
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      // Update local state even if Firestore update fails
      setUserProgress(prev => ({
        ...prev,
        ...newProgress,
        lastPlayed: new Date().toISOString()
      }));
    }
  };

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          await loadUserProgress(user.uid);
        } else {
          setUserProgress(null);
        }
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setError(error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError(error);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    userProgress,
    updateProgress
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 