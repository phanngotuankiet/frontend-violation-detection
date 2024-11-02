import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  setAccessToken: (token: string | null) => void;
  setEmail: (email: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );

  const logout = () => {
    setAccessToken(null);
    setEmail(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
  };

  const value = {
    accessToken,
    email,
    setAccessToken: (token: string | null) => {
      setAccessToken(token);

      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    },
    setEmail: (email: string | null) => {
      setEmail(email);
      
      if (email) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
