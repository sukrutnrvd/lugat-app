import * as SecureStore from "expo-secure-store";

import { LOGIN, SIGNUP, VERIFY_OTP } from "@/graphql/mutation";
import { SplashScreen, useFocusEffect } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { GET_ME } from "@/graphql/queries";
import { client } from "@/graphql/client";

interface User {
  id: string;
  username: string;
  email: string;
}

interface IAuthContext {
  user?: User | null;
  login: (user: Omit<User, "id" | "username">) => Promise<any>;
  logout: () => void;
  signup: (user: Omit<User, "id">) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  getMe: () => void;
  isAuthenticated: () => Promise<boolean>;
  isLoading?: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => Promise.resolve({ success: false, expiresAt: "" }),
  logout: () => {},
  signup: () => Promise.resolve({ success: false, expiresAt: "" }),
  verifyOtp: () => Promise.resolve({ success: false, token: "" }),
  getMe: () => {},
  isAuthenticated: () => Promise.resolve(false),
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getMe = async () => {
    try {
      const { data, loading } = await client.query({
        query: GET_ME,
      });

      setUser({
        id: data.me.id,
        email: data.me.email,
        username: data.me.username,
      });
    } catch (error) {
      console.log("getMe query error", error);
      await SecureStore.deleteItemAsync("token");
      setUser(null);
    } finally {
      SplashScreen.hideAsync();
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  };

  const signup = async (user: Omit<User, "id">) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGNUP,
        variables: user,
      });
      return data.signup;
    } catch (error) {
      console.log("signup mutation error", error);
      return error;
    }
  };

  const login = async (user: Omit<User, "id" | "username">) => {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: {
          email: user.email,
        },
      });
      return data.login;
    } catch (error) {
      return error;
    }
  };

  const isAuthenticated = async () => {
    const token = await SecureStore.getItemAsync("token");
    return !!token;
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const { data } = await client.mutate({
        mutation: VERIFY_OTP,
        variables: {
          email,
          otp,
        },
      });
      console.log(data);

      const token = data.verifyOtp.token;
      console.log(token);

      await SecureStore.setItemAsync("token", token);
      await getMe();
    } catch (error) {
      console.log("verifyOtp mutation error", error);
      return error;
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        getMe,
        isAuthenticated,
        verifyOtp,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
