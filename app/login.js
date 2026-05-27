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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import InputField from "../components/InputField";
import Button from "../components/Button";
import logoText from "../assets/logo-text.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../config/api";

// ── Forgot Password Modal (3 steps) ──
function ForgotPasswordModal({ visible, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPass("");
    setMessage("");
    setIsError(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleForgot = async () => {
    setMessage("");
    setIsError(false);
    if (!email.trim()) {
      setIsError(true);
      setMessage("Please enter your email.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Request failed.");
      setMessage(data.message || "Reset code sent!");
      setStep(2);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setMessage("");
    setIsError(false);
    if (!code.trim()) {
      setIsError(true);
      setMessage("Please enter the code.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/reset-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Verification failed.");
      setResetToken(data.reset_token);
      setIsError(false);
      setMessage("Code verified! Enter your new password.");
      setStep(3);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setMessage("");
    setIsError(false);
    if (!newPassword || !confirmPass) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPass) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Reset failed.");
      setIsError(false);
      setMessage(data.message || "Password reset successful!");
      setTimeout(handleClose, 2000);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={modal.overlay}>
        <View style={modal.container}>
          {/* Step indicator */}
          <View style={modal.stepRow}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[modal.stepBar, i <= step && modal.stepBarActive]}
              />
            ))}
          </View>

          {/* Close button */}
          <TouchableOpacity onPress={handleClose} style={modal.closeBtn}>
            <Text style={modal.closeTxt}>✕</Text>
          </TouchableOpacity>

          {step === 1 && (
            <>
              <Text style={modal.title}>Forgot Password?</Text>
              <Text style={modal.subtitle}>
                Enter your email and we'll send you a reset code.
              </Text>
              <InputField
                placeholder="Email Address"
                value={email}
                onChangeText={(t) => { setEmail(t); setMessage(""); }}
                keyboardType="email-address"
                icon="mail-outline"
              />
              {!!message && (
                <Text style={[modal.msg, isError ? modal.error : modal.success]}>
                  {message}
                </Text>
              )}
              <Button
                title={loading ? "Sending..." : "Send Reset Code"}
                onPress={handleForgot}
                loading={loading}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={modal.title}>Check Your Email</Text>
              <Text style={modal.subtitle}>
                We sent a 6-digit code to{" "}
                <Text style={{ fontWeight: "700" }}>{email}</Text>
              </Text>
              <InputField
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={(t) => { setCode(t); setMessage(""); }}
                keyboardType="number-pad"
                icon="keypad-outline"
                maxLength={6}
              />
              {!!message && (
                <Text style={[modal.msg, isError ? modal.error : modal.success]}>
                  {message}
                </Text>
              )}
              <Button
                title={loading ? "Verifying..." : "Verify Code"}
                onPress={handleVerify}
                loading={loading}
              />
              <TouchableOpacity
                onPress={() => { setStep(1); setCode(""); setMessage(""); }}
                style={modal.backBtn}
              >
                <Text style={modal.backTxt}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={modal.title}>Set New Password</Text>
              <Text style={modal.subtitle}>
                Choose a strong password for your account.
              </Text>
              <InputField
                placeholder="New Password"
                value={newPassword}
                onChangeText={(t) => { setNewPassword(t); setMessage(""); }}
                secureTextEntry
                icon="lock-closed-outline"
              />
              <InputField
                placeholder="Confirm New Password"
                value={confirmPass}
                onChangeText={(t) => { setConfirmPass(t); setMessage(""); }}
                secureTextEntry
                icon="lock-closed-outline"
              />
              {!!message && (
                <Text style={[modal.msg, isError ? modal.error : modal.success]}>
                  {message}
                </Text>
              )}
              <Button
                title={loading ? "Resetting..." : "Reset Password"}
                onPress={handleReset}
                loading={loading}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Main Login Screen ──
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();


    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();


      if (!response.ok) {
        setMessage(data.detail || data.message || "Invalid email or password.");
        return;
      }

      const role = data.user?.role;

      // Block admin and superadmin from mobile app
      if (role === "admin" || role === "superadmin") {
        setMessage("Admin accounts are not accessible on mobile.");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      router.replace("/(tabs)/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err.message);
      setMessage("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#4da3f5", "#2bbbad"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <ForgotPasswordModal
        visible={showForgot}
        onClose={() => setShowForgot(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoText} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Greeting */}
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.subtitleText}>
            Sign in to continue using Coursify
          </Text>

          {/* Form Card */}
          <View style={styles.card}>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={(text) => { setEmail(text); setMessage(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail-outline"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={(text) => { setPassword(text); setMessage(""); }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock-closed-outline"
            />

            {message ? (
              <Text style={styles.messageText}>{message}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => setShowForgot(true)}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button title="Sign In" onPress={handleLogin} loading={loading} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
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
  logoContainer: { alignItems: "center", marginBottom: 28 },
  logo: { width: 160, height: 50 },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 0.2,
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
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 6,
    marginTop: -4,
  },
  forgotText: { color: "rgba(255,255,255,0.75)", fontSize: 13 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  footerLink: { color: "#FBB217", fontSize: 14, fontWeight: "700" },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: "#2a9fd6",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 400,
  },
  stepRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  stepBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
  },
  stepBarActive: {
    backgroundColor: "#e5f34f",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  closeTxt: {
    fontSize: 18,
    color: "rgba(255,255,255,0.75)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 16,
    lineHeight: 20,
  },
  msg: {
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  error: { color: "#ef4444" },
  success: { color: "#22c55e" },
  backBtn: { alignSelf: "center", marginTop: 12 },
  backTxt: { color: "#20AFAB", fontSize: 13, fontWeight: "600" },
});