import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserContextType {
  userMail: string;
  setUserMail: (email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userMail, setUserMail] = useState<string>(localStorage.getItem('userMail') || "");

  useEffect(() => {
    localStorage.setItem('userMail', userMail);
  }, [userMail]);

  return (
    <UserContext.Provider value={{ userMail, setUserMail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
