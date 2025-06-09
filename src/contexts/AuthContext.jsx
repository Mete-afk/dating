
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for logged-in user in localStorage on initial load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = (email, password, profileData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return false; // User already exists
    }

    const newUser = { 
      id: Date.now(), // Simple ID generation
      email, 
      password, // In a real app, hash the password
      profile: {
        name: profileData.name,
        age: profileData.age,
        images: profileData.images || [],
        interests: profileData.interests || [],
        bio: profileData.bio || '',
        gender: profileData.gender || 'female', // Default gender
      }
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    // Initialize settings for new user
    localStorage.setItem(`userSettings_${newUser.id}`, JSON.stringify({
      discoveryGender: ['female', 'male', 'other'],
      showMeOnApp: true,
      ageRange: [18, 55],
      distance: 50,
      notifications: { newMatches: true, newMessages: true, promotions: false },
    }));
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password); // Plain text password check (NOT FOR PRODUCTION)

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const updateUserProfile = (profileData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      profile: { ...currentUser.profile, ...profileData },
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Also update in the 'users' list if it exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  
  const deleteAccount = () => {
    if (!currentUser) return;
    
    // Remove user from users list
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('users', JSON.stringify(users));

    // Remove all data associated with the user
    localStorage.removeItem(`currentUser`);
    localStorage.removeItem(`userSettings_${currentUser.id}`);
    localStorage.removeItem(`swipedProfiles_${currentUser.id}`);
    localStorage.removeItem(`matches_${currentUser.id}`);
    localStorage.removeItem(`negativeChats_${currentUser.id}`);
    // Potentially loop through dummyProfiles to remove chats, but for this demo, it's okay.
    // In a real DB, this would be more robust.

    setCurrentUser(null);
    // Navigation to onboarding/login will be handled by ProtectedRoute or similar logic in App.jsx
  };


  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

