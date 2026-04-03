import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../../Config";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [decryptedUser, setDecryptedUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); // ✅ ADD THIS

  const decryptUser = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Failed to decrypt user:", error);
      return null;
    }
  };

  useEffect(() => {
    const encrypted = localStorage.getItem("user");
    if (encrypted) {
      const user = decryptUser(encrypted);
      setDecryptedUser(user);
    }
  }, []);

  const username = useMemo(() => {
    return decryptedUser?.employee?.Name?.trim() || "";
  }, [decryptedUser]);

  const value = {
    username,
    decryptedUser,
    selectedClient, // ✅ ADD
    setSelectedClient, // ✅ ADD
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import CryptoJS from "crypto-js";
// import { SECRET_KEY } from "../../Config";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [decryptedUser, setDecryptedUser] = useState(null);

//   // 🔓 Decrypt function
//   const decryptUser = (encryptedData) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
//       const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//       return JSON.parse(decrypted);
//     } catch (error) {
//       console.error("Failed to decrypt user:", error);
//       return null;
//     }
//   };

//   // 📦 Load user from localStorage on app start
//   useEffect(() => {
//     const encrypted = localStorage.getItem("user");
//     if (encrypted) {
//       const user = decryptUser(encrypted);
//       setDecryptedUser(user);
//     }
//   }, []);

//   // 👤 Extract only username
//   const username = useMemo(() => {
//     return decryptedUser?.employee?.Name?.trim() || "";
//   }, [decryptedUser]);

//   const value = {
//     username,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useApp must be used within AppProvider");
//   }
//   return context;
// };
