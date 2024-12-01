import { Button, Modal, Pressable, Text, View } from "react-native";
import { OtpInput, OtpInputProps } from "react-native-otp-entry";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";

interface OtpVerifyModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  handleVerify?: (otp: string) => void;
  errorMessage?: string;
}

const OtpVerifyModal = ({
  handleVerify,
  onClose,
  isOpen,
  errorMessage,
}: OtpVerifyModalProps) => {
  const [otp, setOtp] = useState<string>("");
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
          <View className="border-b border-red-100 p-4">
            <Text className="text-xl sm:text-4xl text-center text-black-100">
              Enter OTP
            </Text>
          </View>

          <View className="gap-4 h-full items-center justify-center p-4">
            <Text className="text-black-100 text-xl sm:text-3xl">
              We have sent an OTP to your email address. Please enter it below.
            </Text>
            <OtpInput onTextChange={(otp) => setOtp(otp)} numberOfDigits={6} />
            {errorMessage && (
              <Text className="text-[#ff0000] text-sm">{errorMessage}</Text>
            )}
            <Button title="Submit" onPress={() => handleVerify?.(otp)} />
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default OtpVerifyModal;
