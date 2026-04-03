import React, { createContext, useContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const AuthContext = createContext();

// 🔐 Secret key for encryption — keep this safe

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  // 🔐 Decrypt stored user data from localStorage
  const decryptUser = (encryptedData) => {
    if (!encryptedData || !SECRET_KEY) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      return decrypted ? JSON.parse(decrypted) : null;
    } catch (error) {
      console.error("Failed to decrypt user:", error);
      return null;
    }
  };
  // const decryptUser = (encryptedData) => {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  //     const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  //     return JSON.parse(decrypted);
  //   } catch (error) {
  //     console.error("Failed to decrypt user:", error);
  //     return null;
  //   }
  // };

  // Encrypt user object before storing
  const encryptUser = (user) => {
    if (!user || !SECRET_KEY) {
      console.error("Encryption failed: Missing data or secret key");
      return null;
    }

    return CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
  };
  // const encryptUser = (user) => {
  //   return CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
  // };

  useEffect(() => {
    const encryptedUser = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("auth") === "true";

    if (encryptedUser && isAuthenticated) {
      const user = decryptUser(encryptedUser);
      if (user) {
        setAuth({
          isAuthenticated: true,
          user,
        });
      } else {
        // corrupted or tampered data
        logout();
      }
    }
  }, []);

  // login
  const login = (user) => {
    const encryptedUser = encryptUser(user);

    if (!encryptedUser) return;

    setAuth({ isAuthenticated: true, user });
    localStorage.setItem("user", encryptedUser);
    localStorage.setItem("auth", "true");
  };
  // const login = (user) => {
  //   const encryptedUser = encryptUser(user);
  //   setAuth({ isAuthenticated: true, user });
  //   localStorage.setItem("user", encryptedUser);
  //   localStorage.setItem("auth", "true");
  // };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem("user");
    localStorage.setItem("auth", "false");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
