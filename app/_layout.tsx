import "../global.css";

import { AuthProvider, useAuth } from "@/context/auth.context";
import React, { useEffect } from "react";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";

import { ApolloProvider } from "@apollo/client";
import { StyleSheet } from "react-native";
import { client } from "@/graphql/client";

SplashScreen.preventAutoHideAsync();
const Layout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user && segments[0] === "(auth)") {
      return router.replace("/");
    }

    if (!user && segments[0] !== "(auth)") {
      router.replace("/login");
    }
  }, [user, segments, isLoading]);

  return <Slot />;
};

const RootLayout = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ApolloProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
