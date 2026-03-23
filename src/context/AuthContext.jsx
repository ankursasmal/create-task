import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthUser = async () => {

    try {

      const res = await axios.get("https://login-signup-yyxk.onrender.com/api/auth-user", {
        withCredentials: true,
        
      });
// console.log(res.data,'dkmdkmemd eiemiemd')
if(res.data.success===true){
      setUser(res.data.user);
}
    } catch (error) {

      setUser(null);

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    getAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);