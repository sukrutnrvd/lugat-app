import { Button } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/context/auth.context";

const RootLayout = () => {
  const { logout, user } = useAuth();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...(user ? { title: `${user.username}'s Dictionaries` } : {}),
          headerRight: () => <Button title="Logout" onPress={logout} />,
        }}
      />
      <Stack.Screen
        name="dictionaries"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create-word"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />

      <Stack.Screen
        name="word/update-word/[id]"
        options={{
          presentation: "modal",
          animation: "fade_from_bottom",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
