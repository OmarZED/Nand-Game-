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
  const [userRole, setUserRole] = useState(null);
  const db = getFirestore();

  // Load user data including role
  const loadUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProgress(userData.progress || {});
        setUserRole(userData.role || 'student');
      } else {
        // Initialize new user data
        const initialData = {
          progress: {
            currentLevel: 'level1',
            completedLevels: [],
            lastPlayed: new Date().toISOString()
          },
          role: 'student' // Default role is student
        };
        await setDoc(doc(db, 'users', userId), initialData);
        setUserProgress(initialData.progress);
        setUserRole(initialData.role);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserProgress({
        currentLevel: 'level1',
        completedLevels: [],
        lastPlayed: new Date().toISOString()
      });
      setUserRole('student');
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
      await setDoc(doc(db, 'users', user.uid), { 
        progress: updatedProgress,
        role: userRole 
      });
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
      setUserProgress(prev => ({
        ...prev,
        ...newProgress,
        lastPlayed: new Date().toISOString()
      }));
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, newRole) => {
    if (!user || userRole !== 'admin') return;
    
    try {
      await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
      if (userId === user.uid) {
        setUserRole(newRole);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          await loadUserData(user.uid);
        } else {
          setUserProgress(null);
          setUserRole(null);
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
    userRole,
    updateProgress,
    updateUserRole
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