import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Link } from "expo-router";
import OtpVerifyModal from "@/components/ui/otp-verify-modal";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/auth.context";

//
const SignupScreen = () => {
  const [otpError, setOtpError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string; username: string }>();

  const email = watch("email");

  const { signup, verifyOtp } = useAuth();

  const onSubmit = async (data: { email: string; username: string }) => {
    const response = await signup(data);
    console.log(response);

    if (response?.message)
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: response.message,
      });

    if (response?.expiresAt) {
      setIsModalVisible(true);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <SafeAreaView className="w-full p-4 h-full bg-black-100">
        <Text className="text-xl sm:text-4xl text-center text-white mb-8">
          Create an account
        </Text>
        <View className="gap-8">
          <View className="gap-4">
            <Text className="text-[#f1f1f1] text-xl sm:text-3xl">Email</Text>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholder="hello@world.com"
                  className="rounded-md px-3 py-4 border border-[#222222] text-xl placeholder:text-[#848484] text-[#848484]"
                />
              )}
            />
            {errors.email && (
              <Text className="text-[#ff0000] text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View className="gap-4">
            <Text className="text-[#f1f1f1] text-xl sm:text-3xl">Username</Text>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                pattern: {
                  value: /^(?![0-9]+$)[a-zA-Z0-9._]+$/,
                  message: "Invalid username",
                },
              }}
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  value={field.value}
                  onBlur={field.onBlur}
                  placeholder="hello_world"
                  className="rounded-md px-3 py-4 border border-[#222222] text-xl placeholder:text-[#848484] text-[#848484]"
                />
              )}
            />
            {errors.username && (
              <Text className="text-[#ff0000] text-sm">
                {errors.username.message}
              </Text>
            )}
          </View>
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="rounded-md text-lg text-[#0a0a0a] w-full bg-white p-3 mt-4"
        >
          <Text className="text-center">Signup</Text>
        </Pressable>

        <Text className="ml-auto mt-4 text-[#777777]">
          Don't have an account?{" "}
          <Link href="/login">
            <Text className="text-[#a2fa64]">Login</Text>
          </Link>
        </Text>

        <OtpVerifyModal
          errorMessage={otpError}
          handleVerify={async (otp) => {
            if (otp.length !== 6) return setOtpError("Invalid Otp");
            setOtpError("");
            const response = await verifyOtp(email, otp);
            if (response?.message) return setOtpError(response?.message);
          }}
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />

        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SignupScreen;
