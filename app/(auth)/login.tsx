import {
  Button,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Modal } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import OtpVerifyModal from "@/components/ui/otp-verify-modal";
import { useAuth } from "@/context/auth.context";

const LoginScreen = () => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<{ email: string }>();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const { login, verifyOtp } = useAuth();

  const onSubmit = async (data: { email: string }) => {
    const response = await login(data);

    console.log(response);

    if (response?.expiresAt) {
      setIsModalVisible(true);
    }
  };

  const email = watch("email");

  return (
    <SafeAreaProvider>
      <StatusBar hidden />

      <SafeAreaView className="w-full p-4 bg-black-100 h-full">
        <Text className="text-xl sm:text-4xl text-center text-white mb-8">
          Welcome back! Please login to your account.
        </Text>
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

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="rounded-md text-lg text-[#0a0a0a] w-full bg-white p-3 mt-4"
        >
          <Text className="text-center">Login</Text>
        </Pressable>

        <Text className="ml-auto mt-4 text-[#777777]">
          Don't have an account?{" "}
          <Link href="/signup">
            <Text className="text-[#a2fa64]">Signup</Text>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginScreen;
