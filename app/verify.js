import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import logoText from "../assets/logo-text.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../config/api";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);

  const handleVerify = async () => {
    setMessage("");
    setIsError(true);

    if (!code) {
      setMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || data.detail || "Verification failed.");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      setIsError(false);
      setMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        router.replace("/(tabs)/dashboard");
      }, 1500);
    } catch (err) {
      setMessage("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    setIsError(true);

    try {
      const response = await fetch(`${API}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || data.detail || "Failed to resend code.");
        return;
      }

      setIsError(false);
      setMessage("A new code has been sent to your email.");
    } catch (err) {
      setMessage("Cannot connect to server.");
    }
  };

  return (
    <LinearGradient
      colors={["#4da3f5", "#2bbbad"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoText} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Heading */}
          <Text style={styles.headingText}>Verify Your Email</Text>
          <Text style={styles.subtitleText}>
            We sent a 6-digit code to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <InputField
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={(t) => { setCode(t); setMessage(""); }}
              keyboardType="number-pad"
              icon="keypad-outline"
              maxLength={6}
            />

            {message ? (
              <Text
                style={[
                  styles.messageText,
                  !isError && styles.messageSuccess,
                ]}
              >
                {message}
              </Text>
            ) : null}

            <Button
              title="Verify & Complete"
              onPress={handleVerify}
              loading={loading}
            />

            {/* Resend code */}
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResend}
              disabled={loading}
            >
              <Text style={styles.resendText}>
                Didn't receive a code?{" "}
                <Text style={styles.resendLink}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to sign up */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Wrong email? </Text>
            <TouchableOpacity onPress={() => router.replace("/signup")}>
              <Text style={styles.footerLink}>Go back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  backButton: {
    position: "absolute",
    top: 52,
    left: 28,
    zIndex: 10,
    padding: 4,
  },
  backArrow: { fontSize: 24, color: "#fff", fontWeight: "600" },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  logo: { width: 160, height: 50 },
  headingText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  emailText: {
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  messageText: {
    color: "#FFE082",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  messageSuccess: {
    color: "#a7f3d0",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  resendLink: {
    color: "#FBB217",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  footerLink: { color: "#FBB217", fontSize: 14, fontWeight: "700" },
});