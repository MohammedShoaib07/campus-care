import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  uid: string;
  email: string;
  role: 'student' | 'faculty';
  name: string;
  rollNumber?: string;
  department?: string;
  designation?: string;
}

interface AuthContextType {
  currentUser: { uid: string; email: string } | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string, role: 'student' | 'faculty', additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string } | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('campusCareUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser({ uid: user.uid, email: user.email });
      setUserData(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'faculty', additionalData?: any) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enforce admin credentials for faculty login
    if (role === 'faculty') {
      if (email !== 'admin@bitm.edu' || password !== '123123') {
        setLoading(false);
        throw new Error('Invalid admin credentials');
      }
      const uid = 'faculty_admin';
      const user = {
        uid,
        email: 'admin@bitm.edu',
        role: 'faculty' as const,
        name: 'Admin',
        department: 'Administration',
        designation: 'Administrator'
      };
      setCurrentUser({ uid, email: user.email });
      setUserData(user);
      localStorage.setItem('campusCareUser', JSON.stringify(user));
      setLoading(false);
      return;
    }
    // Demo: Accept any email/password combination
    const uid = `${role}_${Date.now()}`;
    const user = {
      uid,
      email,
      role,
      name: additionalData?.name || email.split('@')[0],
      ...(role === 'student' && {
        rollNumber: additionalData?.rollNumber || 'DEMO123',
        department: additionalData?.department || 'Computer Science'
      }),
      ...(role === 'faculty' && {
        department: additionalData?.department || 'Computer Science',
        designation: additionalData?.designation || 'Professor'
      })
    };
    
    setCurrentUser({ uid, email });
    setUserData(user);
    
    // Save to localStorage for persistence
    localStorage.setItem('campusCareUser', JSON.stringify(user));
    setLoading(false);
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserData(null);
    localStorage.removeItem('campusCareUser');
      };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};